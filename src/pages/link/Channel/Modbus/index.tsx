import { Badge, Button, Card, Divider, Dropdown, Input, Menu, Modal } from 'antd';
import { useDomFullHeight } from '@/hooks';
import '../index.less';
import SearchComponent from '@/components/SearchComponent';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import PermissionButton from '@/components/PermissionButton';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'umi';
import ChannelCard from '../channelCard';
import { PageContainer } from '@ant-design/pro-layout';
import Service from './service';
import SaveChannel from './saveChannel';
import SavePoint from './savePoint';
import Import from './import';
import { onlyMessage } from '@/utils/util';
import Export from './Export';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import Ellipsis from '@/components/Ellipsis';

export const service = new Service('');

const NewModbus = () => {
  const { minHeight } = useDomFullHeight(`.modbus`);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('link/Channel/Modbus');
  const [param, setParam] = useState({});
  const [activeKey, setActiveKey] = useState<any>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [visiblePoint, setVisiblePoint] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const [pointDetail, setPointDetail] = useState<any>({});
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [masterList, setMasterList] = useState<any>([]);
  const [filterList, setFilterList] = useState([]);
  const masterId = useRef<string>('');
  const [subscribeTopic] = useSendWebsocketMessage();
  const wsRef = useRef<any>();
  const [pointList, setPointList] = useState<any>([]);
  const [currentData, setCurrentData] = useState<any>({});

  const collectMap = new Map();
  collectMap.set('running', 'success');
  collectMap.set('error', 'error');
  collectMap.set('stopped', 'warning');

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <PermissionButton
          isPermission={permission.view}
          icon={<ExportOutlined />}
          type="default"
          onClick={() => {
            setExportVisible(true);
          }}
        >
          批量导出点位
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="2">
        <PermissionButton
          isPermission={permission.update}
          icon={<ImportOutlined />}
          onClick={() => {
            setImportVisible(true);
          }}
        >
          批量导入点位
        </PermissionButton>
      </Menu.Item>
    </Menu>
  );

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
      fixed: 'left',
    },
    {
      title: '功能码',
      valueType: 'select',
      dataIndex: 'function',
      valueEnum: {
        Coils: { text: '线圈寄存器', status: 'Coils' },
        HoldingRegisters: { text: '保存寄存器', status: 'HoldingRegisters' },
        InputRegisters: { text: '输入寄存器', status: 'InputRegisters' },
      },
      render: (_, record: any) => <>{record.function?.text}</>,
    },
    {
      title: '从站ID',
      valueType: 'digit',
      dataIndex: 'unitId',
    },
    {
      title: '寄存器数量',
      search: false,
      render: (_, record: any) => <>{record.parameter?.quantity}</>,
    },
    {
      title: '地址',
      dataIndex: 'address',
      valueType: 'digit',
    },
    {
      title: '当前数据',
      search: false,
      // ellipsis: true,
      width: 150,
      render: (record: any) => (
        <a
          onClick={() => {
            if (currentData[record?.id]) {
              const arr = currentData[record?.id].match(/[\S]{1,4}/g);
              Modal.info({
                title: '当前数据',
                content: (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {arr.map((item: any, index: number) => (
                      <div>
                        寄存器{index + 1}: {item}
                      </div>
                    ))}
                  </div>
                ),
              });
            }
          }}
        >
          <Ellipsis title={currentData[record?.id] || ''} />
        </a>
      ),
    },
    {
      title: '采集状态',
      dataIndex: 'collectState',
      valueType: 'select',
      valueEnum: {
        running: { text: '采集中', status: 'running' },
        error: { text: '失败', status: 'error' },
        stopped: { text: '已停止', status: 'stopped' },
      },
      render: (_, record: any) => (
        <>
          <Badge
            status={collectMap.get(record.collectState?.value)}
            text={record.collectState?.text}
          />
          {record.collectState?.value === 'error' && (
            <SearchOutlined
              style={{ color: '#1d39c4', marginLeft: 3 }}
              onClick={() => {
                Modal.error({
                  title: '失败原因',
                  content: <div>{record.errorReason}</div>,
                });
              }}
            />
          )}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: intl.formatMessage({
            id: 'pages.data.option.disabled',
            defaultMessage: '禁用',
          }),
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
      filterMultiple: false,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
          onClick={() => {
            setPointDetail(record);
            setVisiblePoint(true);
          }}
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          key={'action'}
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${
                record.state.value !== 'disabled' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: async () => {
              if (record.state.value === 'disabled') {
                await service.enablePoint([record.id]);
              } else {
                await service.disablePoint([record.id]);
              }
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            },
          }}
          isPermission={permission.action}
          tooltip={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.state.value !== 'disabled' ? 'disabled' : 'enabled'}`,
              defaultMessage: record.state.value !== 'disabled' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          disabled={record.state.value === 'enabled'}
          popConfirm={{
            title: (
              <div
                style={{
                  width: 185,
                }}
              >
                该点位已被设备绑定，删除后将清空与设备的绑定关系，确定要删除吗?
              </div>
            ),
            disabled: record.state.value === 'enabled',
            onConfirm: async () => {
              const resp: any = await service.deletePoint(record.id);
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            },
          }}
          key="delete"
          type="link"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const getMaster = () => {
    service
      .queryMaster({
        paging: false,
        sorts: [
          {
            name: 'createTime',
            order: 'desc',
          },
        ],
      })
      .then((res: any) => {
        if (res.status === 200) {
          setMasterList(res.result);
          setFilterList(res.result);
          setActiveKey(res.result?.[0]?.id);
          masterId.current = res.result?.[0]?.id;
        }
      });
  };

  //启用禁用
  const actions = (id: string, data: any) => {
    service.editMaster(id, data).then((res) => {
      if (res.status === 200) {
        onlyMessage('操作成功');
        getMaster();
      }
    });
  };

  const deteleMaster = (id: string) => {
    service.deleteMaster(id).then((res) => {
      if (res.status === 200) {
        onlyMessage('删除成功');
        getMaster();
      }
    });
  };

  useEffect(() => {
    masterId.current = activeKey;
    actionRef.current?.reload();
  }, [activeKey]);

  useEffect(() => {
    getMaster();
  }, []);

  useEffect(() => {
    if (pointList && activeKey) {
      const id = `collector-data-modbus`;
      const topic = `/collector/MODBUS_TCP/${activeKey}/data`;
      wsRef.current = subscribeTopic?.(id, topic, {
        pointId: pointList.map((item: any) => item.id),
      })
        ?.pipe(map((res: any) => res.payload))
        .subscribe((payload: any) => {
          const { pointId, hex } = payload;
          current[pointId] = hex;
          setCurrentData({ ...current });
        });
    }
    return () => wsRef.current && wsRef.current?.unsubscribe();
  }, [pointList]);

  const masterMemo = useMemo(
    () => (
      <Export
        data={masterList}
        close={() => {
          setExportVisible(false);
          actionRef.current?.reload();
        }}
      />
    ),
    [masterList],
  );

  return (
    <PageContainer>
      <Card className="modbus" style={{ minHeight }}>
        <div className="item">
          <div className="item-left">
            <div style={{ width: 220 }}>
              <Input.Search
                placeholder="请输入名称"
                allowClear
                onSearch={(value) => {
                  const items = masterList.filter((item: any) => item.name.match(value));
                  if (value) {
                    setFilterList(items);
                    setActiveKey(items?.[0].id);
                  } else {
                    setFilterList(masterList);
                    setActiveKey(masterList?.[0].id);
                  }
                }}
              />
              <PermissionButton
                onClick={() => {
                  setVisible(true);
                  setCurrent({});
                }}
                isPermission={permission.add}
                key="add"
                icon={<PlusOutlined />}
                type="primary"
                style={{ width: '100%', marginTop: 16, marginBottom: 16 }}
              >
                新增
              </PermissionButton>
              <div className="item-left-list">
                {filterList.map((item: any) => (
                  <ChannelCard
                    active={activeKey === item.id}
                    data={item}
                    onClick={() => {
                      setActiveKey(item.id);
                    }}
                    actions={
                      <>
                        <PermissionButton
                          isPermission={permission.update}
                          key="edit"
                          onClick={() => {
                            setVisible(true);
                            setCurrent(item);
                          }}
                          type={'link'}
                          style={{ padding: 0 }}
                        >
                          <EditOutlined />
                          编辑
                        </PermissionButton>
                        <Divider type="vertical" />
                        <PermissionButton
                          isPermission={permission.update}
                          key="enbale"
                          type={'link'}
                          style={{ padding: 0 }}
                          popConfirm={{
                            title: intl.formatMessage({
                              id: `pages.data.option.${
                                item.state.value !== 'disabled' ? 'disabled' : 'enabled'
                              }.tips`,
                              defaultMessage: '确认禁用？',
                            }),
                            onConfirm: async () => {
                              if (item.state.value === 'disabled') {
                                actions(item.id, { state: 'enabled' });
                              } else {
                                actions(item.id, { state: 'disabled' });
                              }
                            },
                          }}
                        >
                          {item.state.value === 'enabled' ? (
                            <StopOutlined />
                          ) : (
                            <PlayCircleOutlined />
                          )}
                          {item.state.value === 'enabled' ? '禁用' : '启用'}
                        </PermissionButton>
                        <Divider type="vertical" />
                        <PermissionButton
                          isPermission={permission.delete}
                          style={{ padding: 0 }}
                          disabled={item.state.value === 'enabled'}
                          tooltip={{
                            title: item.state.value === 'enabled' ? '请先禁用该通道，再删除。' : '',
                          }}
                          popConfirm={{
                            title: (
                              <div
                                style={{
                                  width: 190,
                                }}
                              >
                                该通道已被设备绑定，删除后将清空与设备的绑定关系，确定要删除吗？
                              </div>
                            ),
                            disabled: item.state.value === 'enabled',
                            onConfirm: async () => {
                              deteleMaster(item.id);
                            },
                          }}
                          key="delete"
                          type="link"
                        >
                          <DeleteOutlined />
                        </PermissionButton>
                      </>
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="item-right">
            <div style={{ width: '100%' }}>
              <SearchComponent<any>
                field={columns}
                target="modbus"
                onSearch={(value) => {
                  actionRef.current?.reset?.();
                  setParam(value);
                }}
              />
              <ProTable
                actionRef={actionRef}
                params={param}
                columns={columns}
                rowKey="id"
                scroll={{ x: 1000 }}
                search={false}
                headerTitle={
                  <>
                    <PermissionButton
                      onClick={() => {
                        setPointDetail({});
                        setVisiblePoint(true);
                      }}
                      isPermission={permission.add}
                      key="add"
                      icon={<PlusOutlined />}
                      type="primary"
                      style={{ marginRight: 10 }}
                    >
                      {intl.formatMessage({
                        id: 'pages.data.option.add',
                        defaultMessage: '新增',
                      })}
                    </PermissionButton>
                    <Dropdown key={'more'} overlay={menu} placement="bottom">
                      <Button>批量操作</Button>
                    </Dropdown>
                  </>
                }
                request={async (params) => {
                  if (masterId.current) {
                    const res = await service.queryPoint(masterId.current, {
                      ...params,
                      sorts: [{ name: 'createTime', order: 'desc' }],
                    });
                    setPointList(res.result.data);
                    return {
                      code: res.message,
                      result: {
                        data: res.result.data,
                        pageIndex: res.result.pageIndex,
                        pageSize: res.result.pageSize,
                        total: res.result.total,
                      },
                      status: res.status,
                    };
                  } else {
                    return {
                      code: 200,
                      result: {
                        data: [],
                        pageIndex: 0,
                        pageSize: 0,
                        total: 0,
                      },
                      status: 200,
                    };
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Card>
      {visible && (
        <SaveChannel
          data={current}
          close={() => {
            setVisible(false);
            getMaster();
            // actionRef.current?.reload();
          }}
        />
      )}
      {visiblePoint && (
        <SavePoint
          data={pointDetail}
          masterId={activeKey}
          close={() => {
            setVisiblePoint(false);
            actionRef.current?.reload();
          }}
        />
      )}
      {importVisible && (
        <Import
          masterId={activeKey}
          close={() => {
            setImportVisible(false);
            actionRef.current?.reload();
          }}
          // visible={importVisible}
        />
      )}
      {exportVisible && masterMemo}
    </PageContainer>
  );
};
export default NewModbus;

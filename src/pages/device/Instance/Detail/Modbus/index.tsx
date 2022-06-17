import PermissionButton from '@/components/PermissionButton';
import { Badge, Card, Empty, Input, Tabs, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/link/Channel/Opcua/Access/index.less';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { service } from '@/pages/link/Channel/Modbus';
import Save from '@/pages/link/Channel/Modbus/Save';
import { InstanceModel } from '@/pages/device/Instance';
import AddPoint from '@/pages/link/Channel/Modbus/Access/addPoint';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

const Modbus = () => {
  const intl = useIntl();
  const { permission } = PermissionButton.usePermission('link/Channel/Modbus');
  const [bindList, setBindList] = useState<any>([]);
  const [opcId, setOpcId] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [channel, setChannel] = useState<any>({});
  const [pointVisiable, setPointVisiable] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const [deviceId, setDeviceId] = useState<any>('');
  const [data, setData] = useState<any>([]);
  const [subscribeTopic] = useSendWebsocketMessage();
  const [propertyValue, setPropertyValue] = useState<any>({});
  const wsRef = useRef<any>();
  const [filterList, setFilterList] = useState([]);

  const { minHeight } = useDomFullHeight(`.${styles.list}`);

  const columns: ProColumns<any>[] = [
    {
      title: '属性ID',
      dataIndex: 'metadataId',
      ellipsis: true,
    },
    {
      title: '功能码',
      render: (record: any) => <>{record.function?.text}</>,
    },
    {
      title: '读取起始位置',
      render: (record: any) => <>{record.codecConfig?.readIndex}</>,
    },
    {
      title: '读取长度',
      render: (record: any) => <>{record.codecConfig?.readLength}</>,
    },
    {
      title: '值',
      width: 120,
      render: (record: any) => <>{propertyValue[record?.metadataId] || '-'}</>,
    },
    {
      title: '状态',
      width: 90,
      dataIndex: 'state',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
          onClick={() => {
            setPointVisiable(true);
            setCurrent(record);
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
              const item = {
                ...record,
                state: record.state.value === 'enabled' ? 'disabled' : 'enabled',
              };
              await service.saveMetadataConfig(opcId, deviceId, item);
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
          tooltip={{
            title:
              record.state.value === 'disabled'
                ? intl.formatMessage({
                    id: 'pages.data.option.remove',
                    defaultMessage: '删除',
                  })
                : '请先禁用该点位，再删除。',
          }}
          popConfirm={{
            title: '确认删除',
            disabled: record.state.value === 'enabled',
            onConfirm: async () => {
              const resp: any = await service.removeMetadataConfig(record.id);
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

  const getModbus = (id: string) => {
    service
      .queryMetadatabyId({
        paging: false,
        terms: [
          {
            column: 'id$bind-modbus',
            value: id,
          },
        ],
      })
      .then((res) => {
        setBindList(res.result);
        setFilterList(res.result);
        setOpcId(res.result?.[0]?.id);
        setParam({
          opcId: res.result?.[0]?.id,
        });
      });
  };

  useEffect(() => {
    const { id } = InstanceModel.detail;
    setDeviceId(id);
    if (id) {
      getModbus(id);
    }
  }, [visible]);

  useEffect(() => {
    const { id, productId } = InstanceModel.detail;
    const point = data.map((item: any) => item.metadataId);
    const wsId = `instance-info-property-${id}-${productId}-${point.join('-')}`;
    const topic = `/dashboard/device/${productId}/properties/realTime`;
    wsRef.current = subscribeTopic?.(wsId, topic, {
      deviceId: deviceId,
      properties: data.map((item: any) => item.metadataId),
      history: 1,
    })
      ?.pipe(map((res: any) => res.payload))
      .subscribe((payload: any) => {
        const { value } = payload;
        propertyValue[value.property] = value.formatValue;
        setPropertyValue({ ...propertyValue });
      });
  }, [data]);

  return (
    <Card className={styles.list} style={{ minHeight }}>
      <div style={{ display: 'flex' }}>
        <div>
          <div style={{ width: '250px', marginTop: 15 }}>
            <Input.Search
              placeholder="请输入通道名称"
              allowClear
              onSearch={(value) => {
                if (value) {
                  const items = bindList.filter((item: any) => item.name.match(value));
                  setFilterList(items);
                  if (items.length === 0) {
                    setParam({
                      opcId: '',
                    });
                  } else {
                    setParam({
                      opcId: items[0]?.id,
                    });
                    setOpcId(items[0]?.id);
                  }
                } else {
                  setFilterList(bindList);
                  if (opcId) {
                    setParam({
                      opcId: opcId,
                    });
                  } else {
                    setParam({
                      opcId: '',
                    });
                  }
                }
              }}
            />

            <PermissionButton
              onClick={() => {
                setVisible(true);
                setChannel({});
              }}
              isPermission={permission.add}
              key="add"
              icon={<PlusOutlined />}
              type="dashed"
              style={{ width: '100%', margin: '16px 0 18px 0' }}
            >
              新增通道
            </PermissionButton>
          </div>
          {filterList.length > 0 ? (
            <Tabs
              style={{ height: 600 }}
              tabPosition={'left'}
              activeKey={opcId}
              onChange={(e) => {
                setOpcId(e);
                // console.log(e);
                // actionRef.current?.reload();
                setParam({
                  opcId: e,
                });
              }}
            >
              {filterList.map((item: any) => (
                <Tabs.TabPane
                  key={item.id}
                  tab={
                    <div className={styles.left}>
                      <Tooltip title={item.name}>
                        <div className={styles.text}>{item.name}</div>
                      </Tooltip>
                      <PermissionButton
                        isPermission={permission.update}
                        key="edit"
                        onClick={() => {
                          setVisible(true);
                          setChannel(item);
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
                      </PermissionButton>
                      <PermissionButton
                        isPermission={permission.delete}
                        style={{ padding: 0 }}
                        popConfirm={{
                          title: '确认删除',
                          onConfirm: async () => {
                            const resp: any = await service.remove(item.id);
                            if (resp.status === 200) {
                              getModbus(deviceId);
                              onlyMessage(
                                intl.formatMessage({
                                  id: 'pages.data.option.success',
                                  defaultMessage: '操作成功!',
                                }),
                              );
                            }
                          },
                        }}
                        key="delete"
                        type="link"
                      >
                        <DeleteOutlined />
                      </PermissionButton>
                    </div>
                  }
                ></Tabs.TabPane>
              ))}
            </Tabs>
          ) : (
            <Empty description={<>暂无绑定通道</>} />
          )}
        </div>
        <div style={{ width: '100%' }}>
          <ProTable
            actionRef={actionRef}
            params={param}
            columns={columns}
            rowKey="id"
            search={false}
            headerTitle={
              <>
                <PermissionButton
                  onClick={() => {
                    setPointVisiable(true);
                    setCurrent({});
                  }}
                  isPermission={permission.add}
                  key="add"
                  icon={<PlusOutlined />}
                  type="primary"
                >
                  {intl.formatMessage({
                    id: 'pages.data.option.add',
                    defaultMessage: '新增',
                  })}
                </PermissionButton>
              </>
            }
            request={async (params) => {
              if (!params.opcId) {
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
              const res = await service.queryMetadataConfig(params.opcId, deviceId, {
                ...params.terms,
                sorts: [{ name: 'createTime', order: 'desc' }],
              });
              setData(res.result.data);
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
            }}
          />
        </div>
      </div>

      {visible && (
        <Save
          data={channel}
          close={() => {
            setVisible(false);
          }}
          device={InstanceModel.detail}
        />
      )}
      {pointVisiable && (
        <AddPoint
          deviceId={deviceId}
          opcUaId={opcId}
          data={current}
          close={() => {
            setPointVisiable(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </Card>
  );
};
export default Modbus;

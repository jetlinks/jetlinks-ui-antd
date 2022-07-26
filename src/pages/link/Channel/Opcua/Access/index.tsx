import PermissionButton from '@/components/PermissionButton';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Card, Empty, Input, Popconfirm, Tabs, Tooltip } from 'antd';
import { useIntl, useLocation } from 'umi';
import { useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  DisconnectOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import BindDevice from '@/pages/link/Channel/Opcua/Access/bindDevice';
import { service } from '@/pages/link/Channel/Opcua';
import encodeQuery from '@/utils/encodeQuery';
import styles from './index.less';
import AddPoint from './addPoint';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

const Access = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const location = useLocation<string>();
  const [param, setParam] = useState<any>({
    terms: [{ column: 'deviceId', value: '' }],
  });
  const [opcUaId, setOpcUaId] = useState<any>('');
  const { permission } = PermissionButton.usePermission('link/Channel/Opcua');
  const [deviceVisiable, setDeviceVisiable] = useState<boolean>(false);
  const [pointVisiable, setPointVisiable] = useState<boolean>(false);
  const [bindList, setBindList] = useState<any>([]);
  const [deviceId, setDeviceId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [current, setCurrent] = useState<any>({});
  const [data, setData] = useState<any>([]);
  const [subscribeTopic] = useSendWebsocketMessage();
  const [propertyValue, setPropertyValue] = useState<any>({});
  const [bindDeviceId, setBindDeviceId] = useState<any>('');
  const wsRef = useRef<any>();
  const [filterList, setFilterList] = useState([]);
  const { minHeight } = useDomFullHeight(`.opcuaAccess`, 26);

  const columns: ProColumns<any>[] = [
    {
      title: '属性ID',
      dataIndex: 'property',
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'OPC点位ID',
      dataIndex: 'opcPointId',
      ellipsis: true,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
    },
    {
      title: '值',
      width: 100,
      render: (record: any) => <>{propertyValue[record?.property] || '-'}</>,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 100,
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disable' ? 'error' : 'success'} />
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
                record.state.value !== 'disable' ? 'disable' : 'enable'
              }.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: async () => {
              console.log(record);
              if (record.state.value === 'disable') {
                await service.enablePoint(bindDeviceId, [record.id]);
              } else {
                await service.stopPoint(bindDeviceId, [record.id]);
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
              id: `pages.data.option.${record.state.value !== 'disable' ? 'disable' : 'enable'}`,
              defaultMessage: record.state.value !== 'disable' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state.value !== 'disable' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          disabled={record.state.value === 'enable'}
          tooltip={{
            title:
              record.state.value === 'disable'
                ? intl.formatMessage({
                    id: 'pages.data.option.remove',
                    defaultMessage: '删除',
                  })
                : '请先禁用该点位，再删除。',
          }}
          popConfirm={{
            title: '确认删除',
            disabled: record.state.value === 'enable',
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

  const getBindList = (params: any) => {
    service.getBindList(params).then((res: any) => {
      if (res.status === 200) {
        if (res.result && res.result !== 0) {
          setProductId(res.result[0]?.productId);
          setBindDeviceId(res.result[0]?.id);
          setBindList(res.result);
          setFilterList(res.result);
          setDeviceId(res.result[0]?.deviceId);
          setParam({
            terms: [{ column: 'deviceId', value: res.result[0]?.deviceId }],
          });
        }
      }
    });
  };

  useEffect(() => {
    if (productId && deviceId) {
      const point = data.map((item: any) => item.property);
      const id = `instance-info-property-${deviceId}-${productId}-${point.join('-')}`;
      const topic = `/dashboard/device/${productId}/properties/realTime`;
      wsRef.current = subscribeTopic?.(id, topic, {
        deviceId: deviceId,
        properties: data.map((item: any) => item.property),
        history: 1,
      })
        ?.pipe(map((res) => res.payload))
        .subscribe((payload: any) => {
          const { value } = payload;
          propertyValue[value.property] = value.formatValue;
          setPropertyValue({ ...propertyValue });
          // console.log(propertyValue)
        });
    }
    return () => wsRef.current && wsRef.current?.unsubscribe();
  }, [data]);

  useEffect(() => {
    const item = new URLSearchParams(location.search);
    const id = item.get('id');
    if (id) {
      setOpcUaId(id);
      getBindList(
        encodeQuery({
          terms: {
            opcUaId: id,
          },
        }),
      );
    }
  }, []);

  return (
    <PageContainer>
      <Card className={styles.list}>
        <div className="opcuaAccess" style={{ display: 'flex', minHeight }}>
          <div>
            <div style={{ width: '250px', marginTop: 15 }}>
              <Input.Search
                placeholder="请输入绑定设备名称"
                allowClear
                onSearch={(value) => {
                  if (value) {
                    const items = bindList.filter((item: any) => item.name.match(value));
                    setFilterList(items);
                    if (items.length === 0) {
                      setParam({
                        terms: [{ column: 'deviceId', value: '' }],
                      });
                    } else {
                      setParam({
                        terms: [{ column: 'deviceId', value: items[0]?.deviceId }],
                      });
                      setDeviceId(items[0]?.deviceId);
                    }
                  } else {
                    setFilterList(bindList);
                    if (deviceId) {
                      setParam({
                        terms: [{ column: 'deviceId', value: deviceId }],
                      });
                    } else {
                      setParam({
                        terms: [{ column: 'deviceId', value: '' }],
                      });
                    }
                  }
                }}
              />
              <PermissionButton
                onClick={() => {
                  setDeviceVisiable(true);
                }}
                isPermission={permission.add}
                key="add"
                icon={<PlusOutlined />}
                type="dashed"
                style={{ width: '100%', margin: '16px 0 18px 0' }}
              >
                绑定设备
              </PermissionButton>
            </div>
            {filterList.length > 0 ? (
              <Tabs
                tabPosition={'left'}
                // defaultActiveKey={deviceId}
                activeKey={deviceId}
                style={{ height: 600 }}
                onChange={(e) => {
                  setDeviceId(e);
                  const items = bindList.find((item: any) => item.deviceId === e);
                  setProductId(items?.productId);
                  setBindDeviceId(items?.id);
                  setParam({
                    terms: [{ column: 'deviceId', value: e }],
                  });
                }}
              >
                {filterList.map((item: any) => (
                  <Tabs.TabPane
                    key={item.deviceId}
                    tab={
                      <div className={styles.left}>
                        <Tooltip title={item.name}>
                          <div className={styles.text}>{item.name}</div>
                        </Tooltip>
                        <Popconfirm
                          title="确认解绑该设备嘛？"
                          onConfirm={() => {
                            service.unbind([item.deviceId], opcUaId).then((res: any) => {
                              if (res.status === 200) {
                                onlyMessage('解绑成功');
                                getBindList(
                                  encodeQuery({
                                    terms: {
                                      opcUaId: opcUaId,
                                    },
                                  }),
                                );
                              }
                            });
                          }}
                          okText="是"
                          cancelText="否"
                        >
                          <DisconnectOutlined className={styles.icon} />
                        </Popconfirm>
                      </div>
                    }
                  ></Tabs.TabPane>
                ))}
              </Tabs>
            ) : (
              <Empty description={<>暂无绑定设备</>} />
            )}
          </div>
          <div style={{ width: '100%' }}>
            <ProTable
              actionRef={actionRef}
              params={param}
              columns={columns}
              rowKey="id"
              columnEmptyText={''}
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
                  <div style={{ marginLeft: 10 }}>
                    <Input.Search
                      placeholder="请输入属性"
                      allowClear
                      onSearch={(value) => {
                        console.log(value);
                        if (value) {
                          setParam({
                            terms: [
                              { column: 'deviceId', value: deviceId },
                              { column: 'property', value: `%${value}%`, termType: 'like' },
                            ],
                          });
                        } else {
                          setParam({
                            terms: [{ column: 'deviceId', value: deviceId }],
                          });
                        }
                      }}
                    />
                  </div>
                </>
              }
              request={async (params) => {
                if (Object.keys(params).length && !params.terms[0].value) {
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
                const res = await service.PointList({
                  ...params,
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
      </Card>
      {deviceVisiable && (
        <BindDevice
          id={opcUaId}
          close={() => {
            setDeviceVisiable(false);
            getBindList(
              encodeQuery({
                terms: {
                  opcUaId: opcUaId,
                },
              }),
            );
          }}
        />
      )}
      {pointVisiable && (
        <AddPoint
          deviceId={deviceId}
          opcUaId={opcUaId}
          data={current}
          close={() => {
            setPointVisiable(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Access;

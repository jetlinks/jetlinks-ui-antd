import PermissionButton from '@/components/PermissionButton';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Card, Empty, Input, message, Popconfirm, Tabs } from 'antd';
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

const Access = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const location = useLocation<string>();
  const [param, setParam] = useState({});
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

  const columns: ProColumns<any>[] = [
    {
      title: '属性ID',
      dataIndex: 'property',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: 'OPC点位ID',
      dataIndex: 'opcPointId',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
    },
    {
      title: '值',
      // dataIndex: '4',
      render: (record: any) => <>{propertyValue[record.property]}</>,
    },
    {
      title: '状态',
      dataIndex: 'state',
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
              id: `pages.data.option.${record.state.value !== 'disable' ? 'disable' : 'good'}.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: async () => {
              if (record.state.value === 'disable') {
                await service.enablePoint(record.deviceId, [record.id]);
              } else {
                await service.stopPoint(record.deviceId, [record.id]);
              }
              message.success(
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
              id: `pages.data.option.${record.state.value !== 'disable' ? 'disable' : 'good'}`,
              defaultMessage: record.state.value !== 'disable' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state.value !== 'disable' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          disabled={record.state.value === 'good'}
          tooltip={{
            title:
              record.state.value === 'disable'
                ? intl.formatMessage({
                    id: 'pages.data.option.remove',
                    defaultMessage: '删除',
                  })
                : '请先禁用该组件，再删除。',
          }}
          popConfirm={{
            title: '确认删除',
            onConfirm: async () => {
              console.log(111);
              const resp: any = await service.deletePoint(record.id);
              if (resp.status === 200) {
                message.success(
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

  const pointWs = () => {
    if (productId && deviceId) {
      const id = `instance-info-property-${deviceId}-${productId}-opc-point`;
      const topic = `/dashboard/device/${productId}/properties/realTime`;
      subscribeTopic!(id, topic, {
        deviceId: deviceId,
        properties: data.map((item: any) => item.property),
        history: 0,
      })
        ?.pipe(map((res) => res.patload))
        .subscribe((payload: any) => {
          const { value } = payload;
          console.log(value);
          propertyValue[value.property] = { ...payload, ...value };
          setPropertyValue({ ...propertyValue });
        });
    }
  };

  const getBindList = (params: any) => {
    service.getBindList(params).then((res) => {
      console.log(res.result);
      if (res.status === 200) {
        setDeviceId(res.result[0]?.deviceId);
        setProductId(res.result[0]?.productId);
        setParam({
          terms: [{ column: 'deviceId', value: res.result[0]?.deviceId }],
        });
        setBindList(res.result);
      }
    });
  };

  // useEffect(() => {
  //   pointWs();
  // }, [deviceId, productId])

  useEffect(() => {
    pointWs();
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
        <PermissionButton
          onClick={() => {
            setDeviceVisiable(true);
          }}
          isPermission={permission.add}
          key="add"
          icon={<PlusOutlined />}
          type="dashed"
          style={{ width: '200px', marginLeft: 20, marginBottom: 5 }}
        >
          绑定设备
        </PermissionButton>
        {bindList.length > 0 ? (
          <Tabs
            tabPosition={'left'}
            defaultActiveKey={deviceId}
            onChange={(e) => {
              setDeviceId(e);
              const items = bindList.find((item: any) => item.deviceId === e);
              setProductId(items[0]?.productId);
              setParam({
                terms: [{ column: 'deviceId', value: e }],
              });
            }}
          >
            {bindList.map((item: any) => (
              <Tabs.TabPane
                key={item.deviceId}
                tab={
                  <div className={styles.left}>
                    <div style={{ width: '100px', textAlign: 'left' }}>{item.name}</div>
                    <Popconfirm
                      title="确认解绑该设备嘛？"
                      onConfirm={() => {
                        service.unbind([item.deviceId], opcUaId).then((res) => {
                          if (res.status === 200) {
                            message.success('解绑成功');
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
                      okText="Yes"
                      cancelText="No"
                    >
                      <DisconnectOutlined className={styles.icon} />
                    </Popconfirm>
                  </div>
                }
              >
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
                    const res = await service.PointList({
                      ...params,
                      sorts: [{ name: 'createTime', order: 'desc' }],
                    });
                    setData(res.result.data);
                    return {
                      code: res.message,
                      result: {
                        data: res.result.data,
                        pageIndex: 0,
                        pageSize: 0,
                        total: 0,
                      },
                      status: res.status,
                    };
                  }}
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
        ) : (
          <Empty />
        )}
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

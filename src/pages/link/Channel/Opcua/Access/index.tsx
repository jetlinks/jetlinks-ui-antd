import PermissionButton from '@/components/PermissionButton';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Card, Popconfirm, message, Tabs, Empty } from 'antd';
import { useIntl, useLocation } from 'umi';
import { useEffect, useRef, useState } from 'react';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import BindDevice from '@/pages/link/Channel/Opcua/Access/bindDevice';
import { service } from '@/pages/link/Channel/Opcua';
import encodeQuery from '@/utils/encodeQuery';
import styles from './index.less';
import AddPoint from './addPoint';

const Access = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const location = useLocation<string>();
  // const [param, setParam] = useState({});
  const [opcUaId, setOpcUaId] = useState<any>('');
  const { permission } = PermissionButton.usePermission('link/Channel/Opcua');
  const [deviceVisiable, setDeviceVisiable] = useState<boolean>(false);
  const [pointVisiable, setPointVisiable] = useState<boolean>(false);
  const [bindList, setBindList] = useState<any>([]);
  const [deviceId, setDeviceId] = useState<string>('');

  const columns: ProColumns<OpaUa>[] = [
    {
      title: '属性ID',
      dataIndex: 'name',
    },
    {
      title: '功能码',
      dataIndex: '1',
    },
    {
      title: '读取起始位置',
      dataIndex: '2',
    },
    {
      title: '读取长度',
      dataIndex: '3',
    },
    {
      title: '值',
      dataIndex: '4',
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
    },
  ];

  const getBindList = (params: any) => {
    service.getBindList(params).then((res) => {
      if (res.status === 200) {
        setDeviceId(res.result[0]?.deviceId);
        setBindList(res.result);
      }
    });
  };

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
                <ProTable<OpaUa>
                  actionRef={actionRef}
                  // params={param}
                  columns={columns}
                  rowKey="id"
                  search={false}
                  headerTitle={
                    <PermissionButton
                      onClick={() => {
                        setPointVisiable(true);
                        // setMode('add');
                        // setVisible(true);
                        // setCurrent({});
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
                  }
                  // request={async (params) =>
                  //   service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
                  // }
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
          data={{}}
          close={() => {
            setPointVisiable(false);
          }}
        />
      )}
    </PageContainer>
  );
};
export default Access;

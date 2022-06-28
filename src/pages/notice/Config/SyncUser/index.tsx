import {
  Badge,
  Button,
  Col,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Row,
  Spin,
  Tooltip,
  Tree,
} from 'antd';
import { observer } from '@formily/react';
import { service, state } from '..';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { DisconnectOutlined, EditOutlined } from '@ant-design/icons';
import BindUser from '../BindUser';
import { onlyMessage } from '@/utils/util';

const SyncUser = observer(() => {
  const [dept, setDept] = useState<string>();
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const [list, setList] = useState<any[]>([]);

  const idMap = {
    dingTalk: '钉钉',
    weixin: '微信',
  };

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'thirdPartyUserName',
      title: `${idMap[id]}用户名`,
    },
    {
      dataIndex: 'userId',
      title: `用户`,
      render: (text: any, record: any) => (
        <span>{record?.userId ? `${record?.userName}(${record?.username})` : ''}</span>
      ),
    },
    {
      dataIndex: 'status',
      title: '绑定状态',
      render: (text: any, record: any) => (
        <Badge
          status={record?.status === 1 ? 'success' : 'error'}
          text={record?.status === 1 ? '已绑定' : '未绑定'}
        />
      ),
    },
    {
      dataIndex: 'action',
      title: '操作',
      render: (text: any, record: any) => [
        <Tooltip title={'绑定用户'} key="bind">
          <Button
            type="link"
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
        </Tooltip>,
        <Tooltip title={'解绑用户'} key="unbind">
          {record?.status === 1 && (
            <Button type="link">
              <Popconfirm
                title={'确认解绑'}
                onConfirm={async () => {
                  if (record?.bindingId) {
                    const resp = await service.syncUser.unBindUser(record.bindingId, {
                      bindingId: record.bindingId,
                    });
                    if (resp.status === 200) {
                      onlyMessage('操作成功！');
                      actionRef.current?.reload();
                    }
                  }
                }}
              >
                <DisconnectOutlined />
              </Popconfirm>
            </Button>
          )}
        </Tooltip>,
      ],
    },
  ];

  const [treeData, setTreeData] = useState([]);

  const [loading, setLoading] = useState<boolean>(true);
  /**
   * 获取部门列表
   */
  const getDepartment = async (name?: string) => {
    if (state.current?.id) {
      if (id === 'dingTalk') {
        service.syncUser
          .dingTalkDept(state.current?.id)
          .then((resp) => {
            if (resp.status === 200) {
              let _data = resp.result;
              if (name) {
                _data = resp.result?.filter(
                  (item: { id: string; name: string }) => item.name.indexOf(name) > -1,
                );
              }
              setTreeData(_data);
              setDept(resp.result[0].id);
            }
          })
          .finally(() => setLoading(false));
      } else if (id === 'weixin') {
        service.syncUser
          .wechatDept(state.current?.id)
          .then((resp) => {
            if (resp.status === 200) {
              let __data = resp.result;
              if (name) {
                __data = resp.result?.filter(
                  (item: { id: string; name: string }) => item.name.indexOf(name) > -1,
                );
              }
              setTreeData(__data);
              setDept(resp.result[0].id);
            }
          })
          .finally(() => setLoading(false));
      }
    }
  };

  useEffect(() => {
    if (!state.current?.id) {
      history.goBack();
    }
    getDepartment();
  }, [id]);

  return (
    <Modal
      title="同步用户"
      bodyStyle={{ height: '600px', overflowY: 'auto' }}
      visible={true}
      footer={[
        <Button key="back" onClick={() => (state.syncUser = false)}>
          关闭
        </Button>,
      ]}
      onCancel={() => (state.syncUser = false)}
      width="80vw"
    >
      <Spin spinning={loading}>
        <Row>
          <Col span={4}>
            <div style={{ borderRight: 'lightgray 1px solid', padding: '2px', height: '600px' }}>
              <Input.Search
                onSearch={(value) => getDepartment(value)}
                style={{ marginBottom: 8 }}
                placeholder="请输入部门名称"
              />
              {treeData && treeData.length !== 0 ? (
                <Tree
                  fieldNames={{
                    title: 'name',
                    key: 'id',
                  }}
                  selectedKeys={[dept || '']}
                  onSelect={(key) => {
                    setDept(key[0] as string);
                  }}
                  treeData={treeData}
                />
              ) : (
                <Empty />
              )}
            </div>
          </Col>
          <Col span={20}>
            {dept ? (
              <ProTable
                rowKey="thirdPartyUserId"
                actionRef={actionRef}
                search={false}
                columns={columns}
                params={{ dept: dept }}
                request={(params) =>
                  service
                    .queryZipSyncUser(
                      {
                        dingTalk: 'dingtalk',
                        weixin: 'wechat',
                      }[id],
                      id,
                      state.current?.provider || '',
                      state.current?.id || '',
                      params.dept || '',
                    )
                    .then((resp: any) => {
                      setList(resp);
                      return {
                        code: '',
                        result: {
                          data: resp || [],
                          pageIndex: 0,
                          pageSize: 0,
                          total: 0,
                        },
                        status: 200,
                      };
                    })
                }
                headerTitle={
                  <Popconfirm
                    title="确认保存"
                    onConfirm={async () => {
                      const arr = list
                        .filter((item) => item.status === 0)
                        .map((i) => {
                          return {
                            userId: i.userId,
                            providerName: i.userName,
                            thirdPartyUserId: i.thirdPartyUserId,
                          };
                        });
                      const resp = await service.syncUser.bindUser(
                        id,
                        state.current?.provider || '',
                        state.current?.id || '',
                        [...arr],
                      );
                      if (resp.status === 200) {
                        onlyMessage('操作成功！');
                        actionRef.current?.reload();
                      }
                    }}
                  >
                    <Button type="primary">自动绑定</Button>
                  </Popconfirm>
                }
              />
            ) : (
              <Empty />
            )}
          </Col>
        </Row>
        {visible && (
          <BindUser
            id={id}
            close={() => {
              setCurrent({});
              setVisible(false);
            }}
            data={current}
            reload={() => {
              setCurrent({});
              setVisible(false);
              actionRef.current?.reload();
            }}
          />
        )}
      </Spin>
    </Modal>
  );
});

export default SyncUser;

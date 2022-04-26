import { Badge, Button, Col, Input, message, Modal, Popconfirm, Row, Tooltip, Tree } from 'antd';
import { observer } from '@formily/react';
import { service, state } from '..';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { DisconnectOutlined, EditOutlined } from '@ant-design/icons';
import BindUser from '../BindUser';

const SyncUser = observer(() => {
  const [dept, setDept] = useState<string>();
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});

  const idMap = {
    dingTalk: '钉钉',
    weixin: '微信',
  };

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'id',
      title: `${idMap[id]}用户名`,
      render: (text: any, record: any) => (
        <span>
          {text}({record?.name})
        </span>
      ),
    },
    {
      dataIndex: 'userId',
      title: `用户`,
      render: (text: any, record: any) => (
        <span>{record?.userId ? `${record?.username}(${record?.userName})` : '--'}</span>
      ),
    },
    {
      dataIndex: 'status',
      title: '绑定状态',
      render: (text: any, record: any) => (
        <Badge
          status={record?.userId ? 'success' : 'error'}
          text={record?.userId ? '已绑定' : '未绑定'}
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
          <Button type="link">
            <Popconfirm
              title={'确认解绑'}
              onConfirm={async () => {
                if (record?.bindingId) {
                  const resp = await service.syncUser.unBindUser(record.bindingId);
                  if (resp.status === 200) {
                    message.success('操作成功！');
                    actionRef.current?.reload();
                  }
                }
              }}
            >
              <DisconnectOutlined />
            </Popconfirm>
          </Button>
        </Tooltip>,
      ],
    },
  ];

  const [treeData, setTreeData] = useState([]);

  /**
   * 获取部门列表
   */
  const getDepartment = async () => {
    if (state.current?.id) {
      if (id === 'dingTalk') {
        service.syncUser.dingTalkDept(state.current?.id).then((resp) => {
          if (resp.status === 200) {
            setTreeData(resp.result);
            setDept(resp.result[0].id);
            // console.log(resp.result[0].id, 'id');
          }
        });
      } else if (id === 'weixin') {
        service.syncUser.wechatDept(state.current?.id).then((resp) => {
          if (resp.status === 200) {
            setTreeData(resp.result);
            setDept(resp.result[0].id);
            // console.log(resp.result[0].id, 'id~~');
          }
        });
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
      onCancel={() => (state.syncUser = false)}
      width="80vw"
    >
      <Row>
        <Col span={4}>
          <div style={{ borderRight: 'lightgray 1px solid', padding: '2px', height: '600px' }}>
            <Input.Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" />
            <Tree
              fieldNames={{
                title: 'name',
                key: 'id',
              }}
              onSelect={(key) => {
                setDept(key[0] as string);
              }}
              treeData={treeData}
            />
          </div>
        </Col>
        <Col span={20}>
          {dept && (
            <ProTable
              rowKey="id"
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
                    return {
                      code: resp?.message,
                      result: {
                        data: resp?.result || [],
                        pageIndex: 0,
                        pageSize: 0,
                        total: 0,
                      },
                      status: resp?.status,
                    };
                  })
              }
              headerTitle={<Button>保存</Button>}
            />
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
    </Modal>
  );
});

export default SyncUser;

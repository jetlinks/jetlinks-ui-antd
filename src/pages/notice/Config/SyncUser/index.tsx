import { Button, Col, Input, Modal, Row, Tree } from 'antd';
import { observer } from '@formily/react';
import { service, state } from '..';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { PermissionButton } from '@/components';
import { DisconnectOutlined, EditOutlined } from '@ant-design/icons';

const SyncUser = observer(() => {
  const [dept, setDept] = useState<string>();
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

  const idMap = {
    dingTalk: '钉钉',
    weixin: '微信',
  };
  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'id',
      title: `${idMap[id]}ID`,
    },
    {
      dataIndex: 'name',
      title: `${idMap[id]}用户名`,
    },
    {
      dataIndex: 'action',
      title: '绑定状态',
      render: () => [
        <PermissionButton
          tooltip={{
            title: '绑定用户',
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          tooltip={{
            title: '解绑用户',
          }}
        >
          <DisconnectOutlined />
        </PermissionButton>,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();

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
            console.log(resp.result[0].id, 'id');
          }
        });
      } else if (id === 'weixin') {
        service.syncUser.wechatDept(state.current?.id).then((resp) => {
          if (resp.status === 200) {
            setTreeData(resp.result);
            setDept(resp.result[0].id);
            console.log(resp.result[0].id, 'id~~');
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

  // const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
  //   return list.map((node) => {
  //     if (node.id === key) {
  //       return {
  //         ...node,
  //         children: node.children ? [...node.children, ...children] : children,
  //       };
  //     }
  //
  //     if (node.children) {
  //       return {
  //         ...node,
  //         children: updateTreeData(node.children, key, children),
  //       };
  //     }
  //     return node;
  //   });
  // };

  // const getParentKey = (key: any, tree: string | any[]): any => {
  //   let parentKey;
  //   for (let i = 0; i < tree.length; i++) {
  //     const node = tree[i];
  //     if (node.children) {
  //       if (node.children.some((item: { key: any; }) => item.key === key)) {
  //         parentKey = node.key;
  //       } else if (getParentKey(key, node.children)) {
  //         parentKey = getParentKey(key, node.children);
  //       }
  //     }
  //   }
  //   return parentKey;
  // };

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
              // loadData={onLoadData}
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
              request={async (params) =>
                service.syncUser
                  .getDeptUser(
                    {
                      dingTalk: 'dingtalk',
                      weixin: 'wechat',
                    }[id],
                    state.current?.id || '',
                    params.dept || '',
                  )
                  .then((resp) => {
                    return {
                      code: resp.message,
                      result: {
                        data: resp.result || [],
                        pageIndex: 0,
                        pageSize: 0,
                        total: 0,
                      },
                      status: resp.status,
                    };
                  })
              }
              headerTitle={<Button>保存</Button>}
            />
          )}
        </Col>
      </Row>
    </Modal>
  );
});

export default SyncUser;

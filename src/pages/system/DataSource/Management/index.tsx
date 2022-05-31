import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Input, message, Popconfirm, Row, Space, Tree } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { service } from '@/pages/system/DataSource';
import { useIntl, useLocation } from 'umi';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import PermissionButton from '@/components/PermissionButton';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import usePermissions from '@/hooks/permission';
import SearchComponent from '@/components/SearchComponent';
import ProTable from '@jetlinks/pro-table';
import DataTable from './DataTable';
import styles from './index.less';

const Management = () => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const { permission: userPermission } = usePermissions('system/User');

  const [rdbList, setRdbList] = useState<any[]>([]);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});

  useEffect(() => {
    service.rdbTree(id).then((resp) => {
      if (resp.status === 200) {
        setRdbList(resp.result);
        setDefaultSelectedKeys([resp.result[0]?.name]);
      }
    });
  }, []);

  useEffect(() => {
    actionRef.current?.reload();
  }, [defaultSelectedKeys]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '列名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      ellipsis: true,
    },
    {
      title: '长度',
      dataIndex: 'length',
      ellipsis: true,
    },
    {
      title: '精度',
      dataIndex: 'scale',
      ellipsis: true,
    },
    {
      title: '不能为空',
      dataIndex: 'notnull',
      ellipsis: true,
      render: (text, record) => {
        console.log(record.notnull);
        return <span>{text ? '是' : '否'}</span>;
      },
      valueType: 'select',
      valueEnum: {
        true: {
          text: '是',
          status: true,
        },
        false: {
          text: '否',
          status: false,
        },
      },
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      render: (_, record) => [
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          isPermission={userPermission.update}
          key="editable"
          onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}
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
          key="delete"
          style={{ padding: 0 }}
          isPermission={userPermission.delete}
          tooltip={{ title: '删除' }}
        >
          <Popconfirm
            onConfirm={async () => {
              // await service.remove(record.id);
              // actionRef.current?.reload();
            }}
            title="确认删除?"
          >
            <DeleteOutlined />
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={6}>
            <Input.Search
              placeholder="请输入"
              onSearch={() => {}}
              style={{ width: '100%', marginBottom: 10 }}
            />
            <div className={styles.tables}>
              <Tree
                showLine
                showIcon
                defaultExpandAll
                height={500}
                selectedKeys={[...defaultSelectedKeys]}
                onSelect={(selectedKeys) => {
                  if (!selectedKeys.includes('tables')) {
                    setDefaultSelectedKeys([...selectedKeys]);
                  }
                }}
              >
                <Tree.TreeNode
                  title={() => {
                    return (
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: 230 }}>
                        <div>数据源名称</div>
                        <div>
                          <PlusOutlined
                            onClick={() => {
                              setCurrent({});
                              setVisible(true);
                            }}
                          />
                        </div>
                      </div>
                    );
                  }}
                  key={'tables'}
                >
                  {rdbList.map((item) => (
                    <Tree.TreeNode
                      key={item.name}
                      title={() => {
                        return (
                          <div className={styles.treeTitle}>
                            <div className={styles.title}>{item.name}</div>
                            <div className={styles.options}>
                              <Space>
                                <EditOutlined
                                  onClick={() => {
                                    setCurrent(item);
                                    setVisible(true);
                                  }}
                                />
                                <DeleteOutlined />
                              </Space>
                            </div>
                          </div>
                        );
                      }}
                    />
                  ))}
                </Tree.TreeNode>
              </Tree>
            </div>
          </Col>
          <Col span={18}>
            <div>
              <SearchComponent<DataSourceType>
                field={columns}
                target="datasource-manage"
                onSearch={(data) => {
                  // 重置分页数据
                  actionRef.current?.reset?.();
                  setParam(data);
                }}
              />
              <ProTable<DataSourceType>
                actionRef={actionRef}
                params={param}
                columns={columns}
                search={false}
                rowKey="name"
                headerTitle={
                  <PermissionButton
                    onClick={() => {}}
                    isPermission={userPermission.add}
                    key="add"
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    新增列
                  </PermissionButton>
                }
                request={async (params) => {
                  if (defaultSelectedKeys.length > 0) {
                    const response = await service.rdbTables(id, defaultSelectedKeys[0], {
                      ...params,
                      sorts: [{ name: 'createTime', order: 'desc' }],
                    });
                    return {
                      result: { data: response.result?.columns || [] },
                      success: true,
                      status: 200,
                    } as any;
                  } else {
                    return {
                      result: { data: [] },
                      success: true,
                      status: 200,
                    } as any;
                  }
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>
      {visible && (
        <DataTable
          data={current}
          save={(data) => {
            rdbList.push(data);
            setRdbList([...rdbList]);
            message.success('操作成功！');
            setVisible(false);
          }}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Management;

import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, Popconfirm, Space, Tooltip, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/DataSource';
import { useLocation } from 'umi';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import usePermissions from '@/hooks/permission';
import DataTable from './DataTable';
import styles from './index.less';
import EditTable from './EditTable';
import _ from 'lodash';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

const Management = () => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

  const [rdbList, setRdbList] = useState<any[]>([]);
  const [allList, setAllList] = useState<any[]>([]);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const [model, setModel] = useState<'edit' | 'add' | 'list'>('list');
  const [tableList, setTableList] = useState<any[]>([]);
  const [param, setParam] = useState<string | undefined>(undefined);
  const { minHeight } = useDomFullHeight(`.management`);

  const handleSearch = () => {
    service.rdbTree(id).then((resp) => {
      if (resp.status === 200) {
        setAllList(resp.result);
        setDefaultSelectedKeys([resp.result[0]?.name]);
      }
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    if (defaultSelectedKeys.length > 0) {
      service.rdbTables(id, defaultSelectedKeys[0]).then((resp) => {
        if (resp.status === 200) {
          setTableList(resp.result?.columns || []);
        }
      });
    } else {
      setTableList([]);
    }
  }, [defaultSelectedKeys]);

  useEffect(() => {
    if (!!param) {
      const list = allList.filter((item) => {
        return item.name.includes(param);
      });
      setRdbList([...list]);
      if (!_.map(list, 'name').includes(defaultSelectedKeys[0])) {
        setDefaultSelectedKeys([list[0]?.name]);
      }
    } else {
      setRdbList([...allList]);
    }
  }, [allList, param]);

  return (
    <PageContainer>
      <Card className="management" style={{ minHeight }}>
        <div className={styles.datasourceBox}>
          <div className={styles.left}>
            <Input.Search
              placeholder="请输入"
              onSearch={(val: string) => {
                setParam(val);
              }}
              allowClear
              style={{ width: '100%', marginBottom: 20 }}
            />
            <div className={styles.tables}>
              <Tree showLine showIcon defaultExpandAll height={500}>
                <Tree.TreeNode
                  title={() => {
                    return (
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: 230 }}>
                        <div>数据源名称</div>
                        <div>
                          <a>
                            <PlusOutlined
                              onClick={() => {
                                setCurrent({});
                                setModel('add');
                                setVisible(true);
                              }}
                            />
                          </a>
                        </div>
                      </div>
                    );
                  }}
                  key={'tables'}
                >
                  {rdbList.map((item, index) => (
                    <Tree.TreeNode
                      key={item.name}
                      title={() => {
                        return (
                          <div className={styles.treeTitle}>
                            <div
                              className={styles.title}
                              onClick={() => {
                                setDefaultSelectedKeys([item.name]);
                              }}
                            >
                              <span
                                className={
                                  defaultSelectedKeys[0] === item?.name ? styles.active : ''
                                }
                              >
                                <Tooltip title={item.name}>{item.name}</Tooltip>
                              </span>
                            </div>
                            <div className={styles.options}>
                              <Space>
                                <a>
                                  <EditOutlined
                                    onClick={() => {
                                      setCurrent(item);
                                      setVisible(true);
                                      setModel('edit');
                                    }}
                                  />
                                </a>
                                <a>
                                  <Popconfirm
                                    title="确认删除！"
                                    onConfirm={() => {
                                      const list = [...rdbList];
                                      list.splice(index, 1);
                                      setAllList([...list]);
                                      if (item.name === defaultSelectedKeys[0]) {
                                        setDefaultSelectedKeys([list[0]?.name]);
                                      }
                                    }}
                                  >
                                    <DeleteOutlined />
                                  </Popconfirm>
                                </a>
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
          </div>
          <div className={styles.right}>
            <EditTable
              table={{ id, table: defaultSelectedKeys[0] }}
              data={tableList}
              onChange={async (data: any) => {
                const resp = await service.saveRdbTables(id, {
                  name: defaultSelectedKeys[0],
                  columns: [...data.array],
                });
                if (resp.status === 200) {
                  onlyMessage('保存成功');
                  handleSearch();
                }
              }}
            />
          </div>
        </div>
      </Card>
      {visible && (
        <DataTable
          data={current}
          save={(data) => {
            if (model === 'edit') {
              const list = [...rdbList].map((item) => {
                return {
                  name: item?.name === current?.name ? data.name : item.name,
                };
              });
              setAllList(list);
            } else {
              const list = [...rdbList];
              list.unshift(data);
              setAllList([...list]);
            }
            setModel('list');
            onlyMessage('操作成功！');
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

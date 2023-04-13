import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, message, Spin, Tooltip, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/DataSource';
import { useLocation } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from './DataTable';
import styles from './index.less';
import EditTable from './EditTable';
import _ from 'lodash';
import { useDomFullHeight } from '@/hooks';
import { Store } from 'jetlinks-store';
import { Empty } from '@/components';

const Management = () => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

  const [info, setInfo] = useState<Partial<DataSourceItem>>({});
  const [rdbList, setRdbList] = useState<any[]>([]);
  const [allList, setAllList] = useState<any[]>([]);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [tableList, setTableList] = useState<any[]>([]);
  const [param, setParam] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { minHeight } = useDomFullHeight(`.management`, 52);

  const queryTables = (key: string) => {
    setLoading(true);
    service.rdbTables(id, key).then((resp) => {
      if (resp.status === 200) {
        setTableList(resp.result?.columns || []);
      }
      setLoading(false);
    });
  };
  console.log(minHeight)

  const handleSearch = (refresh: boolean) => {
    service.rdbTree(id).then((resp) => {
      if (resp.status === 200) {
        Store.set('datasource-detail-list', resp.result);
        setAllList(resp.result);
        if (refresh) {
          setDefaultSelectedKeys([resp.result[0]?.name]);
          queryTables(resp.result[0]?.name);
        } else {
          queryTables(defaultSelectedKeys[0]);
        }
      }
    });
  };

  useEffect(() => {
    if (id) {
      service.detail(id).then((resp) => {
        if (resp.status === 200) {
          setInfo(resp.result);
        }
      });
      handleSearch(true);
    }
  }, [id]);

  useEffect(() => {
    if (!!param) {
      const list = allList.filter((item) => {
        return item.name.includes(param);
      });
      setRdbList([...list]);
      if (!_.map(list, 'name').includes(defaultSelectedKeys[0])) {
        setDefaultSelectedKeys([list[0]?.name]);
        queryTables(list[0]?.name);
      }
    } else {
      setRdbList([...allList]);
    }
  }, [allList, param]);

  const saveTables = async (name: string, data: any) => {
    const resp = await service.saveRdbTables(id, {
      name: name,
      columns: [...data.array],
    });
    if (resp.status === 200) {
      message.success('保存成功');
      handleSearch(false);
    }
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Card className="management">
          <div className={styles.datasourceBox} style={{ minHeight }}>
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
                <Tree
                  showLine
                  showIcon
                  selectedKeys={defaultSelectedKeys}
                  defaultExpandAll
                  height={500}
                  onSelect={(value: any) => {
                    setDefaultSelectedKeys(value);
                    queryTables(value[0]);
                  }}
                >
                  <Tree.TreeNode
                    selectable={false}
                    title={() => {
                      return (
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', width: 230 }}
                        >
                          <div>{info?.shareConfig?.schema || '数据源名称'}</div>
                          <div>
                            <a>
                              <PlusOutlined
                                onClick={() => {
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
                    {rdbList.map((item) => (
                      <Tree.TreeNode
                        key={item.name}
                        title={() => {
                          return (
                            <div className={styles.treeTitle}>
                              <div className={styles.title}>
                                <Tooltip title={item.name}>{item.name}</Tooltip>
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
              {defaultSelectedKeys.length && !!defaultSelectedKeys[0] ? (
                <EditTable
                  table={{ id, table: defaultSelectedKeys[0] }}
                  data={tableList}
                  onChange={(data: any) => {
                    saveTables(defaultSelectedKeys[0], data);
                  }}
                />
              ) : (
                <Empty />
              )}
            </div>
          </div>
        </Card>
      </Spin>
      {visible && (
        <DataTable
          data={{}}
          save={(data) => {
            const list = [...rdbList];
            list.unshift(data);
            setAllList([...list]);
            setDefaultSelectedKeys([data.name]);
            setTableList([]);
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

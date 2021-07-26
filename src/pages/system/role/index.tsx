import React, { Fragment, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { Button, Card, Divider, message, Popconfirm, Spin } from 'antd';
import { connect, Dispatch } from 'dva';
import { ColumnProps } from 'antd/lib/table';
import { RoleItem } from './data.d';
import { ConnectState } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import Authorization from '@/components/Authorization';
import BindUser from './user';
import RoleService from './service';
import ProTable from '../permission/component/ProTable';
import { ListData } from '@/services/response';
import apis from '@/services';
import SearchForm from '@/components/SearchForm';

interface Props {
  role: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<RoleItem>;
  autzVisible: boolean;
  userVisible: boolean;
}

const RoleList: React.FC<Props> = props => {
  const { dispatch } = props;
  const initState: State = {
    searchParam: {
      pageIndex: 0,
      pageSize: 10,
      terms: {
        typeId: 'role',
      },
      sorts: {
        order: 'descend',
        field: 'id',
      },
    },
    saveVisible: false,
    currentItem: {},
    autzVisible: false,
    userVisible: false,
  };

  const service = new RoleService<RoleItem>('dimension');
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [autzVisible, setAutzVisible] = useState(initState.autzVisible);
  const [userVisible, setUserVisible] = useState(initState.userVisible);
  const [result, setResult] = useState<ListData<RoleItem>>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (params?: any) => {
    service.list(encodeQueryParam(params)).subscribe(data => {
      setResult(data);
      setLoading(false);
    });
    setSearchParam(params);
    dispatch({
      type: 'role/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const saveOrUpdate = (item: RoleItem) => {
    if (currentItem.id) {
      apis.role
        .saveOrUpdate(item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            handleSearch(searchParam);
          }
          setLoading(false);
        })
        .catch(() => {});
    } else {
      apis.role
        .save(item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('新增成功');
            handleSearch(searchParam);
          }
          setLoading(false);
        })
        .catch(() => {});
    }
  };
  const handleDelete = (item: any) => {
    apis.role
      .remove(item.id)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('删除成功');
          if (result?.data.length === 1 && searchParam.pageIndex > 0) {
            handleSearch({ ...searchParam, pageIndex: searchParam.pageIndex - 1 });
          } else {
            handleSearch(searchParam);
          }
        }
      })
      .catch(() => {});
  };

  const columns: ColumnProps<RoleItem>[] = [
    {
      title: '角色标识',
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      width: '30%',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              setCurrentItem(record);
              setSaveVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem(record);
              setAutzVisible(true);
            }}
          >
            权限分配
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem(record);
              setUserVisible(true);
            }}
          >
            绑定用户
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除此角色吗？"
            onConfirm={() => {
              setLoading(true);
              handleDelete(record);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  // console.log(result, 'cccc');
  return (
    <PageHeaderWrapper title="角色管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                handleSearch({ terms: { ...params, typeId: 'role' }, pageSize: 10, pageIndex: 0 });
              }}
              formItems={[
                {
                  label: '角色标识',
                  key: 'id$LIKE',
                  type: 'string',
                },
                {
                  label: '角色名称',
                  key: 'name$LIKE',
                  type: 'string',
                },
              ]}
            />
          </div>
          <div className={styles.tableListForm}></div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setCurrentItem({});
                setSaveVisible(true);
              }}
            >
              新建
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Spin spinning={loading}>
              {result && (
                <ProTable
                  dataSource={result?.data || []}
                  loading={loading}
                  columns={columns}
                  rowKey="id"
                  onSearch={(params: any) => {
                    handleSearch({ ...params, terms: searchParam.terms });
                  }}
                  paginationConfig={result}
                />
              )}
            </Spin>
          </div>
        </div>
      </Card>
      {saveVisible && (
        <Save
          save={(item: any) => {
            setLoading(true);
            saveOrUpdate(item);
            setSaveVisible(false);
          }}
          data={currentItem}
          close={() => {
            setSaveVisible(false);
            setCurrentItem({});
          }}
        />
      )}
      {autzVisible && (
        <Authorization
          close={() => {
            setAutzVisible(false);
            setCurrentItem({});
          }}
          target={currentItem}
          targetType="role"
        />
      )}
      {userVisible && (
        <BindUser
          data={currentItem}
          close={() => {
            setUserVisible(false);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ role, loading }: ConnectState) => ({
  role,
  loading: loading.models.role,
}))(RoleList);

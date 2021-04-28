import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { UserItem } from './data';
import { Button, Card, Divider, message, Modal, Popconfirm, Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'dva';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import Authorization from '@/components/Authorization';
import apis from '@/services';
import SearchForm from '@/components/SearchForm';

interface Props {
  users: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<UserItem>;
  autzVisible: boolean;
}

const UserList: React.FC<Props> = props => {
  const { dispatch } = props;
  const { result } = props.users;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
    currentItem: {},
    autzVisible: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [autzVisible, setAutzVisible] = useState(initState.autzVisible);

  const columns: ColumnProps<UserItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => (
        <Tag color={text === 1 ? '#108ee9' : '#f50'}>{text === 1 ? '正常' : '已禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => edit(record)}>编辑</a>
          <Divider type="vertical" />

          <a onClick={() => setting(record)}>赋权</a>
          <Divider type="vertical" />
          {record.status !== 1 ? (
            <span>
              <Popconfirm
                title="确认启用此用户？"
                onConfirm={() => {
                  enableOrDisable(record);
                }}
              >
                <a>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => handleDelete(record)}>删除</a>
            </span>
          ) : (
            <Popconfirm
              title="确认禁用此用户？"
              onConfirm={() => {
                enableOrDisable(record);
              }}
            >
              <a>禁用</a>
            </Popconfirm>
          )}
        </Fragment>
      ),
    },
  ];

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'users/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    // const tem = new Service<UserItem, 'user'>().save({}).subscribe(
    //     (data: any) => console.log(data.response.result),
    // );
    // console.log(tem, 'temp');
    handleSearch(searchParam);
  }, []);

  const enableOrDisable = (record: UserItem) => {
    apis.users
      .saveOrUpdate({ id: record.id, status: record.status === 1 ? 0 : 1 })
      .then(res => {
        if (res.status === 200) {
          if (record.status === 1) {
            message.success('禁用成功');
          } else {
            message.success('启用成功');
          }
          handleSearch(searchParam);
        }
        // else {
        //     message.error(`操作失败，${res.message}`)
        // }
      })
      .catch(() => {});
  };

  const edit = (record: UserItem) => {
    setCurrentItem(record);
    setSaveVisible(true);
  };
  const setting = (record: UserItem) => {
    setAutzVisible(true);
    setCurrentItem(record);
  };

  const saveOrUpdate = (user: UserItem) => {
    dispatch({
      type: 'users/insert',
      payload: encodeQueryParam(user),
      callback: (response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveVisible(false);
          handleSearch(searchParam);
          setCurrentItem({});
        } else {
          // message.error(`添加失败，${response.message}`);
        }
      },
    });
  };
  const handleDelete = (params: any) => {
    Modal.confirm({
      title: '确定删除此用户吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'users/remove',
          payload: params.id,
          callback: response => {
            if (response.status === 200) {
              message.success('删除成功');
              if (result.data.length === 1) {
                handleSearch({ ...searchParam, pageIndex:( searchParam.pageIndex||1) - 1 });
              } else {
                handleSearch(searchParam);
              }
            } else {
              message.error('删除失败');
            }
          },
        });
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<any>,
    extra: any,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1 || 0,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  return (
    <PageHeaderWrapper title="用户管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10 });
              }}
              formItems={[
                {
                  label: '姓名',
                  key: 'name$LIKE',
                  type: 'string',
                },
                {
                  label: '用户名',
                  key: 'username$LIKE',
                  type: 'string',
                },
              ]}
            />
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setSaveVisible(true);
              }}
            >
              新建
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Table
              loading={props.loading}
              dataSource={result?.data}
              columns={columns}
              rowKey="id"
              onChange={onTableChange}
              pagination={{
                current: result.pageIndex + 1,
                total: result.total,
                pageSize: result.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total: number) =>
                  `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                    result.total / result.pageSize,
                  )}页`,
              }}
            />
          </div>
        </div>
      </Card>
      {saveVisible && (
        <Save
          data={currentItem}
          close={() => {
            setSaveVisible(false);
            setCurrentItem({});
          }}
          save={(user: UserItem) => {
            saveOrUpdate(user);
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
          targetType="user"
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ users, loading }: ConnectState) => ({
  users,
  loading: loading.models.users,
}))(UserList);

import React, { useEffect, useState, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { Card, Button, Table, message, Divider, Popconfirm, Spin } from 'antd';
import { Dispatch, connect } from 'dva';
import { PaginationConfig, ColumnProps } from 'antd/lib/table';
import { RoleItem } from './data.d';
import { ConnectState } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import Authorization from '@/components/Authorization';
import BindUser from './user';
import RoleService from './service';
import ProTable from '../permission/component/ProTable';
import { ListData } from '@/services/response';

interface Props {
  role: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<RoleItem>;
  autzVisible: boolean;
  userVisible: boolean;
}

const RoleList: React.FC<Props> = props => {
  // const {
  //   dispatch,
  //   role: { result },
  // } = props;

  const initState: State = {
    // data: result,
    searchParam: { pageSize: 10 },
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
    // dispatch({
    //   type: 'role/query',
    //   payload: encodeQueryParam(params),
    // });
    console.log(encodeQueryParam(params), 'par');
    service.list(encodeQueryParam(params)).subscribe(data => {
      setResult(data);
      console.log(data, 'dat');
      setLoading(false);
    });
    setSearchParam(params);
  };

  useEffect(() => {
    handleSearch({
      // terms: {
      //   typeId: 'role',
      // },
      paging: false,
      pageIndex: 0,
      pageSize: 10,
    });
  }, []);

  const saveOrUpdate = (item: RoleItem) => {
    // dispatch({
    //   type: 'role/insert',
    //   payload: encodeQueryParam(item),
    //   callback: (response: any) => {
    //     if (response) {
    //       message.success('保存成功');
    //       setSaveVisible(false);
    //       handleSearch(searchParam);
    //     }
    //   },
    // });
  };
  const handleDelete = (item: any) => {
    // dispatch({
    //   type: 'role/remove',
    //   payload: item.id,
    //   callback: (response: any) => {
    //     if (response) {
    //       message.success('删除成功');
    //       handleSearch(searchParam);
    //     }
    //   },
    // });
  };

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: any) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
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
      dataIndex: 'description',
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
              handleDelete(record);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title="角色管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {/* <Search search={(params: any) => {
                            setSearchParam(params);
                            handleSearch({ terms: params, pageSize: 10 })
                        }} /> */}
          </div>
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
                    handleSearch(params);
                  }}
                  paginationConfig={result}
                />
              )}
            </Spin>

            {/* <Table
              loading={props.loading}
              dataSource={result.data}
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
            /> */}
          </div>
        </div>
      </Card>
      {saveVisible && (
        <Save
          save={(item: any) => saveOrUpdate(item)}
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

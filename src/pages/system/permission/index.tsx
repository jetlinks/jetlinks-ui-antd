import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Divider, Card, Table, message, Button, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import Search from './Search';
import { Dispatch, ConnectState } from '@/models/connect';
import { PermissionItem } from './data.d';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './Save';
// import SettingAutz from "../setting-autz";
interface Props {
  permission: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<PermissionItem>;
  saveLoading: boolean;
  autzVisible: boolean;
}

const PermissionList: React.FC<Props> = props => {
  const { dispatch } = props;
  const { result } = props.permission;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
    saveLoading: false,
    currentItem: {},
    autzVisible: false,
  };

  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [saveLoading, setSaveLoading] = useState(initState.saveLoading);
  // const [autzVisible, setAutzVisible] = useState(initState.autzVisible);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'permission/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const edit = (record: PermissionItem) => {
    setSaveVisible(true);
    setCurrentItem(record);
  };

  // const setAutz = (record: PermissionItem) => {
  //     setAutzVisible(true);
  // }

  const saveOrUpdate = (permission: PermissionItem) => {
    setSaveLoading(true);
    dispatch({
      type: 'permission/insert',
      payload: encodeQueryParam(permission),
      callback: (response: any) => {
        if (response.status === 200) {
          setCurrentItem({});
          setSaveLoading(false);
          message.success('添加成功');
          setSaveVisible(false);
        }
      },
    });
  };
  const handleDelete = (params: any) => {
    dispatch({
      type: 'permission/remove',
      payload: params.id,
      callback: () => {
        message.success('删除成功');
        handleSearch(searchParam);
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<PermissionItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };

  const columns: ColumnProps<PermissionItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => (text === 1 ? '正常' : '禁用'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => edit(record)}>编辑</a>
          {/* <Divider type="vertical" /> */}
          {/* <a onClick={() => setAutz(record)}>赋权</a> */}
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除此权限吗？"
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
    <PageHeaderWrapper title="权限管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <Search
              search={(params: any) => {
                setSearchParam({ pageSize: 10, terms: params });
                handleSearch({ terms: params, pageSize: 10 });
              }}
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
              dataSource={(result || {}).data}
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
          close={() => {
            setSaveVisible(false);
            setCurrentItem({});
            handleSearch(searchParam);
          }}
          loading={saveLoading}
          save={(permission: PermissionItem) => {
            saveOrUpdate(permission);
          }}
          data={currentItem}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ permission, loading }: ConnectState) => ({
  permission,
  loading: loading.models.permission,
}))(PermissionList);

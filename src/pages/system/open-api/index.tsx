import { connect } from 'dva';
import { Dispatch, ConnectState } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, Fragment, useEffect } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { message, Card, Button, Table, Tag, Divider } from 'antd';
import { OpenApiItem } from './data';
import encodeQueryParam from '@/utils/encodeParam';
import styles from '@/utils/table.less';
import Search from './Search';
import Save from './Save';
import Authorization from '@/components/Authorization';

interface Props {
  openApi: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<OpenApiItem>;
  autzVisible: boolean;
}

const OpenApiList: React.FC<Props> = props => {
  const { dispatch } = props;
  // result Undefined解决方案：
  // 此处遇到一个坑，model中namespace写open-api;connect中写的openApi导致props.openApi 为undefined。
  const { result } = props.openApi;

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

  const columns: ColumnProps<OpenApiItem>[] = [
    {
      title: 'clientId',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'clientName',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => <Tag color={text ? '#108ee9' : '#f50'}>{text ? text.text : '禁用'}</Tag>,
    },
    {
      title: '说明',
      dataIndex: 'description',
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
            赋权
          </a>
        </Fragment>
      ),
    },
  ];

  const handleSearch = (params?: any) => {
    dispatch({
      type: 'openApi/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const saveOrUpdate = (user: OpenApiItem) => {
    dispatch({
      type: 'openApi/insert',
      payload: encodeQueryParam(user),
      callback: () => {
        message.success('保存成功');
        setSaveVisible(false);
        handleSearch(searchParam);
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<OpenApiItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };
  return (
    <PageHeaderWrapper title="OpenApi客户端">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Search
              search={(params: any) => {
                setSearchParam(params);
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
          data={currentItem}
          close={() => {
            setSaveVisible(false);
            setCurrentItem({});
          }}
          save={(openApi: OpenApiItem) => {
            saveOrUpdate(openApi);
          }}
        />
      )}
      {autzVisible && (
        <Authorization
          close={() => {
            setAutzVisible(false);
            setCurrentItem({});
          }}
          target={{ id: currentItem.userId, name: currentItem.username }}
          targetType="user"
        />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ openApi, loading }: ConnectState) => ({
  openApi,
  loading: loading.models.openApi,
}))(OpenApiList);

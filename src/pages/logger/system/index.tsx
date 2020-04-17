import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Card, Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import moment from 'moment';
import Search from './search';
import { SystemLoggerItem } from './data.d';
import { Dispatch, ConnectState } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';

interface Props {
  systemLogger: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  current: Partial<SystemLoggerItem>;
}

const SystemLoggerList: React.FC<Props> = props => {
  const { dispatch } = props;

  const { result } = props.systemLogger;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10, sorts: { order: 'desc', field: 'createTime' } },
    saveVisible: false,
    current: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [current, setCurrent] = useState(initState.current);

  const columns: ColumnProps<SystemLoggerItem>[] = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   width: 60,
    //   render: (_, __, index) => index + 1,
    // },

    {
      title: '线程',
      dataIndex: 'threadName',
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      render: text => <Tag color={text === 'ERROR' ? 'red' : 'orange'}>{text}</Tag>,
    },
    {
      title: '日志内容',
      dataIndex: 'exceptionStack',
      ellipsis: true,
    },
    {
      title: '服务名',
      dataIndex: 'context.server',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      sorter: true,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      render: (_, record) => (
        <Fragment>
          <a
            onClick={() => {
              setCurrent(record);
              setSaveVisible(true);
            }}
          >
            详情
          </a>
        </Fragment>
      ),
    },
  ];
  const handleSearch = (params?: any) => {
    dispatch({
      type: 'systemLogger/query',
      payload: encodeQueryParam(params),
    });
    setSearchParam(params);
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const saveOrUpdate = (item: SystemLoggerItem) => {
    dispatch({
      type: 'systemLogger/insert',
      payload: encodeQueryParam(item),
      callback: response => {
        if (response) {
          setSaveVisible(false);
          handleSearch(searchParam);
        }
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<SystemLoggerItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  return (
    <PageHeaderWrapper title="系统日志">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <Search
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10, sorts: searchParam.sorts });
              }}
            />
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
          data={current}
          close={() => {
            setSaveVisible(false);
          }}
          save={(data: SystemLoggerItem) => {
            saveOrUpdate(data);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ systemLogger, loading }: ConnectState) => ({
  systemLogger,
  loading: loading.models.systemLogger,
}))(SystemLoggerList);

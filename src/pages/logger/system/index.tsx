import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Card, Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import moment from 'moment';
import { SystemLoggerItem } from './data.d';
import { ConnectState, Dispatch } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import SearchForm from '@/components/SearchForm';

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
    searchParam: {
      pageSize: 10,
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
    },
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
      ellipsis: true
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
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      sorter: true,
      ellipsis: true,
      defaultSortOrder: 'descend',
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
      sorts: sorter.field ? sorter : searchParam.sorter,
    });
  };

  return (
    <PageHeaderWrapper title="系统日志">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            {/* <Search
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10, sorts: searchParam.sorts });
              }}
            /> */}
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10, sorts: searchParam.sorts });
              }}
              formItems={[
                {
                  label: '名称',
                  key: 'name$LIKE',
                  type: 'string',
                },
                {
                  label: '日志级别',
                  key: 'level$IN',
                  type: 'list',
                  props: {
                    data: ['ERROR', 'INFO', 'WARN', 'DEBUG'],
                    mode: 'multiple'
                  }
                },
                {
                  label: '日志时间',
                  key: 'createTime$btw',
                  type: 'time',
                },
                {
                  label: '日志内容',
                  key: 'message$LIKE',
                  type: 'string'
                },
              ]}
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

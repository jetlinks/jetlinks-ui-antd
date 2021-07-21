import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Card, Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import moment from 'moment';
import { AccessLoggerItem } from './data.d';
import { ConnectState, Dispatch } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import SearchForm from '@/components/SearchForm';

interface Props {
  accessLogger: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  current: Partial<AccessLoggerItem>;
}

const AccessLoggerList: React.FC<Props> = props => {
  const { dispatch } = props;

  const { result } = props.accessLogger;

  const initState: State = {
    data: result,
    searchParam: {
      pageSize: 10,
      sorts: {
        field: 'requestTime',
        order: 'desc',
      },
    },
    saveVisible: false,
    current: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [current, setCurrent] = useState(initState.current);

  const columns: ColumnProps<AccessLoggerItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      // width: 60,
      render: (text, record, index) => index + 1,
    },

    {
      title: 'IP',
      dataIndex: 'ip',
      // ellipsis: true
    },
    // {
    //     title: '请求方法',
    //     dataIndex: 'httpMethod',
    // },
    {
      title: '请求路径',
      dataIndex: 'url',
      // ellipsis: true,
      render: (text, record) => (
        <Fragment>
          <Tag color="#87d068">{record.httpMethod}</Tag>
          {record.url}
        </Fragment>
      ),
    },
    {
      title: '说明',
      dataIndex: 'describe',
      // ellipsis: true,
      render: (text, record) => {
        const action = record.action ? <Tag color="volcano">{record.action}</Tag> : '';
        const describe = record.describe ? <Tag color="#2db7f5">{record.describe}</Tag> : '';
        return (
          <Fragment>
            {action}
            {describe}
          </Fragment>
        );
      },
    },
    // {
    //     title: "动作",
    //     dataIndex: 'action',
    //     ellipsis: true,
    // },
    {
      title: '请求时间',
      dataIndex: 'requestTime',
      sorter: true,
      defaultSortOrder: 'descend',
      // ellipsis: true,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '请求耗时',
      // width: 100,
      render: (record: AccessLoggerItem) => (
        <Tag color="purple">{record.responseTime - record.requestTime}ms</Tag>
      ),
    },
    {
      title: '请求用户',
      dataIndex: 'context.username',
      render: text => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: '操作',
      render: (text, record) => (
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
      type: 'accessLogger/query',
      payload: encodeQueryParam(params),
    });
    setSearchParam(params);
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const saveOrUpdate = (item: AccessLoggerItem) => {
    dispatch({
      type: 'accessLogger/insert',
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
    sorter: SorterResult<AccessLoggerItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter.field ? sorter : searchParam.sorter,
    });
  };

  return (
    <PageHeaderWrapper title="访问日志">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10, sorts: searchParam.sorts });
              }}
              formItems={[
                {
                  label: '请求路径',
                  key: 'url$LIKE',
                  type: 'string',
                },
                {
                  label: 'IP',
                  key: 'ip',
                  type: 'string',
                },

                // {
                //   label: '操作',
                //   key: 'action',
                //   type: 'string',
                // },
                // {
                //   label: '请求ID',
                //   key: 'id',
                //   type: 'string',
                // },
                {
                  label: '日志时间',
                  key: 'requestTime$btw',
                  type: 'dateTimeRange',
                  props: {
                    showTime: { format: 'HH:mm' },
                    format: "YYYY-MM-DD HH:mm",
                    placeholder: ['开始时间', '结束时间'],
                  }
                },
              ]}
            />
          </div>
          <div className={styles.StandardTable}>
            <Table
              dataSource={(result || {}).data}
              columns={columns}
              loading={props.loading}
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
          save={(data: AccessLoggerItem) => {
            saveOrUpdate(data);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ accessLogger, loading }: ConnectState) => ({
  accessLogger,
  loading: loading.models.accessLogger,
}))(AccessLoggerList);

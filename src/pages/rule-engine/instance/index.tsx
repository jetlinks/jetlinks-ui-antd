import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Divider, Card, Table, message, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import Search from './search';
import { RuleInstanceItem } from './data.d';
import { Dispatch, ConnectState } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import Detail from './detail';

interface Props {
  ruleInstance: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  current: Partial<RuleInstanceItem>;
}

const RuleInstanceList: React.FC<Props> = props => {
  const { dispatch } = props;

  const { result } = props.ruleInstance;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
    current: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [current, setCurrent] = useState(initState.current);

  const createModel = (record: any) => {
    apis.ruleInstance
      .createModel(record)
      .then(response => {
        if (response.status === 200) {
          message.success('创建成功');
        }
      })
      .catch(() => {});
  };

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'ruleInstance/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const startInstance = (record: any) => {
    apis.ruleInstance
      .start(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('启动成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };

  const stopInstance = (record: any) => {
    apis.ruleInstance
      .stop(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('停止成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };
  // const saveOrUpdate = (item: RuleInstanceItem) => {
  //     dispatch({
  //         type: 'ruleInstance/insert',
  //         payload: encodeQueryParam(item),
  //         callback: () => {
  //             setSaveVisible(false);
  //             handleSearch(searchParam);
  //         }
  //     })
  // }
  const handleDelete = (params: any) => {
    dispatch({
      type: 'ruleInstance/remove',
      payload: params.id,
      callback: () => {
        message.success('删除成功');
        handleSearch();
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<RuleInstanceItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };

  const columns: ColumnProps<RuleInstanceItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },

    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '模型版本',
      dataIndex: 'modelVersion',
    },
    {
      title: '说明',
      dataIndex: 'description',
    },

    {
      title: '状态',
      dataIndex: 'state',
      render: text => text.text,
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              setSaveVisible(true);
              setCurrent(record);
            }}
          >
            详情
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          {record.state?.value === 'stopped' && (
            <Popconfirm title="确认启动？" onConfirm={() => startInstance(record)}>
              <a>启动</a>
            </Popconfirm>
          )}
          {record.state?.value === 'started' && (
            <Popconfirm title="确认启动？" onConfirm={() => stopInstance(record)}>
              <a>停止</a>
            </Popconfirm>
          )}
          <Divider type="vertical" />
          <Popconfirm title="确认生成模型？" onConfirm={() => createModel(record)}>
            <a>生成模型</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title="规则实例">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <Search
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10 });
              }}
            />
          </div>
          {/* <div className={styles.tableListOperator}>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => { setCurrent({}); setSaveVisible(true) }}>
                            新建
                        </Button>
                    </div> */}
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
        <Detail
          save={() => {
            // tod
          }}
          data={current}
          close={() => {
            setSaveVisible(false);
            setCurrent({});
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ ruleInstance, loading }: ConnectState) => ({
  ruleInstance,
  loading: loading.models.ruleInstance,
}))(RuleInstanceList);

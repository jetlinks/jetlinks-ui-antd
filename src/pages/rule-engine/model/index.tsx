import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Divider, Card, Table, message, Button, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import Search from './search';
import { RuleModelItem } from './data.d';
import { ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'dva';
import encodeQueryParam from '@/utils/encodeParam';
import RuleFlow from '../flow';
import apis from '@/services';
import { downloadObject } from '@/utils/utils';
import SearchForm from '@/components/SearchForm';

interface Props {
  ruleModel: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  current: Partial<RuleModelItem>;
}

const RuleModelList: React.FC<Props> = props => {
  const { dispatch } = props;

  const { result } = props.ruleModel;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
    current: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [current, setCurrent] = useState(initState.current);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'ruleModel/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const edit = (record: RuleModelItem) => {
    const temp = JSON.parse(record.modelMeta);
    temp.option = 'update';
    setCurrent(temp);
    setSaveVisible(true);
  };

  const copyModel = (record: RuleModelItem) => {
    // 修改复制model的ID
    const temp = JSON.parse(record.modelMeta);
    temp.option = 'copy';
    temp.id += 'copy';
    setCurrent(temp);
    setSaveVisible(true);
  };

  const deploy = (record: RuleModelItem) => {
    apis.ruleModel
      .deploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('发布成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => { });
  };

  const saveOrUpdate = (item: RuleModelItem) => {
    dispatch({
      type: `ruleModel/${current.option === 'copy' ? 'insert' : 'saveOrUpdate'}`,
      payload: encodeQueryParam(item),
      callback: (response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveVisible(false);
          handleSearch(searchParam);
        }
      },
    });
  };
  const handleDelete = (params: any) => {
    dispatch({
      type: 'ruleModel/remove',
      payload: params.id,
      callback: () => {
        message.success('删除成功');
        handleSearch(searchParam);
      },
    });
  };

  const columns: ColumnProps<RuleModelItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },

    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
    {
      title: '操作',
      width: '25%',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => edit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认发布？" onConfirm={() => deploy(record)}>
            <a>发布</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => downloadObject(record, '规则模型')}>下载配置</a>
          <Divider type="vertical" />
          <a onClick={() => copyModel(record)}>复制</a>
        </Fragment>
      ),
    },
  ];

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<RuleModelItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };

  return (
    <PageHeaderWrapper title="规则模型">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>

            <SearchForm
              formItems={[
                {
                  label: '名称',
                  key: 'name$LIKE',
                  type: 'string'
                },
              ]}
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
        <RuleFlow
          data={current}
          close={() => {
            setSaveVisible(false);
            setCurrent({});
          }}
          save={(data: RuleModelItem) => {
            saveOrUpdate(data);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ ruleModel, loading }: ConnectState) => ({
  ruleModel,
  loading: loading.models.ruleModel,
}))(RuleModelList);

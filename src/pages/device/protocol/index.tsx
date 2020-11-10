import React, { Fragment, useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { Divider, Card, Table, message, Button, Tag, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import { ProtocolItem } from '@/pages/device/protocol/data';
import { ConnectState, Dispatch } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import SearchForm from '@/components/SearchForm';

interface Props {
  protocol: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  current: Partial<ProtocolItem>;
}

const ProtocolList: React.FC<Props> = props => {
  const { dispatch, location } = props;

  const { result } = props.protocol;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10, terms: location?.query?.terms, },
    saveVisible: false,
    current: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [current, setCurrent] = useState(initState.current);

  const handleSearch = (params?: any) => {
    dispatch({
      type: 'protocol/query',
      payload: encodeQueryParam(params),
    });
  };

  const edit = (record: ProtocolItem) => {
    setCurrent(record);
    setSaveVisible(true);
  };

  const handleDelete = (params: any) => {
    dispatch({
      type: 'protocol/remove',
      payload: params.id,
      callback: response => {
        if (response.status === 200) {
          message.success('删除成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  const changeDeploy = (type: string, record: ProtocolItem) => {
    dispatch({
      type: 'protocol/changeDeploy',
      payload: {
        id: record.id,
        type,
      },
      callback: (response: any) => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  const columns: ColumnProps<ProtocolItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      render: text =>
        text === 1 ? <Tag color="#87d068">已发布</Tag> : <Tag color="#f50">未发布</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      width: '250px',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => edit(record)}>编辑</a>
          <Divider type="vertical" />
          {record.state === 1 ? (
              <Popconfirm title="确认重新发布？" onConfirm={() => changeDeploy('_deploy', record)}>
                <a>重新发布</a>
              </Popconfirm>
            ):(
            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          ) }
          <Divider type="vertical" />
          {record.state === 1 ? (
            <Popconfirm title="确认取消发布？" onConfirm={() => changeDeploy('_un-deploy', record)}>
              <a>取消发布</a>
            </Popconfirm>
          ) : (
              <Popconfirm title="确认发布？" onConfirm={() => changeDeploy('_deploy', record)}>
                <a>发布</a>
              </Popconfirm>
            )}
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const saveOrUpdate = (item: ProtocolItem) => {
    dispatch({
      type: 'protocol/insert',
      payload: encodeQueryParam(item),
      callback: (response: any) => {
        if (response.status === 200) {
          setSaveVisible(false);
          handleSearch(searchParam);
        }
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<ProtocolItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam,
      sorts: sorter,
    });
  };

  return (
    <PageHeaderWrapper title="协议管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>

            <SearchForm
              formItems={[
                {
                  label: '协议名称',
                  key: 'name$LIKE',
                  type: 'string'
                }
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
                setCurrent({});
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
              rowKey='id'
              onChange={onTableChange}
              pagination={{
                current: result.pageIndex + 1,
                total: result.total,
                pageSize: result.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total: number) => (
                  `共 ${total} 条记录 第  ${result.pageIndex + 1
                  }/${Math.ceil(result.total / result.pageSize)
                  }页`
                ),
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
          save={(data: ProtocolItem) => {
            saveOrUpdate(data);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ protocol, loading }: ConnectState) => ({
  protocol,
  loading: loading.models.protocol,
}))(ProtocolList);

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, Fragment, useEffect } from 'react';
import { Divider, Button, Card, Table, message, Popconfirm } from 'antd';
import { GatewayItem } from './data.d';
import styles from '@/utils/table.less';
// import Search from './search';

import Save from './save';
import { Dispatch, ConnectState } from '@/models/connect';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/es/table';
import encodeQueryParam from '@/utils/encodeParam';
import { connect } from 'dva';
import apis from '@/services';

interface Props {
  gateway: any;
  dispatch: Dispatch;
  loading: boolean;
}
interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<GatewayItem>;
  providerList: any[];
  networkList: any;
}

const Gateway: React.FC<Props> = props => {
  const {
    dispatch,
    gateway: { result },
  } = props;
  const initState: State = {
    data: props.gateway,
    searchParam: {},
    saveVisible: false,
    currentItem: {},
    providerList: [],
    networkList: [],
  };

  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [providerList, setProviderList] = useState(initState.providerList);
  const [networkList, setNetworkList] = useState(initState.networkList);

  const handleSearch = (params?: any) => {
    dispatch({
      type: 'gateway/query',
      payload: encodeQueryParam(params),
    });
    setSearchParam(params);
  };

  useEffect(() => {
    handleSearch(searchParam);
    apis.gateway
      .providers()
      .then(response => {
        setProviderList(response.result);
      })
      .catch(() => {});

    apis.network
      .list()
      .then(response => {
        setNetworkList(response.result);
      })
      .catch(() => {});
  }, []);

  const startUp = (record: any) => {
    apis.gateway
      .startUp(record.id)
      .then(response => {
        if (response) {
          handleSearch();
          message.success('操作成功');
        }
      })
      .catch(() => {});
  };

  const paused = (record: any) => {
    apis.gateway
      .pause(record.id)
      .then(response => {
        if (response) {
          handleSearch();
          message.success('操作成功');
        }
      })
      .catch(() => {});
  };

  const shutdown = (record: any) => {
    apis.gateway
      .shutdown(record.id)
      .then(response => {
        if (response) {
          handleSearch();
          message.success('操作成功');
        }
      })
      .catch(() => {});
  };

  const removeItem = (record: any) => {
    apis.gateway
      .remove(record.id)
      .then(response => {
        if (response) {
          handleSearch();
          message.success('删除成功');
        }
      })
      .catch(() => {});
  };

  const saveItem = (data: any) => {
    dispatch({
      type: 'gateway/insert',
      payload: data,
      callback: response => {
        if (response) {
          setSaveVisible(false);
          message.success('保存成功');
          handleSearch();
        }
      },
    });
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<GatewayItem>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  const columns: ColumnProps<GatewayItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'provider',
      render: text => {
        const temp = providerList.find((item: any) => item.id === text);
        return temp ? temp.name : text;
      },
    },
    {
      title: '网络组件',
      dataIndex: 'networkId',
      render: text => {
        const temp = networkList.find((item: any) => item.id === text);
        return temp ? temp.name : text;
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: text => text?.text,
    },
    {
      title: '操作',
      width: '250px',
      align: 'center',
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
          {record.state && record.state.value === 'disabled' && (
            <>
              <a
                onClick={() => {
                  startUp(record);
                }}
              >
                启动
              </a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除？" onConfirm={() => removeItem(record)}>
                <a>删除</a>
              </Popconfirm>
            </>
          )}
          {record.state && record.state.value === 'enabled' && (
            <>
              <a
                onClick={() => {
                  paused(record);
                }}
              >
                暂停
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  shutdown(record);
                }}
              >
                停止
              </a>
            </>
          )}
          {record.state && record.state.value === 'paused' && (
            <a
              onClick={() => {
                startUp(record);
              }}
            >
              恢复
            </a>
          )}
        </Fragment>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title="设备网关">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            {/* <Search search={(params: any) => {
                            // setSearchParam({ pageSize: 10, terms: params });
                            // handleSearch({ terms: params, pageSize: 10 })
                        }} /> */}
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
              dataSource={result.data}
              columns={columns}
              rowKey="id"
              onChange={onTableChange}
              pagination={false}
            />
          </div>
        </div>
      </Card>
      {saveVisible && (
        <Save
          save={(item: any) => {
            saveItem(item);
          }}
          close={() => {
            setCurrentItem({});
            setSaveVisible(false);
          }}
          data={currentItem}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ gateway, loading }: ConnectState) => ({
  gateway,
  loading: loading.models.gateway,
}))(Gateway);

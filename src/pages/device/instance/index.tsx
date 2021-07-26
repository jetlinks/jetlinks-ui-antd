import React, { FC, Fragment, useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Icon,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import { router } from 'umi';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState, Dispatch } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import { getAccessToken } from '@/utils/authority';
import moment from 'moment';
import Save from './Save';
import Search from './Search';
import { DeviceInstance } from './data.d';
import Process from './Process';
import Import from './operation/import';
import Export from './operation/export';
import numeral from 'numeral';
import { DeviceProduct } from '@/pages/device/product/data';
import { getPageQuery } from '@/utils/utils';

interface Props extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch;
  deviceInstance: any;
  location: Location;
}

interface State {
  data: any;
  searchParam: any;
  addVisible: boolean;
  currentItem: Partial<DeviceInstance>;
  processVisible: boolean;
  importLoading: boolean;
  action: string;
  deviceCount: any;
  productList: DeviceProduct[];
  deviceIdList: any[];
}

const DeviceInstancePage: React.FC<Props> = props => {
  const { result } = props.deviceInstance;
  const { dispatch, location } = props;

  const map = new Map();
  map.set('id', 'id$like');
  map.set('name', 'name$like');
  map.set('orgId', 'orgId$in');
  map.set('devTag', 'id$dev-tag');
  map.set('devBind', 'id$dev-bind$any');
  map.set('devProd', 'productId$dev-prod-cat');
  map.set('productId', 'productId');

  const initState: State = {
    data: result,
    searchParam: {
      pageSize: 10,
      terms: location?.query?.terms,
      sorts: {
        order: 'descend',
        field: 'id',
      },
    },
    addVisible: false,
    currentItem: {},
    processVisible: false,
    importLoading: false,
    action: '',
    deviceCount: {
      notActiveCount: 0,
      offlineCount: 0,
      onlineCount: 0,
      deviceTotal: 0,
      loading: true,
    },
    productList: [],
    deviceIdList: [],
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [addVisible, setAddVisible] = useState(initState.addVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [importLoading, setImportLoading] = useState(initState.importLoading);
  const [action, setAction] = useState(initState.action);
  const [productList, setProductList] = useState(initState.productList);
  const [product, setProduct] = useState<string>();
  const [deviceCount, setDeviceCount] = useState(initState.deviceCount);
  const [deviceImport, setDeviceImport] = useState(false);
  const [deviceExport, setDeviceExport] = useState(false);
  const [deviceIdList, setDeviceIdLIst] = useState(initState.deviceIdList);

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'deviceInstance/query',
      payload: encodeQueryParam(params),
    });
  };

  const delelteInstance = (record: any) => {
    apis.deviceInstance
      .remove(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          deviceIdList.splice(0, deviceIdList.length);
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };

  const changeDeploy = (record: any) => {
    apis.deviceInstance
      .changeDeploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          deviceIdList.splice(0, deviceIdList.length);
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };

  const unDeploy = (record: any) => {
    apis.deviceInstance
      .unDeploy(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          deviceIdList.splice(0, deviceIdList.length);
          handleSearch(searchParam);
        }
      })
      .catch(() => {});
  };
  const columns: ColumnProps<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '90px',
      render: record =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      filters: [
        {
          text: '未启用',
          value: 'notActive',
        },
        {
          text: '离线',
          value: 'offline',
        },
        {
          text: '在线',
          value: 'online',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '说明',
      dataIndex: 'describe',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '操作',
      width: '200px',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          <a
            onClick={() => {
              router.push(`/device/instance/save/${record.id}`);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem(record);
              setAddVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          {record.state?.value === 'notActive' ? (
            <span>
              <Popconfirm
                title="确认启用？"
                onConfirm={() => {
                  changeDeploy(record);
                }}
              >
                <a>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除？"
                onConfirm={() => {
                  delelteInstance(record);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <Popconfirm
              title="确认禁用设备？"
              onConfirm={() => {
                unDeploy(record);
              }}
            >
              <a>禁用</a>
            </Popconfirm>
          )}
        </Fragment>
      ),
    },
  ];

  const stateCount = (productId: string) => {
    const map = {
      notActiveCount: 0,
      offlineCount: 0,
      onlineCount: 0,
      deviceTotal: 0,
      loading: true,
    };

    apis.deviceInstance
      .count(
        encodeQueryParam({
          terms: {
            state: 'notActive',
            productId,
            ...location?.query?.terms,
            ...(location?.query.iop && JSON.parse(location?.query.iop)?.terms),
          },
        }),
      )
      .then(res => {
        if (res.status === 200) {
          map.notActiveCount = res.result;
          setDeviceCount({ ...map });
        }
      })
      .catch();
    apis.deviceInstance
      .count(
        encodeQueryParam({
          terms: {
            state: 'offline',
            productId,
            ...location?.query?.terms,
            ...(location?.query.iop && JSON.parse(location?.query.iop)?.terms),
          },
        }),
      )
      .then(res => {
        if (res.status === 200) {
          map.offlineCount = res.result;
          setDeviceCount({ ...map });
        }
      })
      .catch();
    apis.deviceInstance
      .count(
        encodeQueryParam({
          terms: {
            state: 'online',
            productId,
            ...location?.query?.terms,
            ...(location?.query.iop && JSON.parse(location?.query.iop)?.terms),
          },
        }),
      )
      .then(res => {
        if (res.status === 200) {
          map.onlineCount = res.result;
          setDeviceCount({ ...map });
        }
      })
      .catch();
    apis.deviceInstance
      .count(
        encodeQueryParam({
          terms: {
            productId,
            ...location?.query?.terms,
            ...(location?.query.iop && JSON.parse(location?.query.iop)?.terms),
          },
        }),
      )
      .then(res => {
        if (res.status === 200) {
          map.deviceTotal = res.result;
          map.loading = false;
          setDeviceCount({ ...map });
        }
      })
      .catch();
  };

  useEffect(() => {
    // 获取下拉框数据
    apis.deviceProdcut
      .queryNoPagin(
        encodeQueryParam({
          paging: false,
        }),
      )
      .then(e => {
        setProductList(e.result);
      })
      .catch(() => {});

    const query: any = getPageQuery();
    if (query.hasOwnProperty('productId')) {
      const { productId } = query;
      setProduct(productId);
      handleSearch({
        terms: {
          productId: query.productId,
        },
        pageSize: 10,
      });
      stateCount(productId);
    } else if (location?.query) {
      let key = Object.keys(location?.query)[0];
      let params = {};
      params[map.get(key)] = location?.query[key];
      handleSearch({
        terms: { ...params, ...(location?.query.iop && JSON.parse(location?.query.iop)?.terms) },
        pageSize: 10,
        sorts: searchParam.sorts,
      });
      stateCount('');
    } else {
      handleSearch(searchParam);
      stateCount('');
    }
  }, []);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<DeviceInstance>,
  ) => {
    let { terms } = searchParam;
    if (filters.state) {
      if (terms) {
        terms.state = filters.state[0];
      } else {
        terms = {
          state: filters.state[0],
        };
      }
    }
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms,
      sorts: sorter,
    });
  };

  const [processVisible, setProcessVisible] = useState(false);

  const [api, setAPI] = useState<string>('');

  const getSearchParam = () => {
    const data = encodeQueryParam(searchParam);
    let temp = '';
    Object.keys(data).forEach((i: string) => {
      if (data[i] && i !== 'pageSize' && i !== 'pageIndex') {
        temp += `${i}=${data[i]}&`;
      }
    });
    return encodeURI(temp.replace(/%/g, '%'));
  };
  // 激活全部设备
  const startImport = () => {
    setProcessVisible(true);
    const activeAPI = `/jetlinks/device-instance/deploy?${getSearchParam()}:X_Access_Token=${getAccessToken()} `;
    setAPI(activeAPI);
    setAction('active');
  };

  const startSync = () => {
    setProcessVisible(true);
    const syncAPI = `/jetlinks/device-instance/state/_sync/?${getSearchParam()}:X_Access_Token=${getAccessToken()}`;
    setAPI(syncAPI);
    setAction('sync');
  };

  const activeDevice = () => {
    Modal.confirm({
      title: `确认激活全部设备`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        startImport();
      },
    });
  };

  const syncDevice = () => {
    Modal.confirm({
      title: '确定同步设备真实状态?',
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        // 同步设备
        startSync();
      },
    });
  };

  const onDeviceProduct = (value: string) => {
    let { terms } = searchParam;
    if (terms) {
      terms.productId = value;
    } else {
      terms = {
        productId: value,
      };
    }

    handleSearch({
      pageIndex: searchParam.pageIndex,
      pageSize: searchParam.pageSize,
      terms,
      sorts: searchParam.sorter,
    });
    stateCount(value);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setDeviceIdLIst(selectedRowKeys);
    },
  };

  const _delete = (deviceId: any[]) => {
    Modal.confirm({
      title: `确认删除选中设备`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        apis.deviceInstance
          ._delete(deviceId)
          .then(response => {
            if (response.status === 200) {
              message.success('成功删除选中设备');
              deviceIdList.splice(0, deviceIdList.length);
              handleSearch(searchParam);
            }
          })
          .catch(() => {});
      },
    });
  };

  const _unDeploy = (deviceId: any[]) => {
    Modal.confirm({
      title: `确认注销选中设备`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        apis.deviceInstance
          ._unDeploy(deviceId)
          .then(response => {
            if (response.status === 200) {
              message.success('成功注销选中设备');
              deviceIdList.splice(0, deviceIdList.length);
              handleSearch(searchParam);
            }
          })
          .catch(() => {});
      },
    });
  };

  const _deploy = (deviceId: any[]) => {
    Modal.confirm({
      title: `确认激活选中设备`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        apis.deviceInstance
          ._deploy(deviceId)
          .then(response => {
            if (response.status === 200) {
              message.success('成功激活选中设备');
              deviceIdList.splice(0, deviceIdList.length);
              handleSearch(searchParam);
            }
          })
          .catch(() => {});
      },
    });
  };

  const Info: FC<{
    title: React.ReactNode;
    value: React.ReactNode;
  }> = ({ title, value }) => (
    <div>
      <span>{title}</span>
      <p style={{ fontSize: '26px' }}>{value}</p>
    </div>
  );

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          icon="download"
          type="default"
          onClick={() => {
            setDeviceExport(true);
          }}
        >
          批量导出设备
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button
          icon="upload"
          onClick={() => {
            setDeviceImport(true);
          }}
        >
          批量导入设备
        </Button>
      </Menu.Item>
      {deviceIdList.length > 0 && (
        <Menu.Item key="3">
          <Button
            icon="delete"
            onClick={() => {
              _delete(deviceIdList);
            }}
          >
            删除选中设备
          </Button>
        </Menu.Item>
      )}
      {deviceIdList.length > 0 && (
        <Menu.Item key="6">
          <Button
            icon="stop"
            onClick={() => {
              _unDeploy(deviceIdList);
            }}
          >
            注销选中设备
          </Button>
        </Menu.Item>
      )}

      {deviceIdList.length > 0 ? (
        <Menu.Item key="4">
          <Button icon="check-circle" type="danger" onClick={() => _deploy(deviceIdList)}>
            激活选中设备
          </Button>
        </Menu.Item>
      ) : (
        <Menu.Item key="4">
          <Button icon="check-circle" type="danger" onClick={() => activeDevice()}>
            激活全部设备
          </Button>
        </Menu.Item>
      )}

      <Menu.Item key="5">
        <Button icon="sync" type="danger" onClick={() => syncDevice()}>
          同步设备状态
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <PageHeaderWrapper title="设备管理">
      <div className={styles.standardList}>
        <Card bordered={false} style={{ height: 95 }}>
          <Spin spinning={deviceCount.loading}>
            <Row>
              <Col sm={7} xs={24}>
                <Select
                  placeholder="选择产品"
                  allowClear
                  style={{ width: '70%', marginTop: 7 }}
                  value={product}
                  onChange={(value: string) => {
                    let key = Object.keys(location?.query)[0];
                    let params = {};
                    if (location?.query) {
                      params[key] = location?.query[key];
                    }
                    params['productId'] = value;
                    router.push({ pathname: `/device/instance`, query: params });
                    setProduct(() => value);
                    setDeviceCount({ loading: true });
                    onDeviceProduct(value);
                  }}
                >
                  {productList?.map(item => (
                    <Select.Option key={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col sm={4} xs={24}>
                <Info title="全部设备" value={numeral(deviceCount.deviceTotal).format('0,0')} />
              </Col>
              <Col sm={4} xs={24}>
                <Info
                  title={<Badge status={statusMap.get('online')} text="在线" />}
                  value={numeral(deviceCount.onlineCount).format('0,0')}
                />
              </Col>
              <Col sm={4} xs={24}>
                <Info
                  title={<Badge status={statusMap.get('offline')} text="离线" />}
                  value={numeral(deviceCount.offlineCount).format('0,0')}
                />
              </Col>
              <Col sm={4} xs={24}>
                <Info
                  title={<Badge status={statusMap.get('notActive')} text="未启用" />}
                  value={numeral(deviceCount.notActiveCount).format('0,0')}
                />
              </Col>
              <Col sm={1} xs={24}>
                <Tooltip title="刷新">
                  <Icon
                    type="sync"
                    style={{ fontSize: 20 }}
                    onClick={() => {
                      setDeviceCount({ loading: true });
                      stateCount(product);
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </Spin>
        </Card>
        <br />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Search
                search={(params: any) => {
                  if (Object.keys(params).length === 0) {
                    deviceIdList.splice(0, deviceIdList.length);
                  }
                  if (product) {
                    params.productId = product;
                  }
                  params.state = searchParam.terms?.state;
                  handleSearch({ terms: params, pageSize: 10, sorts: searchParam.sorts });
                }}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  setCurrentItem({});
                  setAddVisible(true);
                }}
              >
                添加设备
              </Button>
              <Divider type="vertical" />
              <Dropdown overlay={menu}>
                <Button icon="menu">
                  其他批量操作
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
            <div className={styles.StandardTable}>
              <Table
                loading={props.loading}
                columns={columns}
                dataSource={(result || {}).data}
                rowKey="id"
                onChange={onTableChange}
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
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
        {addVisible && (
          <Save
            data={currentItem}
            close={() => {
              setAddVisible(false);
              setCurrentItem({});
            }}
          />
        )}
        {(processVisible || importLoading) && (
          <Process
            api={api}
            action={action}
            closeVisible={() => {
              setProcessVisible(false);
              setImportLoading(false);
              handleSearch(searchParam);
            }}
          />
        )}
        {deviceImport && (
          <Import
            productId={product}
            close={() => {
              setDeviceImport(false);
              handleSearch(searchParam);
            }}
          />
        )}
        {deviceExport && (
          <Export
            productId={product}
            searchParam={searchParam}
            close={() => {
              setDeviceExport(false);
              handleSearch(searchParam);
            }}
          />
        )}
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ deviceInstance, loading }: ConnectState) => ({
  deviceInstance,
  loading: loading.models.deviceInstance,
}))(DeviceInstancePage);

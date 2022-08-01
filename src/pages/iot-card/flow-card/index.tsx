import React, { FC, Fragment, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Badge, Button, Card, Col, Divider, Icon, message, Modal, Popconfirm, Row, Select, Spin, Switch, Table, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import numeral from 'numeral';
import styles from '@/utils/table.less';
import Search from './Search';
import Bind from './Bind';
import Save from './Save';
import Pay from './Pay';
import CheckInfo from './CheckInfo';
import Import from './operation/import';
import moment from 'moment';
import apis from '@/services';
import { ConnectState, Dispatch } from '@/models/connect';
import { FlowCard } from './data.d';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import { Tooltip } from "bizcharts";
import encodeQueryParam from '@/utils/encodeParam';
import { getPageQuery } from '@/utils/utils';
import flowStyle from './style.less';

interface Props extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch;
  flowCard: any;
  location: Location;
}

interface State {
  data: any;
  searchParam: any;
  addVisible: boolean;
  flowCardCount: any;
  checkVisible: boolean; // 查看
  bindVisible: boolean; // 绑定
  productList: any;
  deviceIdList: any[];
  currentItem: Partial<FlowCard>;
  payVisible: boolean;
}

const flowCardList: React.FC<Props> = props => {
  const { result } = props.flowCard;
  const { dispatch, location } = props;

  const map = new Map();
  map.set('id', 'id$LIKE');
  map.set('name', 'name$LIKE');
  map.set('devBind', 'id$dev-bind$any');
  map.set('devProd', 'productId$dev-prod-cat');
  map.set('productId', 'productId');

  const initState: State = {
    data: result,
    searchParam: {
      pageSize: 10,
      terms: location?.query?.terms,
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
    },
    addVisible: false, // 新增
    checkVisible: false, // 查看
    bindVisible: false, // 绑定
    flowCardCount: {
      simCard: 0, // SIM卡
      trafficStatistics: 0, // 流量统计
      activation: 0, // 激活
      inactivated: 0, // 未激活
      loading: true,
    },
    productList: [],
    deviceIdList: [],
    currentItem: {},
    payVisible: false
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [addVisible, setAddVisible] = useState(initState.addVisible);
  const [checkVisible, setCheckVisible] = useState(initState.checkVisible);
  const [bindVisible, setBindVisible] = useState(initState.bindVisible);
  const [flowCardCount, setFlowCardCount] = useState(initState.flowCardCount);
  const [product, setProduct] = useState<string>();
  const [productList, setProductList] = useState(initState.productList);
  const [deviceIdList, setDeviceIdLIst] = useState(initState.deviceIdList);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [importingFiles, setImportingFiles] = useState(false);
  const [oneLink, setOneLink] = useState<array>([]);
  const [configureList, setConfigureList] = useState<array>([]);
  const [payVisible, setPayVisible] = useState(initState.payVisible);

  const statusMap = new Map();
  statusMap.set('激活', 'success');
  statusMap.set('未激活', 'error');
  statusMap.set('activate', 'success');
  statusMap.set('notActivate', 'error');

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    const { productId, ...terms } = params.terms || {}
    if (productId) {
      dispatch({
        type: 'flowCard/queryByProduct',
        payload: { productId, params: encodeQueryParam({ ...params, terms }) },
      });
    } else {
      dispatch({
        type: 'flowCard/query',
        payload: encodeQueryParam(params),
      });
    }
  };

  // 激活
  const activeDevice = (deviceIdList) => {
    if (deviceIdList.length !== 1) {
      message.warn('请选择一条数据')
      return
    }
    Modal.confirm({
      title: `确认激活`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        if (deviceIdList.length > 0) {
          apis.flowCard.changeDeploy(deviceIdList)
            .then((response: any) => {
              if (response.status === 200) {
                message.info(response.result);
                doSync(deviceIdList, null)
              }
            })
            .catch(() => {
            });
        }
      },
    });
  };

  // 缴费
  const pay = (deviceIdList) => {
    // if (deviceIdList.length !== 1) {
    //   message.warn('请选择一条数据')
    //   return
    // }
    setPayVisible(true)
  };

  // 停用
  const stop = (deviceIdList) => {
    if (deviceIdList.length !== 1) {
      message.warn('请选择一条数据')
      return
    }
    Modal.confirm({
      title: `确认停用`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        if (deviceIdList.length > 0) {
          apis.flowCard.unDeploy(deviceIdList)
            .then((response: any) => {
              if (response.status === 200) {
                message.info(response.result);
                doSync(deviceIdList, null)
              }
            })
            .catch(() => {
            });
        }
      },
    });
  };

  // 同步物联卡状态
  const sync = (deviceIdList) => {
    // if (deviceIdList.length === 0) {
    //   message.warn('请选择数据')
    //   return
    // }
    Modal.confirm({
      title: `确认同步物联卡状态`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        doSync(deviceIdList, () => {
          message.success('同步状态成功');
        })
      },
    });
  };

  const doSync = (deviceIdList, callback) => {
    apis.flowCard.sync()
      .then((response: any) => {
        if (response.status === 200) {
          handleSearch(searchParam);
          if (callback) callback()
        }
      })
      .catch(() => {
    });
  }

  // 复机
  const resumption = (deviceIdList) => {
    if (deviceIdList.length !== 1) {
      message.warn('请选择一条数据')
      return
    }
    Modal.confirm({
      title: `确认复机`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        if (deviceIdList.length > 0) {
          apis.flowCard.resumption(deviceIdList)
            .then((response: any) => {
              if (response.status === 200) {
                message.info(response.result);
                doSync(deviceIdList, null)
              }
            })
            .catch(() => {
            });
        }
      },
    });
  };

  // 解绑
  const unbindDevice = (record: any) => {
    apis.flowCard
      .unbindDevice(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => { });
  };

  // 删除
  const deleteCard = (record: any) => {
    apis.flowCard
      .remove(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => { });
  };

  // 提醒状态修改
  const changeStatus = (item: any) => {
    let type;
    if (item.reminderSwitch === false) {
      type = true;
    } else if (item.reminderSwitch === true) {
      type = false;
    }
    apis.flowCard
      .update(item.id, { reminderSwitch: type })
      .then((res) => {
        if (res.status === 200)
          message.success('操作成功');
        handleSearch(searchParam);
      })
      .catch(() => { });
  };

  const columns: ColumnProps<FlowCard>[] = [
    {
      title: '卡号',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: 'ICCID',
      align: 'center',
      dataIndex: 'iccId',
      ellipsis: true,
    },
    {
      title: '设备ID',
      align: 'center',
      dataIndex: 'deviceId',
      ellipsis: true,
    },
    {
      title: '对接平台配置ID',
      align: 'center',
      dataIndex: 'platformConfigId',
      render: (text: any) => (configureList.map((item) => { if (item.id === text) return item.name })),
      ellipsis: true,
    },
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'operatorName',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'cardType.text',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'cardState.text',
    },
    {
      title: '总流量',
      dataIndex: 'totalFlow',
      render: (text) => (`${text}KB`),
    },
    {
      title: '使用流量',
      dataIndex: 'usedFlow',
      render: (text) => (`${text}KB`),
      sorter: true,
    },
    {
      title: '剩余流量',
      dataIndex: 'residualFlow',
      render: (text) => { return (<div className={flowStyle.flowColor}>{text}KB</div>) },
      sorter: true,
    },
    {
      title: '激活日期',
      dataIndex: 'activationDate',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
    },
    {
      title: '提醒',
      dataIndex: 'reminderSwitch',
      render: (text, record) =>
      (<Popconfirm
        title={`确认${text === false ? '打开' : '关闭'}`}
        onConfirm={() => {
          changeStatus(record);
        }}
      >
        <span>
          <Switch
            size="small"
            checked={
              text === false
                ? false
                : text === true
            }
          />
        </span>
      </Popconfirm>),
      filters: [
        {
          text: '打开',
          value: 'true',
        },
        {
          text: '关闭',
          value: 'false',
        }
      ],
      filterMultiple: false,
    },
    {
      title: '操作',
      width: 250,
      align: 'center',
      render: (record: any) => (
        <Fragment>
          <a
            onClick={() => {
              setAddVisible(true);
              setCurrentItem(record);
            }}
          >
            编辑
          </ a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCheckVisible(true);
              setCurrentItem(record);
            }}
          >
            查看
          </ a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setBindVisible(true)
              setCurrentItem(record);
            }}
          >
            绑定</ a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认解绑？"
            onConfirm={() => {
              unbindDevice(record);
            }}
          >
            <a>解绑</ a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteCard(record);
            }}
          >
            <a>删除</ a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const stateCount = (productId: string) => {
    const map = {
      simCard: 0, // SIM卡
      trafficStatistics: 0, // 流量统计
      activation: 0, // 激活
      inactivated: 0, // 未激活
      loading: true,
    };

    if (productId) {
      apis.flowCard.
        productCard(
          productId,
          encodeQueryParam({}),
        )
        .then(res => {
          if (res.status === 200) {
            map.simCard = res.result.total;
            setFlowCardCount({ ...map });
          }
        })
        .catch();
    } else {
      apis.flowCard
        .count(
          encodeQueryParam({}),
        )
        .then(res => {
          if (res.status === 200) {
            map.simCard = res.result;
            setFlowCardCount({ ...map });
          }
        })
        .catch();
    }
    apis.flowCard
      .statistics()
      .then(res => {
        if (res.status === 200) {
          map.trafficStatistics = res.result;
          setFlowCardCount({ ...map });
        }
      })
      .catch();
    if (productId) {
      apis.flowCard.
        productCardCount(
          productId,
          'using'
        )
        .then(res => {
          if (res.status === 200) {
            map.activation = res.result;
            setFlowCardCount({ ...map });
          }
        })
        .catch();
    } else {
      apis.flowCard
        .statusCount('using')
        .then(res => {
          if (res.status === 200) {
            map.activation = res.result;
            setFlowCardCount({ ...map });
          }
        })
        .catch();
    }
    if (productId) {
      apis.flowCard.
        productCardCount(
          productId,
          'toBeActivated'
        )
        .then(res => {
          if (res.status === 200) {
            map.inactivated = res.result;
            map.loading = false;
            setFlowCardCount({ ...map });
          }
        })
        .catch();
    } else {
      apis.flowCard
        .statusCount('toBeActivated')
        .then(res => {
          if (res.status === 200) {
            map.inactivated = res.result;
            map.loading = false;
            setFlowCardCount({ ...map });
          }
        })
        .catch();
    }
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
      .catch(() => { });

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
      console.log(key)
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
    Promise.all([
      apis.onelink
        .listNoPaging(
          encodeQueryParam({
            paging: false,
          }),
        ),
      apis.ctwingCmp
        .listNoPaging(
          encodeQueryParam({
            paging: false,
          }),
        )
    ]).then(([res1, res2]) => {
      setOneLink(res1.result)
      setConfigureList(res1.result.concat(res2.result))
    })
  }, []);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<FlowCard>,
  ) => {
    let { terms } = searchParam;
    if (filters.reminderSwitch) {
      if (terms) {
        terms.reminderSwitch = filters.reminderSwitch[0];
      } else {
        terms = {
          reminderSwitch: filters.reminderSwitch[0],
        };
      }
    }
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms,
      sorts: sorter.field ? sorter : searchParam.sorts,
    });
  };

  const onDeviceProduct = (value: string) => {
    let { terms = {} } = searchParam;
    if (value) {
      terms.productId = value;
    } else {
      delete terms.productId
    }

    handleSearch({
      pageIndex: searchParam.pageIndex,
      pageSize: searchParam.pageSize,
      terms,
      sorts: searchParam.sorts,
    });
    stateCount(value);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setDeviceIdLIst(selectedRowKeys);
    },
  };

  const Info: FC<{
    title: React.ReactNode;
    value: React.ReactNode;
    unit: React.ReactNode;
  }> = ({ title, value, unit }) => (
    <div>
      <span>{title}</span>
      <p style={{ fontSize: '26px' }}>{value}<span> {unit} </span></p>
    </div>
  );

  return (
    <PageHeaderWrapper title="流量卡">
      <div className={styles.standardList}>
        <Card bordered={false} style={{ height: 95 }}>
          <Spin spinning={flowCardCount.loading}>
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
                    setProduct(() => value);
                    setFlowCardCount({ loading: true });
                    onDeviceProduct(value);
                  }}
                >
                  {productList?.map(item => (
                    <Select.Option key={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col sm={4} xs={24}>
                <Info title="SIM卡" value={numeral(flowCardCount.simCard).format('0,0')} unit="" />
              </Col>
              <Col sm={4} xs={24}>
                <Info
                  title="流量统计"
                  value={numeral(flowCardCount.trafficStatistics).format('0,0')}
                  unit="kb"
                />
              </Col>
              <Col sm={4} xs={24}>
                <Info
                  title={<Badge status={statusMap.get('activate')} text="激活" />}
                  value={numeral(flowCardCount.activation).format('0,0')}
                  unit=""
                />
              </Col>
              <Col sm={4} xs={24}>
                <Info
                  title={<Badge status={statusMap.get('notActivate')} text="未激活" />}
                  value={numeral(flowCardCount.inactivated).format('0,0')}
                  unit=""
                />
              </Col>
              <Col sm={1} xs={24}>
                <Tooltip title="刷新">
                  <Icon
                    type="sync"
                    style={{ fontSize: 20 }}
                    onClick={() => {
                      setFlowCardCount({ loading: true });
                      stateCount(product);
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </Spin>
        </Card>
      </div>
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
          <Button
            type="primary"
            onClick={() => {
              setCurrentItem({});
              setAddVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            添加
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              activeDevice(deviceIdList);
            }}
            style={{ marginBottom: 16 }}
          >
            激活
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              setImportingFiles(true);
            }}
            style={{ marginBottom: 16 }}
          >
            导入
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              stop(deviceIdList)
            }}
            style={{ marginBottom: 16 }}
          >
            停用
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              resumption(deviceIdList)
            }}
            style={{ marginBottom: 16 }}
          >
            复机
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              sync(deviceIdList)
            }}
            style={{ marginBottom: 16 }}
          >
            同步状态
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              pay(deviceIdList)
            }}
            style={{ marginBottom: 16 }}
          >
            缴费
          </Button>
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
          reload={() => {
            handleSearch(searchParam)
          }}
          configure={configureList}
        />
      )}
      {checkVisible && (
        <CheckInfo
          data={currentItem}
          close={() => {
            setCheckVisible(false);
            setCurrentItem({});
          }}
        />
      )}
      {bindVisible && (
        <Bind selectionType='radio'
          data={currentItem}
          close={() => {
            setBindVisible(false);
            setCurrentItem({});
          }}
          reload={() => {
            handleSearch(searchParam)
          }}
        />
      )}
      {importingFiles && (
        <Import
          configure={configureList}
          close={() => {
            setImportingFiles(false);
          }}
          reload={() => {
            handleSearch(searchParam)
          }}
        />
      )}
      {payVisible && (
        <Pay
          data={currentItem}
          close={() => {
            setPayVisible(false);
          }}
          reload={() => {
            handleSearch(searchParam)
          }}
          configure={oneLink}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ flowCard, loading }: ConnectState) => ({
  flowCard,
  loading: loading.models.flowCard,
}))(flowCardList);

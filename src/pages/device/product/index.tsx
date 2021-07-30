import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Dropdown,
  Icon,
  List,
  Menu,
  message,
  Popconfirm,
  Spin,
  Tooltip,
  Upload,
} from 'antd';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import { router } from 'umi';
import encodeQueryParam from '@/utils/encodeParam';
import cardStyles from './index.less';
import productImg from '@/pages/device/product/img/product.png';
import Save from './save';
import { downloadObject } from '@/utils/utils';
import SearchForm from '@/components/SearchForm';
import apis from '@/services';
import numeral from 'numeral';
import AutoHide from '@/pages/device/location/info/autoHide';
import { getAccessToken } from '@/utils/authority';

interface Props {
  dispatch: Dispatch;
  deviceProduct: any;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
}

const DeviceModel: React.FC<Props> = props => {
  const { result } = props.deviceProduct;
  const { dispatch, location } = props;

  const initState: State = {
    data: result,
    searchParam: {
      pageSize: 8,
      terms: location?.query.iop && JSON.parse(location?.query.iop)?.terms,
      sorts: { field: 'id', order: 'desc' },
    },
    saveVisible: false,
  };

  // 消息协议
  const [protocolSupports, setProtocolSupports] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [deviceCount, setDeviceCount] = useState({});
  const [spinning, setSpinning] = useState(true);
  const [basicInfo, setBasicInfo] = useState<any>();

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'deviceProduct/query',
      payload: encodeQueryParam(params),
    });
  };

  const deploy = (record: any) => {
    dispatch({
      type: 'deviceProduct/deploy',
      payload: record.id,
      callback: response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      },
    });
  };
  const unDeploy = (record: any) => {
    dispatch({
      type: 'deviceProduct/unDeploy',
      payload: record.id,
      callback: response => {
        if (response.status === 200) {
          message.success('操作成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  const handleDelete = (params: any) => {
    dispatch({
      type: 'deviceProduct/remove',
      payload: params.id,
      callback: response => {
        if (response.status === 200) {
          message.success('删除成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  useEffect(() => {
    apis.deviceProdcut
      .deviceCategory()
      .then((response: any) => {
        if (response.status === 200) {
          setCategoryList(
            response.result.map((item: any) => ({
              id: item.id,
              pId: item.parentId,
              value: item.id,
              title: item.name,
            })),
          );
        }
      })
      .catch(() => {});

    apis.deviceProdcut
      .protocolSupport()
      .then(response => {
        if (response.status === 200) {
          setProtocolSupports(response.result.map((i: any) => ({ id: i.id, name: i.name })));
        }
      })
      .catch(() => {});

    handleSearch(searchParam);
  }, []);

  useEffect(() => {
    result.data?.map((item: any) => {
      apis.deviceInstance
        .count(encodeQueryParam({ terms: { productId: item.id } }))
        .then(res => {
          if (res.status === 200) {
            deviceCount[item.id] = String(res.result);
            setDeviceCount({ ...deviceCount });
          } else {
            deviceCount[item.id] = '/';
            setDeviceCount({ ...deviceCount });
          }
        })
        .catch();
    });

    setSpinning(false);
  }, [result]);

  const handleSave = (record: any) => {
    dispatch({
      type: 'deviceProduct/insert',
      payload: record,
      callback: response => {
        if (response.status === 200) {
          setSaveVisible(false);
          message.success('保存成功');
          router.push(`/device/product/save/${record.id}`);
        }
      },
    });
  };

  const onChange = (page: number, pageSize: number) => {
    handleSearch({
      pageIndex: page - 1,
      pageSize,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const onShowSizeChange = (current: number, size: number) => {
    handleSearch({
      pageIndex: current - 1,
      pageSize: size,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const uploadProps = (item: any) => {
    dispatch({
      type: 'deviceProduct/insert',
      payload: item,
      callback: (response: any) => {
        if (response.status === 200) {
          message.success('导入成功');
          handleSearch(searchParam);
        }
      },
    });
  };
  /*  const uploadProps: UploadProps = {
    accept: '.json',
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        const fileUrl = info.file.response.result;
        request(fileUrl, {method: 'GET'}).then(e => {
          if (e || e !== null) {
            dispatch({
              type: 'deviceProduct/insert',
              payload: e,
              callback: (response: any) => {
                if (response.status === 200) {
                  message.success('导入成功');
                  handleSearch(searchParam);
                }
              },
            });
          }
        }).catch(() => {
          message.error('导入配置失败');
        });
      }
    },
  };*/

  const cardInfoTitle = {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)',
  };

  return (
    <PageHeaderWrapper title="产品管理">
      <Spin spinning={spinning}>
        <Card bordered={false}>
          <div>
            <div>
              <SearchForm
                search={(params: any) => {
                  handleSearch({
                    terms: { ...params },
                    pageSize: 8,
                    sorts: searchParam.sorts,
                  });
                }}
                formItems={[
                  {
                    label: '产品名称',
                    key: 'name$LIKE',
                    type: 'string',
                  },
                  {
                    label: '所属品类',
                    key: 'classifiedId$LIKE',
                    type: 'treeSelect',
                    props: {
                      data: categoryList,
                      dropdownStyle: { maxHeight: 500 },
                    },
                  },
                  {
                    label: '产品类型',
                    key: 'deviceType$IN',
                    type: 'list',
                    props: {
                      data: [
                        { id: 'device', name: '直连设备' },
                        { id: 'childrenDevice', name: '网关子设备' },
                        { id: 'gateway', name: '网关设备' },
                      ],
                      mode: 'tags',
                    },
                  },
                  {
                    label: '消息协议',
                    key: 'messageProtocol$IN',
                    type: 'list',
                    props: {
                      data: protocolSupports,
                      mode: 'tags',
                    },
                  },
                ]}
              />
            </div>
            <div>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  router.push('/device/product/add');
                }}
              >
                新建
              </Button>
              <Divider type="vertical" />

              <Upload
              action="/jetlinks/file/static"
              headers={{
                'X-Access-Token': getAccessToken(),
              }}
                showUploadList={false}
                accept=".json"
                beforeUpload={file => {
                  const reader = new FileReader();
                  reader.readAsText(file);
                  reader.onload = result => {
                    try {
                      uploadProps(JSON.parse(result.target.result));
                    } catch (error) {
                      message.error('文件格式错误');
                    }
                  };
                }}
              >
                <Button>
                  <Icon type="upload" />
                  快速导入
                </Button>
              </Upload>
            </div>
          </div>
        </Card>
        <br />
        <div className={cardStyles.filterCardList}>
          {result.data && (
            <List<any>
              rowKey="id"
              loading={props.loading}
              grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
              dataSource={(result || {}).data}
              pagination={{
                current: result?.pageIndex + 1,
                total: result?.total,
                pageSize: result?.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                hideOnSinglePage: true,
                pageSizeOptions: ['8', '16', '40', '80'],
                style: { marginTop: -20 },
                showTotal: (total: number) =>
                  `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                    result.total / result.pageSize,
                  )}页`,
                onChange,
                onShowSizeChange,
              }}
              renderItem={item => {
                if (item && item.id) {
                  return (
                    <List.Item key={item.id}>
                      <Card
                        hoverable
                        bodyStyle={{ paddingBottom: 20 }}
                        actions={[
                          <Tooltip key="seeProduct" title="查看">
                            <Icon
                              type="eye"
                              onClick={() => {
                                router.push(`/device/product/save/${item.id}`);
                              }}
                            />
                          </Tooltip>,
                          <Tooltip key="update" title="编辑">
                            <Icon
                              type="edit"
                              onClick={() => {
                                setBasicInfo(item);
                                setSaveVisible(true);
                              }}
                            />
                          </Tooltip>,
                          <Tooltip key="download" title="下载">
                            <Icon
                              type="download"
                              onClick={() => {
                                downloadObject(item, '产品');
                              }}
                            />
                          </Tooltip>,
                          <Tooltip key="more_actions" title="">
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <Popconfirm
                                      placement="topRight"
                                      title={
                                        item.state !== 0
                                          ? '确定停用此组件吗？'
                                          : '确定发布此组件吗？'
                                      }
                                      onConfirm={() => {
                                        if (item.state === 0) {
                                          deploy(item);
                                        } else {
                                          unDeploy(item);
                                        }
                                      }}
                                    >
                                      <Button
                                        icon={item.state !== 0 ? 'close' : 'check'}
                                        type="link"
                                      >
                                        {item.state !== 0 ? '停用' : '发布'}
                                      </Button>
                                    </Popconfirm>
                                  </Menu.Item>
                                  {item.state === 0 ? (
                                    deviceCount[item.id] === '0' ? (
                                      <Menu.Item key="2">
                                        <Popconfirm
                                          placement="topRight"
                                          title="确定删除此组件吗？"
                                          onConfirm={() => {
                                            if (item.state === 0 && deviceCount[item.id] === '0') {
                                              handleDelete(item);
                                            } else {
                                              message.error('产品以发布，无法删除');
                                            }
                                          }}
                                        >
                                          <Button icon="delete" type="link">
                                            删除
                                          </Button>
                                        </Popconfirm>
                                      </Menu.Item>
                                    ) : (
                                      <Menu.Item key="2">
                                        <Tooltip
                                          placement="bottom"
                                          title="该产品已绑定设备，无法删除"
                                        >
                                          <Button icon="stop" type="link">
                                            删除
                                          </Button>
                                        </Tooltip>
                                      </Menu.Item>
                                    )
                                  ) : (
                                    <Menu.Item key="2">
                                      <Tooltip placement="bottom" title="该产品已发布，无法删除">
                                        <Button icon="stop" type="link">
                                          删除
                                        </Button>
                                      </Tooltip>
                                    </Menu.Item>
                                  )}
                                </Menu>
                              }
                            >
                              <Icon type="ellipsis" />
                            </Dropdown>
                          </Tooltip>,
                        ]}
                      >
                        <Card.Meta
                          avatar={<Avatar size={40} src={item.photoUrl || productImg} />}
                          title={
                            <AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />
                          }
                          description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                        />
                        <div className={cardStyles.cardItemContent}>
                          <div className={cardStyles.cardInfo}>
                            <div style={{ width: '33%', textAlign: 'center' }}>
                              <Spin spinning={!deviceCount[item.id]}>
                                <p style={cardInfoTitle}>设备数量</p>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>
                                  <Tooltip key="findDevice" title="点击查看设备">
                                    <a
                                      onClick={() => {
                                        router.push(`/device/instance?productId=${item.id}`);
                                      }}
                                    >
                                      {numeral(deviceCount[item.id]).format('0,0')}
                                    </a>
                                  </Tooltip>
                                </p>
                              </Spin>
                            </div>
                            <div style={{ width: '33%', textAlign: 'center' }}>
                              <p style={cardInfoTitle}>发布状态</p>
                              <p style={{ fontSize: 14, fontWeight: 600 }}>
                                <Badge
                                  color={item.state === 0 ? 'red' : 'green'}
                                  text={item.state === 0 ? '未发布' : '已发布'}
                                />
                              </p>
                            </div>
                            <div style={{ width: '33%', textAlign: 'center' }}>
                              <p style={cardInfoTitle}>产品类型</p>
                              <AutoHide
                                title={item.deviceType?.text}
                                style={{ fontSize: 14, fontWeight: 600, width: '95%' }}
                              />
                              {/* <p style={{ fontSize: 14, fontWeight: 600 }}>{item.deviceType?.text}</p> */}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  );
                }
                return '';
              }}
            />
          )}
        </div>
      </Spin>
      {saveVisible && (
        <Save
          data={basicInfo}
          close={() => {
            setBasicInfo({});
            setSaveVisible(false);
          }}
          save={item => handleSave(item)}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ deviceProduct, loading }: ConnectState) => ({
  deviceProduct,
  loading: loading.models.deviceProduct,
}))(DeviceModel);

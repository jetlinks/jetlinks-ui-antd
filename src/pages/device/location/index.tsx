import {PageHeaderWrapper} from '@ant-design/pro-layout';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Form, Icon,
  Input,
  List,
  Menu,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Switch,
  Table,
  Tabs, Tooltip,
  TreeSelect,
} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {Map, Polygon} from 'react-amap';
import {ColumnProps} from 'antd/lib/table';
import {DeviceInstance} from '@/pages/device/instance/data';
import apis from '@/services';
import DeviceInfo from '@/pages/device/location/info';
import Content from '@/pages/device/location/save/content';
import mark_b from './img/mark_b.png';
import mark_r from './img/mark_r.png';
import ManageRegion from '@/pages/device/location/region';
import Status from '@/pages/device/location/info/Status';
import encodeQueryParam from '@/utils/encodeParam';
import moment from 'moment';
import AutoHide from '@/pages/device/location/info/autoHide';
import {getWebsocket} from '@/layouts/GlobalWebSocket';

interface Props extends FormComponentProps {
  deviceGateway: any;
  loading: boolean;
}

interface State {
  pathPolygon: any[];
  markersDataList: any[];
  regionList: any[];
  productList: any[];
  mapCreated: any;
  infoWindow: any;
  massMarksCreated: any;
  centerScale: any;
  regionInfo: any;
  satelliteLayer: any;
  roadNetLayer: any;
  deviceData: any;
  contentInfo: any[];
  alarmLogData: any;
  searchParam: any;
  labelMarkerList: any[];
}

const Location: React.FC<Props> = props => {
    const initState: State = {
      pathPolygon: [],
      markersDataList: [],
      regionList: [],
      productList: [],
      mapCreated: {},
      infoWindow: {},
      massMarksCreated: {},
      centerScale: {
        center: []
      },
      regionInfo: {},
      satelliteLayer: {},
      roadNetLayer: {},
      deviceData: {},
      contentInfo: ['bg', 'road', 'point', 'building'],
      alarmLogData: {},
      searchParam: {pageSize: 10, sorts: {field: 'alarmTime', order: 'desc'}},
      labelMarkerList: [],
    };

    const {
      form: {getFieldDecorator},
      form,
    } = props;

    const [pathPolygon, setPathPolygon] = useState(initState.pathPolygon);
    const [markersDataList, setMarkersDataList] = useState(initState.markersDataList);
    const [regionList, setRegionList] = useState(initState.regionList);
    const [productList, setProductList] = useState(initState.productList);
    const [mapCreated, setMapCreated] = useState(initState.mapCreated);
    const [infoWindow, setInfoWindow] = useState(initState.infoWindow);
    const [massMarksCreated] = useState(initState.massMarksCreated);
    const [queryInfo, setQueryInfo] = useState(false);
    const [deviceId, setDeviceId] = useState('');
    const [centerScale, setCenterScale] = useState(initState.centerScale);
    const [satelliteLayer, setSatelliteLayer] = useState(initState.satelliteLayer);
    const [roadNetLayer, setRoadNetLayer] = useState(initState.roadNetLayer);
    const [panelData, setPanelData] = useState(true);
    const [spinning, setSpinning] = useState(true);
    const [contentMap, setContentMap] = useState(false);
    const [manageRegion, setManageRegion] = useState(false);
    const [deviceData, setDeviceData] = useState(initState.deviceData);
    const [contentInfo, setContentInfo] = useState(initState.contentInfo);
    const [alarmLogData, setAlarmLogData] = useState(initState.alarmLogData);
    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [deviceStatus, setDeviceStatus] = useState<any>();
    const [deviceArray, setDeviceArray] = useState<any>();
    const [labelsLayer, setLabelsLayer] = useState<any>();
    const [labelMarkerList] = useState(initState.labelMarkerList);

    const pageSize = 1000;

    useEffect(() => {

      apis.deviceProdcut
        .queryNoPagin()
        .then(response => {
          if (response.status === 200) {
            setProductList(response.result);
          }
        })
        .catch(() => {
        });

      handleSearch({pageSize: 10, sorts: {field: 'alarmTime', order: 'desc'}});

      deviceStatus && deviceStatus.unsubscribe();

      let deviceStatusAll = getWebsocket(
        `location-info-status-all`,
        `/dashboard/device/status/change/realTime`,
        {
          deviceId: '*',
        },
      ).subscribe(
        (resp: any) => {
          const {payload} = resp;
          if (massMarksCreated[payload.value.deviceId]) {
            massMarksCreated[payload.value.deviceId].setIcon({
              type: 'image',
              image: payload.value.type === 'online' ? mark_b : mark_r,
              size: [32, 34],
              anchor: 'bottom-center',
            });
          }
        },
      );
      setDeviceStatus(deviceStatusAll);

      return () => {
        deviceStatus && deviceStatus.unsubscribe();
        deviceArray && deviceArray.unsubscribe();
      };
    }, []);

    const handleSearch = (params?: any) => {
      setSearchParam(params);
      apis.deviceAlarm.findAlarmLog(encodeQueryParam(params))
        .then((response: any) => {
          if (response.status === 200) {
            setAlarmLogData(response.result);
          }
        })
        .catch(() => {
        });
    };

    const onValidateForm = async () => {
      form.validateFields((err, fileValue) => {
        if (err) return;

        if (!searchParam.terms) {
          searchParam.terms = {};
        }

        let where = ['objectType = device'];
        if (fileValue.productId) {
          where.push('tags.productId=' + fileValue.productId);
          searchParam.terms.productId = fileValue.productId;
        }
        if (fileValue.device.key === 'deviceId' && fileValue.device.value) {
          where.push('objectId=' + fileValue.device.value);
          searchParam.terms.deviceId = fileValue.device.value;
        } else if (fileValue.device.key === 'deviceName' && fileValue.device.value) {
          where.push('tags.deviceName=' + fileValue.device.value);
          searchParam.terms.deviceName = fileValue.device.value;
        }

        mapCreated.remove(infoWindow);

        handleSearch(searchParam);

        newMassMarks(mapCreated, {
          'shape': {
            'objectId': fileValue.region,
          },
          'filter': {
            'where': where.join(' and '),
            pageSize: pageSize
          },
        }, 'old');
      });
    };

    const _delete = (record: any) => {
      apis.location._delete(record.deviceInfo.id)
        .then(response => {
            if (response.status === 200) {
              message.success('删除成功');
              setTimeout(function () {
                newMassMarks(mapCreated, {
                  filter: {
                    where: 'objectType = device',
                    pageSize: pageSize
                  },
                }, 'new')
              }, 1000);
            }
          },
        ).catch(() => {
      });
    };

    const columns: ColumnProps<DeviceInstance>[] = [
      {
        title: 'ID',
        dataIndex: 'deviceInfo.objectId',
      },
      {
        title: '名称',
        dataIndex: 'deviceInfo.deviceName',
      },
      {
        title: '操作',
        align: 'center',
        width: '100px',
        render: (text, record: any) => (
          <Fragment>
            <a onClick={() => {
              setQueryInfo(true);
              setDeviceId(record.deviceInfo.objectId);
            }}>
              详情
            </a>
            <Divider type="vertical"/>
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                mapCreated.remove(labelsLayer);
                labelsLayer.clear();
                setSpinning(true);
                delete massMarksCreated[record.deviceInfo.objectId];
                _delete(record);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const onTabsAlarmLog = () => {
      form.validateFields((err, fileValue) => {
        if (err) return;

        if (!searchParam.terms) {
          searchParam.terms = {};
        }
        if (fileValue.productId) {
          searchParam.terms.productId = fileValue.productId;
        }
        if (fileValue.device.key === 'deviceId' && fileValue.device.value) {
          searchParam.terms.deviceId = fileValue.device.value;
        } else if (fileValue.device.key === 'deviceName' && fileValue.device.value) {
          searchParam.terms.deviceName = fileValue.device.value;
        }
        handleSearch(searchParam);
      });
    };

    const onListChange = (page: number, pageSize: number) => {
      handleSearch({
        pageIndex: (page - 1),
        pageSize: pageSize,
        terms: searchParam.terms,
        sorts: searchParam.sorts,
      });
    };

    const newMassMarks = (ins: any, params: any, type: string) => {
      let markersDataList: any[] = [];
      let labelsData: any[] = [];
      let deviceIdList: any[] = [];

      apis.location._search_geo_json(params)
        .then(response => {
            if (response.status === 200) {
              response.result.features.map((item: any, index: number) => {
                if (item.geometry.type === 'Point') {
                  if (type === 'old') {
                    setCenterScale({center: item.geometry.coordinates});
                  }
                  markersDataList.push({
                    lnglat: item.geometry.coordinates,
                    deviceInfo: item.properties,
                  });
                  deviceIdList.push(item.properties.objectId);
                  labelsData.push({
                    name: item.properties.objectId,
                    position: item.geometry.coordinates,
                    zooms: [3, 20],
                    opacity: 1,
                    rank: index,
                    icon: {
                      type: 'image',
                      image: mark_b,
                      size: [32, 34],
                      anchor: 'bottom-center',
                    },
                    text: {
                      content: item.properties.deviceName,
                      direction: 'top',
                      offset: [0, -2],
                      deviceInfo: item.properties,
                      lnglat: item.geometry.coordinates,
                      style: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        fillColor: '#FFFFFF',
                        padding: '6 10 6 10',
                        backgroundColor: '#5C5C5C',
                      },
                    },
                  });
                }
              });
              setMarkersDataList(markersDataList);

              let layer = new window.AMap.LabelsLayer({
                zooms: [3, 20],
                visible: true,
                collision: false,
              });

              layer.remove(labelMarkerList);
              setLabelsLayer(layer);
              ins.add(layer);

              labelMarkerList.splice(0, labelMarkerList.length);
              let labelMarker = {};
              labelsData.map((item: any) => {
                labelMarker = new window.AMap.LabelMarker(item);
                labelMarker.on('click', function (e: any) {
                  openInfo(ins, e.data.opts.text);
                });

                labelMarkerList.push(labelMarker);
                massMarksCreated[item.name] = labelMarker;
                layer.add(labelMarker);
              });

              deviceWebSocket(deviceIdList);
            }
          },
        )
        .catch(() => {
        });
    };

    const deviceWebSocket = (deviceIdList: any[]) => {
      deviceArray && deviceArray.unsubscribe();
      let deviceArrayById = getWebsocket(
        `location-info-status-by-array-deviceId`,
        `/device-current-state`,
        {
          deviceId: deviceIdList,
        },
      ).subscribe(
        (resp: any) => {
          const {payload} = resp;

          for (let key in payload) {
            massMarksCreated[key].setIcon({
              type: 'image',
              image: payload[key] === 'online' ? mark_b : mark_r,
              size: [32, 34],
              anchor: 'bottom-center',
            });
          }
        },
      );
      setDeviceArray(deviceArrayById);
      setSpinning(false);
    };

    window.seeDetails = function (deviceId: string) {
      setQueryInfo(true);
      setDeviceId(deviceId);
    };

    //在指定位置打开信息窗体
    const openInfo = (ins: any, data: any) => {
      apis.deviceInstance.info(data.deviceInfo.objectId)
        .then((response: any) => {
          if (response.status === 200) {
            const deviceData = response.result;
            setDeviceData(deviceData);

            let infoWindow = new window.AMap.InfoWindow({
              offset: new window.AMap.Pixel(0, -30),  //信息窗体显示位置偏移量
              content: '',  //使用默认信息窗体框样式，显示信息内容
              retainWhenClose: true, //信息窗体关闭时，是否将其Dom元素从页面中移除
              closeWhenClickMap: true,  // 点击地图是否关闭窗体
            });

            setInfoWindow(infoWindow);

            let deviceStatusInfo = document.getElementById('deviceStatus');
            infoWindow.on('open', function () {
              let div = document.createElement('div');
              div.style.width = '400px';
              div.append(deviceStatusInfo);
              infoWindow.setContent(div);
            });

            infoWindow.open(ins, data.lnglat);

            infoWindow.on('close', function () {

            });
          }
        })
        .catch(() => {
        });
    };

    const queryAreaNew = (params: any) => {
      regionList.splice(0, regionList.length);
      apis.location._search_geo_json(params)
        .then((response: any) => {
            if (response.status === 200) {
              let region: any = [];
              let parentId: string = "";
              response.result.features.map((item: any, index: number) => {
                if (index === 0) {
                  //地图默认显示区域下拉列表中的第一个区域以及子区域
                  parentId = item.properties.id;//第一个区域ID
                  item.geometry.coordinates.map((path: any) => {
                    pathPolygon.push(path[0]);
                  });

                  if (item.properties.center) {
                    setCenterScale({center: item.properties.center});
                  } else {
                    // 区域不存在中心点时将取区域线条的第一个坐标点为中心点
                    setCenterScale({center: item.geometry.coordinates[0][0][0]});
                  }
                }

                if (String(item.properties.parentId) === String(parentId)) {
                  //获取第一个区域下的所有子区域
                  item.geometry.coordinates.map((path: any) => {
                    pathPolygon.push(path[0]);
                  });
                }
                region.push({
                  id: item.properties.id,
                  pId: item.properties.parentId,
                  value: item.properties.id,
                  title: item.properties.name,
                  data: item
                });
              });
              setPathPolygon([...pathPolygon]);
              setRegionList(region);
            }
            setSpinning(false);
          },
        )
        .catch(() => {
        });
    };

    const resetPathPolygon = () => {
      pathPolygon.splice(0, pathPolygon.length);
    };

    // map事件列表
    const mapEvents = {
      created: (ins: any) => {
        setMapCreated(ins);
        newMassMarks(ins, {
          filter: {
            'where': 'objectType = device',
            pageSize: pageSize
          }
        }, 'new');
        resetPathPolygon();
        queryAreaNew({
          'filter': {
            'where': 'objectType not device',
            pageSize: pageSize
          },
        });
      },
    };

    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Button icon="plus" type="default" onClick={() => {
            setManageRegion(true);
          }}>
            管理区域
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button icon="tool" onClick={() => {
            setContentMap(true);
          }}>地图要素</Button>
        </Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="地理位置">
        <Spin tip="加载中..." spinning={spinning}>
          <div style={{width: '100%', height: '79vh'}}>
            <Map version="1.4.15" resizeEnable events={mapEvents}
                 center={centerScale.center.length === 0 ? false : centerScale.center} features={contentInfo}>
              {pathPolygon.length > 0 && (
                <Polygon
                  visible={true} path={pathPolygon} bubble key='polygon_list'
                  style={{fillOpacity: 0, strokeOpacity: 1, strokeColor: '#C86A79', strokeWeight: 3}}/>
              )}
            </Map>
          </div>

          <div style={{
            width: '30%', height: '79vh', float: 'right',
            marginTop: '-79vh', paddingTop: 5, paddingRight: 5,
          }}>
            <div style={{textAlign: 'right'}}>
              <Card>
                {satelliteLayer.CLASS_NAME && (
                  <span>
                  路网：<Switch key="route_grid_switch" checkedChildren="开" unCheckedChildren="关" onChange={(value) => {
                    if (value) {
                      let roadNetLayer = new window.AMap.TileLayer.RoadNet();
                      setRoadNetLayer(roadNetLayer);
                      mapCreated.add(roadNetLayer);
                    } else {
                      mapCreated.remove(roadNetLayer);
                      setRoadNetLayer({});
                    }
                  }}/>
                    &nbsp;&nbsp;
                </span>
                )}
                卫星：<Switch key="satellite_switch" checkedChildren="开" unCheckedChildren="关" onChange={(value) => {
                if (value) {
                  let satelliteLayer = new window.AMap.TileLayer.Satellite();
                  setSatelliteLayer(satelliteLayer);
                  mapCreated.add(satelliteLayer);
                } else {
                  mapCreated.remove(satelliteLayer);
                  setSatelliteLayer({});
                }
              }}/>
                &nbsp;&nbsp;
                信息面板：<Switch key="panel_info_switch" checkedChildren="开" unCheckedChildren="关" defaultChecked
                             onChange={(value) => {
                               setPanelData(value);
                             }}/>
                &nbsp;&nbsp;
                <Dropdown overlay={menu}>
                  <Button icon="menu">
                    其他操作
                  </Button>
                </Dropdown>
              </Card>
            </div>
            {panelData && (
              <Card bordered={false} style={{
                height: '69vh', maxHeight: '70vh', overflowY: 'auto',
                overflowX: 'hidden', marginTop: 5,
              }}>
                <Form labelCol={{span: 5}} wrapperCol={{span: 19}} key="queryForm">
                  <Form.Item
                    key="region" style={{marginBottom: 14}}
                    label={
                      <span>
                        查看区域
                        <Tooltip title="地图默认显示区域下拉列表中的第一个区域以及子区域">
                          <Icon type="question-circle-o" style={{paddingLeft: 5}}/>
                        </Tooltip>
                      </span>
                    }>
                    {getFieldDecorator('region', {})(
                      <TreeSelect
                        dropdownStyle={{maxHeight: 400}}
                        allowClear treeDataSimpleMode showSearch
                        placeholder="所属区域" treeData={regionList}
                        treeNodeFilterProp='title' searchPlaceholder='选择查看区域，可输入查询'
                        onChange={(value: string, title: string, data: any) => {
                          resetPathPolygon();
                          mapCreated.remove(labelsLayer);

                          if (value) {
                            !data.triggerNode.props.data.properties.center ?
                              setCenterScale({center: []}) :
                              setCenterScale({center: data.triggerNode.props.data.properties.center});

                            data.triggerNode.props.data.geometry.coordinates.map((path: any) => {
                              pathPolygon.push(path[0]);
                            });

                            regionList.map((region: any) => {
                              if (String(value) === String(region.pId)) {
                                region.data.geometry.coordinates.map((path: any) => {
                                  pathPolygon.push(path[0]);
                                });
                              }
                            });
                            setPathPolygon([...pathPolygon]);
                          } else {
                            //默认取出区域下拉列表中的第一个区域以及下属区域
                            regionList[0].data.geometry.coordinates.map((path: any) => {
                              pathPolygon.push(path[0]);
                            });

                            regionList.map((region: any) => {
                              if (String(regionList[0].id) === String(region.pId)) {
                                region.data.geometry.coordinates.map((path: any) => {
                                  pathPolygon.push(path[0]);
                                });
                              }
                            });
                            setPathPolygon([...pathPolygon]);
                          }
                          newMassMarks(mapCreated, {
                            shape: {
                              'objectId': value,
                            },
                            filter: {
                              where: 'objectType = device',
                              pageSize: pageSize
                            },
                          }, 'new');

                          mapCreated.remove(infoWindow);
                        }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item key="product_id" label="产品名称" style={{marginBottom: 14}}>
                    {getFieldDecorator('productId', {
                      initialValue: undefined,
                    })(
                      <Select
                        placeholder="选择产品，可输入查询" showSearch={true} allowClear={true}
                        filterOption={(inputValue, option) =>
                          option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {(productList || []).map(item => (
                          <Select.Option value={item.id}>{item.name}</Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item key="device" label="设备信息" style={{marginBottom: 14}}>
                    <Input.Group compact>
                      {getFieldDecorator('device.key', {
                        initialValue: 'deviceId',
                      })(
                        <Select style={{width: 100}} id="device_key">
                          <Select.Option value="deviceId">设备ID</Select.Option>
                          <Select.Option value="deviceName">设备名称</Select.Option>
                        </Select>,
                      )}
                      {getFieldDecorator('device.value', {
                        initialValue: undefined,
                      })(
                        <Input id="value" style={{width: 'calc(100% - 100px)'}} placeholder="输入设备信息"/>,
                      )}
                    </Input.Group>
                  </Form.Item>
                  <div style={{textAlign: 'right'}}>
                    <Button type="primary" ghost={false} onClick={() => {
                      setSpinning(true);
                      mapCreated.remove(labelsLayer);
                      onValidateForm().then(() => {
                      });
                    }}>
                      查询
                    </Button>
                    <Button style={{marginLeft: 8}} onClick={() => {
                      mapCreated.remove(labelsLayer);
                      setSpinning(true);
                      form.resetFields();
                      resetPathPolygon();

                      //默认取出区域下拉列表中的第一个区域以及下属区域
                      regionList[0].data.geometry.coordinates.map((path: any) => {
                        pathPolygon.push(path[0]);
                      });

                      regionList.map((region: any) => {
                        if (String(regionList[0].id) === String(region.pId)) {
                          region.data.geometry.coordinates.map((path: any) => {
                            pathPolygon.push(path[0]);
                          });
                        }
                      });
                      setPathPolygon([...pathPolygon]);
                      // 结束
                      handleSearch({pageSize: 10, sorts: {field: 'alarmTime', order: 'desc'}});
                      mapCreated.remove(infoWindow);
                    }}>
                      重置
                    </Button>
                  </div>
                </Form>
                <Tabs defaultActiveKey="basic" onChange={(key: string) => {
                  if (key === 'deviceAlarm') {
                    setAlarmLogData({});
                    onTabsAlarmLog();
                  }
                }}>
                  <Tabs.TabPane tab="设备列表" key="device_list">
                    <div style={{paddingBottom: 15}}>
                      <span style={{fontSize: 14}}>
                        <b>设备记录&nbsp;
                          <span style={{fontSize: 20}}>{markersDataList.length}</span>
                          &nbsp;条
                        </b>
                      </span>
                    </div>
                    <div>
                      <Table
                        loading={props.loading}
                        columns={columns}
                        bordered={false}
                        size='middle'
                        dataSource={(markersDataList || {})}
                        onRow={record => {
                          return {
                            onDoubleClick: () => {
                              setCenterScale({center: record.lnglat});
                              openInfo(mapCreated, record);
                            },
                          };
                        }}
                        pagination={{
                          pageSize: 10,
                          size: 'small',
                          hideOnSinglePage: true,
                        }}
                      />
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab='设备告警' key="device_alarm">
                    <div style={{paddingBottom: 15}}>
                      <span style={{fontSize: 14}}>
                        <b>告警记录&nbsp;
                          <span style={{fontSize: 20}}>{alarmLogData.total ? alarmLogData.total : 0}</span>
                          &nbsp;条
                        </b>
                      </span>
                    </div>
                    <div>
                      {alarmLogData.data && (
                        <List
                          size='small'
                          itemLayout="horizontal" dataSource={alarmLogData.data}
                          header={<span>设备ID/设备名称/告警名称/告警时间</span>}
                          pagination={{
                            current: alarmLogData.pageIndex + 1,
                            total: alarmLogData.total,
                            pageSize: alarmLogData.pageSize,
                            size: 'small',
                            hideOnSinglePage: true,
                            onChange: onListChange,
                          }}
                          renderItem={(dev: any) => (
                            <List.Item>
                              <List.Item.Meta
                                title={<a
                                  onClick={() => {
                                    let content: string;
                                    try {
                                      content = JSON.stringify(dev.alarmData, null, 2);
                                    } catch (error) {
                                      content = dev.alarmData;
                                    }
                                    Modal.confirm({
                                      width: '30VW',
                                      title: '告警数据',
                                      content: <pre>{content}</pre>,
                                      okText: '确定',
                                      cancelText: '关闭',
                                    });
                                  }}
                                ><AutoHide
                                  title={`${dev.deviceId}/${dev.deviceName}/${dev.alarmName}/${moment(dev.alarmTime).format('YYYY-MM-DD HH:mm:ss')}`}
                                  style={{width: 415}}/></a>}
                              />
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            )}
          </div>
          {queryInfo && deviceId !== '' && (
            <DeviceInfo deviceId={deviceId} close={() => {
              setQueryInfo(false);
              setDeviceId('');
              setSpinning(true);
              mapCreated.remove(labelsLayer);
              onValidateForm().then(() => {
              });
            }}/>
          )}

          {contentMap && (
            <Content data={contentInfo} save={(data: any[]) => {
              setContentInfo(data);
              setContentMap(false);
            }} close={() => {
              setContentMap(false);
            }}/>
          )}

          {manageRegion && (
            <ManageRegion close={() => {
              setManageRegion(false);
              setSpinning(true);
              mapCreated.remove(labelsLayer);
              resetPathPolygon();
              queryAreaNew({
                filter: {
                  where: 'objectType not device',
                  pageSize: pageSize
                },
              });
              onValidateForm().then(() => {
              });
              handleSearch({pageSize: 10, sorts: {field: 'alarmTime', order: 'desc'}});
            }}/>
          )}

          {<div hidden={true}>
            <Status device={deviceData}/>
          </div>}
        </Spin>
      </PageHeaderWrapper>
    );
  }
;

export default Form.create<Props>()(Location);

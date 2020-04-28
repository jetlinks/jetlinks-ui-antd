import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Fragment, useEffect, useState } from 'react';
import { AutoComplete, Button, Card, Divider, Form, Input, Select, Switch, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Map, Polygon } from 'react-amap';
import { ColumnProps } from 'antd/lib/table';
import { DeviceInstance } from '@/pages/device/instance/data';
import apis from '@/services';
import DeviceInfo from '@/pages/device/location/info/index';

interface Props extends FormComponentProps {
  deviceGateway: any;
  loading: boolean;
}

interface State {
  pathPolygon: any[];
  markersList: any[];
  regionList: any[];
  productList: any[];
  mapCreated: any;
  massMarksCreated: any;
  centerScale: any;
  regionInfo: any;
  satelliteLayer: any;
  roadNetLayer: any;
}

const Location: React.FC<Props> = props => {
    const initState: State = {
      pathPolygon: [],
      markersList: [],
      regionList: [],
      productList: [],
      mapCreated: {},
      massMarksCreated: {},
      centerScale: {
        center: [106.57, 29.52],
      },
      regionInfo: {},
      satelliteLayer: {},
      roadNetLayer: {},
    };

    const {
      form: { getFieldDecorator },
      form,
    } = props;

    const [pathPolygon, setPathPolygon] = useState(initState.pathPolygon);
    const [markersList, setMarkersList] = useState(initState.markersList);
    const [regionList] = useState(initState.regionList);
    const [productList] = useState(initState.productList);
    const [mapCreated, setMapCreated] = useState(initState.mapCreated);
    const [massMarksCreated, setMassMarksCreated] = useState(initState.massMarksCreated);
    const [queryInfo, setQueryInfo] = useState(false);
    const [deviceId, setDeviceId] = useState('');
    const [centerScale, setCenterScale] = useState(initState.centerScale);
    const [satelliteLayer, setSatelliteLayer] = useState(initState.satelliteLayer);
    const [roadNetLayer, setRoadNetLayer] = useState(initState.roadNetLayer);
    const [panelData, setPanelData] = useState(true);

    useEffect(() => {
      apis.deviceProdcut
        .queryNoPagin()
        .then(response => {
          if (response.status === 200) {
            response.result.map((item: any) => {
              productList.push({
                text: item.name,
                value: item.id,
              });
            });
          }
        })
        .catch(() => {
        });
    }, []);

    const onValidateForm = async () => {
      form.validateFields((err, fileValue) => {
        if (err) return;

        let where = ['objectType = device'];
        if (fileValue.productId) {
          where.push('tags.productId=' + fileValue.productId);
        }
        if (fileValue.device.key === 'deviceId' && fileValue.device.value) {
          where.push('objectId=' + fileValue.device.value);
        } else if (fileValue.device.key === 'deviceName' && fileValue.device.value) {
          where.push('tags.deviceName=' + fileValue.device.value);
        }

        newMassMarks(mapCreated, {
          'filter': {
            'where': where.join(' and '),
          },
        }, 'old');
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
        width: '80px',
        render: (record: any) => (
          <Fragment>
            <a onClick={() => {
              setQueryInfo(true);
              setDeviceId(record.deviceInfo.objectId);
            }}>
              详情
            </a>
          </Fragment>
        ),
      },
    ];

    const newMassMarks = (ins: any, params: any, type: string) => {
      let markerList: any[] = [];
      apis.location._search_geo_json(params)
        .then(response => {
            if (response.status === 200) {
              response.result.features.map((item: any) => {
                if (item.geometry.type === 'Point') {
                  if (type === 'old') {
                    setCenterScale({ center: item.geometry.coordinates });
                  }
                  markerList.push({
                    lnglat: item.geometry.coordinates,
                    deviceInfo: item.properties,
                  });
                }
              });

              setMarkersList(markerList);

              if (ins.getAllOverlays('marker').length <= 0) {
                var style = [{
                  url: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                  anchor: new window.AMap.Pixel(10, 30),
                  size: new window.AMap.Size(19, 31),
                }];

                let mass = new window.AMap.MassMarks(markerList, {
                  opacity: 0.8,
                  zIndex: 111,
                  cursor: 'pointer',
                  style: style,
                  alwaysRender: false,
                  useCluster: true,
                });
                /*var marker = new window.AMap.Marker({ content: ' ', map: ins, useCluster: true });*/

                mass.on('click', function(e: any) {
                  openInfo(ins, e.data);
                });
                mass.setMap(ins);
                setMassMarksCreated(mass);
              } else {
                massMarksCreated.setData(markerList);
              }
            }
          },
        )
        .catch(() => {
        });
    };

    window.seeDetails = function(deviceId: string) {
      setQueryInfo(true);
      setDeviceId(deviceId);
    };

    //在指定位置打开信息窗体
    const openInfo = (ins: any, data: any) => {
      //构建信息窗体中显示的内容
      apis.deviceInstance.refreshState(data.deviceInfo.objectId)
        .then(response => {
          if (response.status === 200) {

            let html = `<div style="width: 300px">
              <div style="padding:7px 0px 0px 0px;">
                <div style="text-align: center;">
                  <h3>
                    <b>设备信息</b>
                  </h3>
                </div>
                <p class="input-item">&nbsp;I&nbsp;&nbsp;D&nbsp; ：&nbsp;${data.deviceInfo.objectId}</p>
                <p class="input-item">名称 ：&nbsp;${data.deviceInfo.deviceName}</p>
                <p class="input-item">产品 ：&nbsp;${data.deviceInfo.productName}</p>
                <p class="input-item">状态 ：&nbsp;${response.result.text}</p>
                <a onclick="window.seeDetails('${data.deviceInfo.objectId}')">查看详情</a>
              </div>
            </div>`;

            let infoWindow = new AMap.InfoWindow({
              content: html,  //使用默认信息窗体框样式，显示信息内容
              retainWhenClose: true, //信息窗体关闭时，是否将其Dom元素从页面中移除
              closeWhenClickMap: true,  // 点击地图是否关闭窗体
            });
            infoWindow.open(ins, data.lnglat);
          }
        }).catch(() => {
      });
    };

    const queryArea = (params: any, type: string) => {
      pathPolygon.splice(0, pathPolygon.length);
      apis.location._search_geo_json(params)
        .then(response => {
            if (response.status === 200) {
              response.result.features.map((item: any) => {
                if (type === 'new') {
                  regionList.push({
                    value: item.properties.id,
                    text: item.properties.name,
                    data: item,
                  });
                }
                item.geometry.coordinates.map((path: any) => {
                  pathPolygon.push(path[0]);
                  setPathPolygon([...pathPolygon]);
                });
              });
            }
          },
        )
        .catch(() => {
        });
    };

    // map事件列表
    const mapEvents = {
      created: (ins: any) => {
        setMapCreated(ins);
        newMassMarks(ins, {
          'filter': {
            'where': 'objectType = device',
          },
        }, 'new');
        queryArea({
          'filter': {
            'where': 'objectType not device',
          },
        }, 'new');
      },
    };

    return (
      <PageHeaderWrapper title="位置查询">
        <div style={{ width: '100%', height: '79vh' }}>
          <Map resizeEnable events={mapEvents} center={centerScale.center} rotateEnable={true}>
            {pathPolygon.length > 0 && (
              <Polygon visible={true} path={pathPolygon}
                       style={{ fillOpacity: 0, strokeOpacity: 1, strokeColor: '#C86A79', strokeWeight: 3 }}/>
            )}
          </Map>
        </div>

        <div style={{
          width: '30%', height: '79vh', float: 'right',
          marginTop: '-79vh', paddingTop: 5, paddingRight: 5,
        }}>
          <div style={{ textAlign: 'right' }}>
            <Card>
              {satelliteLayer.CLASS_NAME && (
                <span>
                  路网：<Switch checkedChildren="开" unCheckedChildren="关" onChange={(value) => {
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
              卫星：<Switch checkedChildren="开" unCheckedChildren="关" onChange={(value) => {
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
              信息面板：<Switch checkedChildren="开" unCheckedChildren="关" defaultChecked
                           onChange={(value) => {
                             setPanelData(value);
                           }}/>
            </Card>
          </div>
          {panelData && (
            <Card bordered={false} style={{
              height: '70vh', maxHeight: '71vh', overflowY: 'auto',
              overflowX: 'hidden', marginTop: 5,
            }}>
              <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} key="form">
                <Form.Item key="region" label="查看区域" style={{ marginBottom: 14 }}>
                  <Select placeholder="选择查看区域，可输入查询" showSearch={true} allowClear={true}
                          filterOption={(inputValue, option) =>
                            option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={(valie: string, data: any) => {
                            if (valie) {
                              setCenterScale({ center: data.props.data.data.properties.center });
                            }
                            queryArea({
                              'shape': {
                                'objectId': valie,
                              },
                              'filter': {
                                'where': 'objectType not device',
                              },
                            }, 'old');
                          }}
                  >
                    {(regionList || []).map(item => (
                      <Select.Option value={item.value} data={item}>{item.text}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item key="productId" label="产品名称" style={{ marginBottom: 14 }}>
                  {getFieldDecorator('productId', {
                    initialValue: undefined,
                  })(
                    <AutoComplete dataSource={productList} placeholder="选择产品，可输入查询"
                                  filterOption={(inputValue, option) =>
                                    option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                                  }
                    />,
                  )}
                </Form.Item>
                <Form.Item key="device" label="设备信息" style={{ marginBottom: 14 }}>
                  <Input.Group compact>
                    {getFieldDecorator('device.key', {
                      initialValue: 'deviceId',
                    })(
                      <Select style={{ width: 100 }} id="key">
                        <Select.Option value="deviceId">设备ID</Select.Option>
                        <Select.Option value="deviceName">设备名称</Select.Option>
                      </Select>,
                    )}
                    {getFieldDecorator('device.value', {
                      initialValue: undefined,
                    })(
                      <Input id="value" style={{ width: 'calc(100% - 100px)' }} placeholder="输入设备信息"/>,
                    )}
                  </Input.Group>
                </Form.Item>
                <div style={{ textAlign: 'right' }}>
                  <Button type="primary" ghost={false} onClick={() => onValidateForm()}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => {
                    form.resetFields();
                    newMassMarks(mapCreated, {}, 'new');
                  }}>
                    重置
                  </Button>
                </div>
              </Form>
              <Divider style={{ margin: '20px 0' }}/>
              <div style={{ paddingBottom: 15, marginTop: -8 }}>
                <span style={{ fontSize: 14 }}>
                  <b>位置记录
                    <span style={{ fontSize: 20 }}>{markersList.length}</span>
                    条
                  </b>
                </span>
              </div>
              <div>
                <Table
                  loading={props.loading}
                  columns={columns}
                  bordered={false}
                  size='middle'
                  dataSource={(markersList || {})}
                  rowKey="deviceInfo.objectId"
                  key="deviceInfo.objectId"
                  onRow={record => {
                    return {
                      onDoubleClick: () => {
                        setCenterScale({ center: record.lnglat });
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
            </Card>
          )}
        </div>
        {queryInfo && deviceId !== '' && (
          <DeviceInfo deviceId={deviceId} close={() => {
            setQueryInfo(false);
            setDeviceId('');
          }}/>
        )}
      </PageHeaderWrapper>
    );
  }
;

export default Form.create<Props>()(Location);

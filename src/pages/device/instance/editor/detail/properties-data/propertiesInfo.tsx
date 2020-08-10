import React, {useEffect, useState} from 'react';
import {Button, Card, Col, DatePicker, Form, Icon, Modal, Row, Spin, Table, Tabs, Tooltip as AntdTooltip} from 'antd';
import {ColumnProps, PaginationConfig} from 'antd/lib/table';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import moment, {Moment} from 'moment';
import {FormComponentProps} from "antd/es/form";
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import {Map} from "react-amap";
import img26 from './img/img-26.png';
import mark_b from "@/pages/device/location/img/mark_b.png";

interface Props extends FormComponentProps {
  close: Function;
  item: any;
  deviceId: string;
}

interface State {
  eventColumns: ColumnProps<any>[];
  propertiesInfo: any;
  gatewayDataList: any[];
  ticksDataList: any[];
  mapCenter: any[];
  lineArr: any[];
  labelMarkerList: any[];
  labelsDataList: any[];
  marksCreated: any;
  markerPosition: any[];
  mapCreated: any;
}

const PropertiesInfo: React.FC<Props> = props => {

  const {
    form: {getFieldDecorator},
    form,
  } = props;
  const initState: State = {
    eventColumns: [
      {
        title: '时间',
        dataIndex: 'timestamp',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: props.item.name,
        dataIndex: 'formatValue',
        ellipsis: true,
      },
    ],
    propertiesInfo: {},
    marksCreated: {},
    gatewayDataList: [],
    ticksDataList: [],
    lineArr: [],
    labelMarkerList: [],
    labelsDataList: [],
    mapCenter: [106.57, 29.52],
    markerPosition: [],
    mapCreated: {},
  };


  const [marksCreated, setMarksCreated] = useState(initState.marksCreated);
  const [mapCenter, setMapCenter] = useState(initState.mapCenter);
  const [propertiesInfo, setPropertiesInfo] = useState(initState.propertiesInfo);
  const [gatewayData, setGatewayData] = useState(initState.gatewayDataList);
  const [ticksDataList, setTicksDataList] = useState(initState.ticksDataList);
  const [lineArr, setLineArr] = useState(initState.lineArr);
  const [spinning, setSpinning] = useState(true);
  const [statistics, setStatistics] = useState(false);
  const [mapCreated, setMapCreated] = useState(initState.mapCreated);
  const [labelMarkerList] = useState(initState.labelMarkerList);
  const [labelsDataList, setLabelsDataList] = useState(initState.labelMarkerList);
  const [markerPosition, setMarkerPosition] = useState(initState.markerPosition);
  const [labelsLayer, setLabelsLayer] = useState<any>();

  const handleSearch = (params?: any) => {
    apis.deviceInstance.propertieInfo(props.deviceId, encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          setPropertiesInfo(response.result);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  const statisticsChart = () => {
    apis.deviceInstance.propertieInfo(props.deviceId, encodeQueryParam({
      pageIndex: 0,
      pageSize: 30,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {property: props.item.id},
    }))
      .then((response: any) => {
        if (response.status === 200) {
          const dataList: any[] = [];
          const ticksList: any[] = [];
          response.result.data.forEach((item: any, index: number) => {
            dataList.push({
              year: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
              value: Number(item.value),
              type: props.item.name
            });
            if (index % 3 === 0 && index !== 0) {
              ticksList.push(item.timestamp);
            }
          });
          setTicksDataList(ticksList);
          setGatewayData(dataList);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  const trajectory = () => {
    apis.deviceInstance.propertieInfo(props.deviceId, encodeQueryParam({
      pageIndex: 0,
      pageSize: 1000,
      sorts: {
        field: 'timestamp',
        order: 'asc',
      },
      terms: {property: props.item.id},
    }))
      .then((response: any) => {
        if (response.status === 200) {
          let list: any[] = [];
          let labelsData: any[] = [];
          response.result.data.map((item: any, index: number) => {
            if (index === 0) {
              setMapCenter([item.geoValue.lon, item.geoValue.lat]);
              setMarkerPosition([item.geoValue.lon, item.geoValue.lat]);
            }
            list.push([item.geoValue.lon, item.geoValue.lat]);
            labelsData.push({
              name: item.timestamp, // 时间
              position: [item.geoValue.lon, item.geoValue.lat], //经纬度
              zooms: [3, 20],
              opacity: 1,
              rank: index, //index
              icon: {
                type: 'image',
                image: mark_b,
                size: [19, 22],
                anchor: 'bottom-center',
              },
              text: {
                content: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'), //时间
                direction: 'top',
                offset: [0, -2],
                lnglat: [item.geoValue.lon, item.geoValue.lat], //经纬度
                style: {
                  fontSize: 12,
                  fontWeight: 'normal',
                  fillColor: '#FFFFFF',
                  padding: '6 10 6 10',
                  backgroundColor: '#5C5C5C',
                },
              },
            });

          });
          setLineArr(list);
          setLabelsDataList(labelsData);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    if (props.item.valueType.type === 'int' || props.item.valueType.type === 'float'
      || props.item.valueType.type === 'double' || props.item.valueType.type === 'long') {
      setStatistics(true);
    }
    handleSearch({
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {property: props.item.id},
    });

    if (props.item.valueType.type === 'geoPoint') {
      trajectory();
    }
  }, []);

  const onTableChange = (pagination: PaginationConfig) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {property: props.item.id},
    });
  };

  const onSearch = () => {
    const params = form.getFieldsValue();
    if (params.timestamp$BTW) {
      const formatDate = params.timestamp$BTW.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      params.timestamp$BTW = formatDate.join(',');
    }
    handleSearch({
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {...params, property: props.item.id},
    });
  };

  // map事件列表
  const mapEvents = {
    created: (ins: any) => {
      setMapCreated(ins);

      let marker = new window.AMap.Marker({
        map: ins,
        position: markerPosition,
        icon: img26,
        offset: new window.AMap.Pixel(-13, -13),
        autoRotation: true,
        angle: -90,
      });
      setMarksCreated(marker);

      // 绘制轨迹
      new window.AMap.Polyline({
        map: ins,
        path: lineArr,
        showDir: true,
        strokeColor: "#f5222d",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });

      var passedPolyline = new window.AMap.Polyline({
        map: ins,
        // path: lineArr,
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      marker.on('moving', function (e: any) {
        passedPolyline.setPath(e.passedPath);
      });

      // 创建轨迹上的点位
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
      labelsDataList.map((item: any) => {
        labelMarker = new window.AMap.LabelMarker(item);

        labelMarkerList.push(labelMarker);
        layer.add(labelMarker);
      });
    },
  };

  return (
    <Modal
      title="属性详情"
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
      width="70%"
    >
      <Spin spinning={spinning}>
        <Tabs defaultActiveKey="1" tabPosition="top" type="card"
              onTabClick={(value: string) => {
                if (value === "1") {
                  mapCreated.remove(labelsLayer);
                  labelsLayer.clear();

                  setSpinning(true);
                  handleSearch({
                    pageIndex: 0,
                    pageSize: 10,
                    sorts: {
                      field: 'timestamp',
                      order: 'desc',
                    },
                    terms: {property: props.item.id},
                  });
                } else if (value === '2') {
                  statisticsChart();
                }
              }}
        >
          <Tabs.TabPane tab="列表" key="1">
            <Form labelCol={{span: 0}} wrapperCol={{span: 18}} style={{paddingBottom: -20}}>
              <Row gutter={{md: 8, lg: 4, xl: 48}}>
                <Col md={10} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('timestamp$BTW')(
                      <DatePicker.RangePicker
                        showTime={{format: 'HH:mm:ss'}}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={['开始时间', '结束时间']}
                        onChange={(value: any[]) => {
                          if (value.length === 0) {
                            handleSearch({
                              pageIndex: 0,
                              pageSize: 10,
                              sorts: {
                                field: 'timestamp',
                                order: 'desc',
                              },
                              terms: {property: props.item.id},
                            });
                          }
                        }}
                        onOk={onSearch}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Table
              rowKey="timestamp"
              dataSource={propertiesInfo.data}
              size="small"
              onChange={onTableChange}
              pagination={{
                current: propertiesInfo.pageIndex + 1,
                total: propertiesInfo.total,
                pageSize: propertiesInfo.pageSize,
                simple: true
              }}
              columns={initState.eventColumns}
            />
          </Tabs.TabPane>

          {statistics && (
            <Tabs.TabPane tab="图表" key="2">
              <Chart
                height={400}
                data={gatewayData}
                scale={{
                  value: {min: 0},
                  year: {
                    range: [0, 1],
                    ticks: ticksDataList,
                  },
                }}
                forceFit
              >
                <Axis name="year" label={{
                  formatter: val => moment(val).format('YYYY-MM-DD')
                }}/>
                <Axis name="value" label={{
                  formatter: val => parseFloat(val).toLocaleString()
                }}/>
                <Legend/>
                <Tooltip crosshairs={{type: 'y'}}/>
                <Geom type="line" position="year*value" size={2} tooltip={[
                  "year*value*type",
                  (year, value, type) => ({
                    title: moment(year).format('HH:mm:ss'),
                    name: type,
                    value: value
                  })
                ]}/>
                <Geom type="area" position="year*value" shape={'circle'}
                      tooltip={[
                        "year*value*type",
                        (year, value, type) => ({
                          title: moment(year).format('HH:mm:ss'),
                          name: type,
                          value: value
                        })
                      ]}
                />
              </Chart>
            </Tabs.TabPane>
          )}

          {props.item.valueType.type === 'geoPoint' && (
            <Tabs.TabPane tab={
              <span>
                轨迹
                <AntdTooltip title='默认启动循环执行动画'>
                  <Icon type="question-circle-o" style={{paddingLeft: 10}}/>
                </AntdTooltip>
              </span>
            } key="3">
              <div style={{width: '100%', height: '60vh'}}>
                <Map version="1.4.15" resizeEnable events={mapEvents} center={mapCenter}/>
              </div>
              <div style={{marginTop: '-6.4%', paddingRight: 2, textAlign: 'right', float: 'right'}}>
                <Card style={{width: 240}}>
                  <Button type="primary"
                          onClick={() => {
                            marksCreated.moveAlong(
                              lineArr, // 路径坐标串
                              200, // 指定速度，单位：千米/小时，不可为0
                              function (k: any) { // 回调函数f为变化曲线函数，缺省为function(k){return k}
                                return k
                              },
                              true // true表明是否循环执行动画，默认为false
                            );
                          }}
                  >
                    开始动画
                  </Button>
                  <Button style={{marginLeft: 10}} type="primary"
                          onClick={() => {
                            marksCreated.stopMove();
                          }}
                  >
                    停止动画
                  </Button>
                </Card>
              </div>
            </Tabs.TabPane>
          )}
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(PropertiesInfo);

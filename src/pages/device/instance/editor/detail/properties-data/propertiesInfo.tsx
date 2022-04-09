import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Modal,
  Row,
  Spin,
  Table,
  Tabs,
  Tooltip as AntdTooltip,
  message
} from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import moment, { Moment } from 'moment';
import { FormComponentProps } from "antd/es/form";
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { Map } from "react-amap";
import img26 from './img/img-26.png';
import mark_b from "@/pages/device/location/img/mark_b.png";
import CopyToClipboard from 'react-copy-to-clipboard';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-hjson';
import 'ace-builds/src-noconflict/mode-jsoniq';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';

interface Props extends FormComponentProps {
  close: Function;
  item: any;
  deviceId: string;
}

interface State {
  eventColumns: ColumnProps<any>[];
  propertiesInfo: any;
  gatewayDataList: any[];
  mapCenter: any[];
  lineArr: any[];
  labelMarkerList: any[];
  labelsDataList: any[];
  marksCreated: any;
  markerPosition: any[];
  mapCreated: any;
  tabsType: string;
}

const PropertiesInfo: React.FC<Props> = props => {

  const {
    form: { getFieldDecorator },
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
        title: `${props.item.name}(点击可复制)`,
        dataIndex: 'formatValue',
        ellipsis: true,
        render: text => (
          <CopyToClipboard text={text} onCopy={() => message.success('已复制')}>
            <span>{typeof (text) === 'object' ? JSON.stringify(text) : text}<Icon type="copy" /></span>
          </CopyToClipboard>
        )
      },
      {
        title: '操作',
        dataIndex: 'value',
        render: (text) => (
          <>
            <a onClick={() => {
              Modal.info({
                title: '详情',
                width: 850,
                content: (
                  <Form.Item wrapperCol={{ span: 20 }} labelCol={{ span: 4 }} label={props.item.name}>
                    <AceEditor
                      value={JSON.stringify((text), null, 2)}
                      mode='json'
                      theme="eclipse"
                      name="app_code_editor"
                      key='deviceShadow'
                      fontSize={14}
                      showPrintMargin
                      showGutter
                      wrapEnabled
                      highlightActiveLine  //突出活动线
                      enableSnippets  //启用代码段
                      style={{ width: '100%', height: '50vh' }}
                      setOptions={{
                        enableBasicAutocompletion: true,   //启用基本自动完成功能
                        enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                        enableSnippets: true,  //启用代码段
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                    />
                  </Form.Item>
                ),
                okText: '关闭',
                onOk() {
                  console.log('OK');
                },
              });
            }}>详情</a>
          </>
        )
      }
    ],
    propertiesInfo: {},
    marksCreated: {},
    gatewayDataList: [],
    lineArr: [],
    labelMarkerList: [],
    labelsDataList: [],
    mapCenter: [106.57, 29.52],
    markerPosition: [],
    mapCreated: {},
    tabsType: '1',
  };


  const [marksCreated, setMarksCreated] = useState(initState.marksCreated);
  const [mapCenter, setMapCenter] = useState(initState.mapCenter);
  const [propertiesInfo, setPropertiesInfo] = useState<any>({});
  const [gatewayData, setGatewayData] = useState(initState.gatewayDataList);
  const [lineArr, setLineArr] = useState(initState.lineArr);
  const [spinning, setSpinning] = useState(true);
  const [statistics, setStatistics] = useState(false);
  const [mapCreated, setMapCreated] = useState(initState.mapCreated);
  const [labelMarkerList] = useState(initState.labelMarkerList);
  const [labelsDataList, setLabelsDataList] = useState(initState.labelMarkerList);
  const [markerPosition, setMarkerPosition] = useState(initState.markerPosition);
  const [tabsType, setTabsType] = useState(initState.tabsType);
  const [labelsLayer, setLabelsLayer] = useState<any>();
  const [drawPolyline, setDrawPolyline] = useState<any>();
  const [passedPolyline, setPassedPolyline] = useState<any>();

  const handleSearch = (params?: any) => {
    apis.deviceInstance.propertieInfo(props.deviceId, encodeQueryParam({
      terms: {
        ...params.terms,
        property: props.item.id
      },
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      pageIndex: params.pageIndex || 0,
      pageSize: params.pageSize || 10
    }))
      .then((response: any) => {
        if (response.status === 200) {
          setPropertiesInfo(response.result);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  const statisticsChart = (params?: any) => {
    apis.deviceInstance.propertieInfo(props.deviceId, encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          const dataList: any[] = [];
          response.result.data.forEach((item: any) => {
            dataList.push({
              year: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
              value: Number(item.value),
              type: props.item.name
            });
          });
          setGatewayData(dataList);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  const trajectory = (params?: any) => {
    apis.deviceInstance.propertieInfo(props.deviceId, encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          let list: any[] = [];
          let labelsData: any[] = [];
          let position: any[] = [];
          response.result.data?.map((item: any, index: number) => {
            if (index === 0) {
              setMapCenter([item.geoValue.lon, item.geoValue.lat]);
              setMarkerPosition([item.geoValue.lon, item.geoValue.lat]);
              position = [item.geoValue.lon, item.geoValue.lat];
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

          setLineArr([...list]);
          setLabelsDataList([...labelsData]);
          if (Object.keys(mapCreated).length != 0) {
            mapElement(mapCreated, position, list, labelsData);
          }
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
      terms: { property: props.item.id },
    });

    if (props.item.valueType.type === 'geoPoint') {
      trajectory({
        pageIndex: 0,
        pageSize: 1000,
        sorts: {
          field: 'timestamp',
          order: 'asc',
        },
        terms: { property: props.item.id },
      }
      );
    }
  }, []);

  const onTableChange = (pagination: PaginationConfig) => {
    const params = queryParams();
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: { ...params, property: props.item.id },
    });
  };

  const queryParams = () => {
    let params = form.getFieldsValue();
    if (params.timestamp$BTW) {
      let formatDate = params.timestamp$BTW.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      params.timestamp$BTW = formatDate.join(',');
    }
    return params;
  };

  const unSearch = () => {
    if (tabsType === '1') {
      if (Object.keys(mapCreated).length != 0) {
        mapCreated.remove(labelsLayer);
        labelsLayer.clear();
      }

      handleSearch({
        pageIndex: 0,
        pageSize: 10,
        sorts: {
          field: 'timestamp',
          order: 'desc',
        },
        terms: { property: props.item.id },
      });
      if (props.item.valueType.type === 'geoPoint') {
        geoPoint();
      }
    } else if (tabsType === '2') {
      statisticsChart(
        {
          pageIndex: 0,
          pageSize: 60,
          sorts: {
            field: 'timestamp',
            order: 'desc',
          },
          terms: { property: props.item.id },
        }
      );
    } else {
      geoPoint();
    }
  };

  const geoPoint = (params?: any) => {
    if (Object.keys(mapCreated).length != 0) {
      mapCreated.remove([marksCreated, labelsLayer, passedPolyline, drawPolyline]);
      labelsLayer.clear();
    }
    setLineArr([]);
    setLabelsDataList([]);
    setMarkerPosition([]);
    trajectory({
      pageIndex: 0,
      pageSize: 1000,
      sorts: {
        field: 'timestamp',
        order: 'asc',
      },
      terms: { ...params, property: props.item.id },
    }
    );
  };

  const tabs = (params: any) => {
    if (Object.keys(mapCreated).length != 0) {
      mapCreated.remove(labelsLayer);
      labelsLayer.clear();
    }
    setSpinning(true);
    handleSearch({
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: { ...params, property: props.item.id },
    });
    if (props.item.valueType.type === 'geoPoint') {
      geoPoint(params);
    }
  };

  const onSearch = () => {
    setSpinning(true);
    let params = queryParams();

    if (tabsType === '1') {
      tabs(params);
    } else if (tabsType === '2') {
      statisticsChart(
        {
          pageIndex: 0,
          pageSize: 60,
          sorts: {
            field: 'timestamp',
            order: 'desc',
          },
          terms: { ...params, property: props.item.id },
        }
      );
    } else {
      geoPoint(params);
    }
  };

  const mapElement = (ins: any, position: any, line: any, labelsData: any) => {

    let marker = new window.AMap.Marker({
      map: ins,
      position: position,
      icon: img26,
      offset: new window.AMap.Pixel(-13, -13),
      autoRotation: true,
      angle: -90,
    });
    setMarksCreated(marker);

    // 绘制轨迹
    let draw = new window.AMap.Polyline({
      map: ins,
      path: line,
      showDir: true,
      strokeColor: "#f5222d",  //线颜色
      // strokeOpacity: 1,     //线透明度
      strokeWeight: 6,      //线宽
      // strokeStyle: "solid"  //线样式
    });
    setDrawPolyline(draw);
    // 运动轨迹
    let passed = new window.AMap.Polyline({
      map: ins,
      // path: lineArr,
      strokeColor: "#AF5",  //线颜色
      // strokeOpacity: 1,     //线透明度
      strokeWeight: 6,      //线宽
      // strokeStyle: "solid"  //线样式
    });
    setPassedPolyline(passed);
    marker.on('moving', function (e: any) {
      passed.setPath(e.passedPath);
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
    labelsData.map((item: any) => {
      labelMarker = new window.AMap.LabelMarker(item);

      labelMarkerList.push(labelMarker);
      layer.add(labelMarker);
    });
  };

  // map事件列表
  const mapEvents = {
    created: (ins: any) => {
      setMapCreated(ins);
      mapElement(ins, markerPosition, lineArr, labelsDataList);
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
        <Form labelCol={{ span: 0 }} wrapperCol={{ span: 18 }}>
          <Row gutter={{ md: 8, lg: 4, xl: 48 }}>
            <Col md={10} sm={24}>
              <Form.Item>
                {getFieldDecorator('timestamp$BTW')(
                  <DatePicker.RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始时间', '结束时间']}
                    onChange={(value: any[]) => {
                      if (value.length === 0) {
                        unSearch();
                      }
                    }}
                    onOk={onSearch}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Tabs defaultActiveKey="1" tabPosition="top" type="card"
          onTabClick={(value: string) => {
            setTabsType(value);

            let params = queryParams();
            if (value === '1') {
              tabs(params);
            } else if (value === '2') {
              setSpinning(true);
              statisticsChart(
                {
                  pageIndex: 0,
                  pageSize: 60,
                  sorts: {
                    field: 'timestamp',
                    order: 'desc',
                  },
                  terms: { ...params, property: props.item.id },
                }
              );
            }
          }}
        >
          <Tabs.TabPane tab="列表" key="1">
            <Table
                loading={spinning}
                columns={initState.eventColumns}
                dataSource={(propertiesInfo || {}).data}
                rowKey="id"
                size="small"
                onChange={onTableChange}
                pagination={{
                  current: propertiesInfo.pageIndex + 1,
                  total: propertiesInfo.total,
                  pageSize: propertiesInfo.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total: number) =>
                      `共 ${total} 条记录 第  ${propertiesInfo.pageIndex + 1}/${Math.ceil(
                          propertiesInfo.total / propertiesInfo.pageSize,
                      )}页`,
                }}
            />
          </Tabs.TabPane>

          {statistics && (
            <Tabs.TabPane tab="图表" key="2">
              <Chart
                height={400}
                data={gatewayData}
                scale={{
                  value: { min: 0 },
                  year: {
                    range: [0, 0.96],
                    type: 'timeCat'
                  },
                }}
                forceFit
              >
                <Axis name="year" />
                <Axis name="value" label={{
                  formatter: val => parseFloat(val).toLocaleString()
                }} />
                <Legend />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="line" position="year*value" size={2} tooltip={[
                  "year*value*type",
                  (year, value, type) => ({
                    title: moment(year).format('YYYY-MM-DD HH:mm:ss'),
                    name: type,
                    value: value
                  })
                ]} />
                <Geom type="area" position="year*value" shape={'circle'} tooltip={[
                  "year*value*type",
                  (year, value, type) => ({
                    title: moment(year).format('YYYY-MM-DD HH:mm:ss'),
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
                <AntdTooltip title='默认启动循环执行动画，运动速度为：200km/h'>
                  <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                </AntdTooltip>
              </span>
            } key="3">
              <div style={{ width: '100%', height: '60vh' }}>
                <Map version="1.4.15" resizeEnable events={mapEvents} center={mapCenter} />
              </div>
              <div style={{ marginTop: '-6.4%', paddingRight: 2, textAlign: 'right', float: 'right' }}>
                <Card style={{ width: 240 }}>
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
                  <Button style={{ marginLeft: 10 }} type="primary"
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

import React, {useEffect, useState} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Button, Col, Icon, Input, message, Modal, Row, Tabs, Tooltip, TreeSelect} from 'antd';
import apis from '@/services';
import {Map} from 'react-amap';
import styles from '@/utils/table.less';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any;
}

interface State {
  regionList: any[];
  geoJsonPoint: any[];
  mapCreated: any;
  polyEditor: any;
  regionType: string;
}

const SaveRegion: React.FC<Props> = props => {

  const initState: State = {
    regionList: [],
    geoJsonPoint: [],
    mapCreated: {},
    polyEditor: {},
    regionType: '',
  };

  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const [regionList, setRegionList] = useState(initState.regionList);
  const [polyEditor, setPolyEditor] = useState(initState.polyEditor);
  const [regionType, setRegionType] = useState(initState.regionType);
  const [geoJsonPoint, setGeoJsonPoint] = useState(initState.geoJsonPoint);

  //默认点区域，可自行获取点进行替换
  let path = [
    [108.547046, 32.176686],
    [107.217163, 30.12156],
    [110.24939, 31.255258],
  ];

  useEffect(() => {
    setRegionType('geoJsonInfo');
    apis.location._search_geo_json({
      filter: {
        where: 'objectType not device',
        pageSize: 1000
      },
    })
      .then(response => {
          if (response.status === 200) {
            let region: any = [];
            response.result.features.map((item: any) => {
              region.push({
                id: item.properties.id,
                pId: item.properties.parentId,
                value: item.properties.id,
                title: `${item.properties.name}（${item.properties.id}）`
              })
            });
            setRegionList(region);
          }
        },
      )
      .catch(() => {
      });
  }, []);

  const onValidateForm = async () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      if (fileValue.id === fileValue.parentId) {
        message.error('上级区域选择错误，请重新选择');
        return;
      }

      if (regionType === 'geoJsonInfo') {
        let geoJson = JSON.parse(fileValue.geoJson);
        if (geoJson.features) {
          if (geoJson.features.length === 1) {
            geoJson.features = geoJson.features.map((item: any) => {
              item.properties.id = fileValue.id;
              item.properties.name = fileValue.name;
              item.properties.objectId = fileValue.id;
              item.properties.parentId = fileValue.parentId;
              item.properties.objectType = fileValue.objectType;
              return item;
            });
            props.save(geoJson);
          } else {
            message.error('区域GeoJson，仅支持单个区域数据');
            return;
          }
        } else {
          geoJson.properties.id = fileValue.id;
          geoJson.properties.name = fileValue.name;
          geoJson.properties.objectId = fileValue.id;
          geoJson.properties.parentId = fileValue.parentId;
          geoJson.properties.objectType = fileValue.objectType;

          props.save({
            type: 'FeatureCollection',
            features: [geoJson],
          });
        }
      } else {
        if (geoJsonPoint.length === 0) {
          message.error('请重新绘制区域后再保存');
          return;
        }
        let pointList: any[] = [];
        geoJsonPoint.map((item: any, index: number) => {
          let list: any[] = [];
          try {
            item.map((i: any) => {
              list.push([i.lng, i.lat]);
            });
            if (list[0][0] !== list[list.length - 1][0] || list[0][1] !== list[list.length - 1][1]) {
              list.push([list[0][0], list[0][1]]);
            }
            pointList.push([list]);
          } catch (e) {
            pointList.push([item.lng, item.lat]);
            if (index === geoJsonPoint.length - 1) {
              if (pointList[0][0] !== pointList[pointList.length - 1][0] || pointList[0][1] !== pointList[pointList.length - 1][1]) {
                pointList.push([pointList[0][0], pointList[0][1]]);
              }
              pointList = [[pointList]];
            }
          }
        });

        props.save(
          {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {
                name: fileValue.name,
                id: fileValue.id,
                parentId: fileValue.parentId,
                objectId: fileValue.id,
                objectType: fileValue.objectType,
              },
              geometry: {
                type: 'MultiPolygon',
                coordinates: pointList,
              },
            }],
          });
      }
    });
  };

  // map事件列表
  const mapEvents = {
    created: (ins: any) => {
      addMouseTool(ins);
    },
  };

  const addMouseTool = (mapCreated: any) => {

    let list: any[] = [];
    if (props.data.geometry) {
      props.data.geometry.coordinates.map((item: any) => {
        list.push(item[0]);
      });
    } else {
      list = path;
    }

    let polygon = new window.AMap.Polygon({
      path: list,
      strokeColor: '#FF33FF',
      strokeWeight: 3,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      fillColor: '#1791fc',
      zIndex: 10000,
    });

    mapCreated.add(polygon);
    // 缩放地图到合适的视野级别
    mapCreated.setFitView([polygon]);

    mapCreated.plugin('AMap.PolyEditor', function () {
      let polyEditor = new window.AMap.PolyEditor(mapCreated, polygon);

      setPolyEditor(polyEditor);
      polyEditor.on('addnode', function (event: any) {
      });

      polyEditor.on('adjust', function (event: any) {
      });

      polyEditor.on('removenode', function (event: any) {
      });

      polyEditor.on('end', function (event: any) {
        setGeoJsonPoint(event.target.Ce.path);
      });
    });
  };

  return (
    <Modal
      title='新建区域'
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        onValidateForm();
      }}
      width='50%'
      style={{marginTop: '-3%'}}
      onCancel={() => props.close()}
    >
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}} key="region_form">
        <Row key="geoJsonRow">
          <Col span={12}>
            <Form.Item key="id" label="区域标识">
              {getFieldDecorator('id', {
                rules: [
                  {required: true, message: '请输入区域标识'},
                  {max: 64, message: '区域标识不超过64个字符'},
                  {pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, "g"), message: '区域标识只能由数字、字母、下划线、中划线组成'}
                ],
                initialValue: props.data.properties?.id,
              })(<Input placeholder="请输入区域标识" disabled={!!props.data?.properties?.id}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="区域名称">
              {getFieldDecorator('name', {
                rules: [
                  {required: true, message: '请输入区域名称'},
                  {max: 200, message: '区域名称不超过200个字符'}
                ],
                initialValue: props.data.properties?.name,
              })(<Input placeholder="请输入区域名称"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="objectType" label="区域类型">
              {getFieldDecorator('objectType', {
                rules: [{required: true, message: '区域类型必填'}],
                initialValue: props.data.properties?.objectType,
              })(<Input placeholder="请输入区域类型"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="parentId" label="上级区域">
              {getFieldDecorator('parentId', {
                initialValue: props.data.properties?.parentId,
              })(
                <TreeSelect dropdownStyle={{maxHeight: 400}}
                            allowClear treeDataSimpleMode showSearch
                            placeholder="上级区域" treeData={regionList}
                            treeNodeFilterProp='title' searchPlaceholder='选择查看区域，可输入查询'
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Tabs defaultActiveKey="basic" onChange={(key: string) => {
        setRegionType(key);
      }}>
        <Tabs.TabPane tab="GeoJson" key="geoJsonInfo">
          <Form.Item key="geoJson" label={
            <span>
            GeoJson
            <Tooltip title={
              <span>
                区域GeoJson，仅支持单个区域数据&nbsp;（请获取JSON API内的数据）
                <a target='_blank'
                   href='http://datav.aliyun.com/tools/atlas/#&lat=32.91648534731439&lng=97.42675781249999&zoom=4'>
                获取
                </a>
              </span>
            }>
              <Icon type="question-circle-o" style={{paddingLeft: 10}}/>
            </Tooltip>
          </span>
          } labelCol={{span: 3}} wrapperCol={{span: 21}}>
            {getFieldDecorator('geoJson', {
              initialValue: JSON.stringify(props.data),
            })(
              <Input.TextArea rows={8} placeholder="区域GeoJson，仅支持单个区域数据"/>,
            )}
          </Form.Item>
        </Tabs.TabPane>
        <Tabs.TabPane tab={
          <span>
            绘制区域
            <Tooltip title='绘制区域时请点击“开始绘制”，切记绘制完成后请点击“结束绘制”'>
              <Icon type="question-circle-o" style={{paddingLeft: 10}}/>
            </Tooltip>
          </span>
        } key="draw">
          <div className={styles.tableListOperator}>
            <Button type="primary"
                    onClick={() => {
                      if (!polyEditor.kb) {
                        polyEditor.open();
                      }
                    }}
            >
              开始绘制
            </Button>
            <Button style={{marginLeft: 10}} type="primary"
                    onClick={() => {
                      if (polyEditor.kb) {
                        polyEditor.close();
                      }
                    }}
            >
              结束绘制
            </Button>
          </div>
          <div style={{width: '100%', height: 500, paddingTop: 5}}>
            <Map resizeEnable events={mapEvents} rotateEnable={true}/>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default Form.create<Props>()(SaveRegion);

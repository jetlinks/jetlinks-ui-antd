import React, {useEffect, useState} from 'react';
import {Card, Form, Input, Modal} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {Map} from 'react-amap';

interface Props extends FormComponentProps {
  close: Function;
  save: (data: any, index: number) => void;
  tagInfo: any;
  tagSequence: number;
}

interface State {
  mapCreated: any;
  mapMarker: any;
}

const Location: React.FC<Props> = props => {
    const initState: State = {
      mapCreated: {},
      mapMarker: {},
    };

    const {
      form: {getFieldDecorator},
      form,
    } = props;

    const [mapCreated, setMapCreated] = useState(initState.mapCreated);
    const [mapMarker, setMapMarker] = useState(initState.mapMarker);

    useEffect(() => {
      if (props.tagInfo.value) {
        form.setFieldsValue({value: props.tagInfo.value.split(',')});
      }
    }, []);

    const onValidateForm = async () => {
      form.validateFields((err, fileValue) => {
        if (err) return;
        props.save(fileValue, props.tagSequence);
      });
    };

    const newMassMarks = (map: any, keywords: string) => {
      window.AMap.plugin('AMap.PlaceSearch', function () {
        let autoOptions = {
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: '全国', // 兴趣点城市
          map: map, // 展现结果的地图实例
          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        };
        let placeSearch = new AMap.PlaceSearch(autoOptions);
        placeSearch.search(keywords, function (status, result) {
        });
      });
    };

    // map事件列表
    const mapEvents = {
      created: (ins: any) => {
        setMapCreated(ins);
        if (props.tagInfo.value) {
          newMarker(ins, props.tagInfo.value.split(','));
        }
      },
      click: (ins: any) => {
        form.setFieldsValue({value: ins.lnglat.getLng() + ',' + ins.lnglat.getLat()});
        if (mapCreated.getAllOverlays('marker').length <= 0) {
          newMarker(mapCreated, [ins.lnglat.getLng(), ins.lnglat.getLat()]);
        } else {
          if (Object.keys(mapMarker).length === 0) {
            newMarker(mapCreated, [ins.lnglat.getLng(), ins.lnglat.getLat()])
          } else {
            mapMarker.setPosition([ins.lnglat.getLng(), ins.lnglat.getLat()]);
          }
        }
      },
    };

    const newMarker = (map: any, coordinate: any[]) => {
      let marker = new window.AMap.Marker({
        offset: new window.AMap.Pixel(-10, -30),
      });
      marker.setMap(map);
      setMapMarker(marker);
      upMarker(marker, coordinate);
    };

    const upMarker = (map: any, coordinate: any[]) => {
      map.setPosition(coordinate);
    };

    return (
      <Modal
        title='选择定位'
        visible
        okText="确定"
        cancelText="取消"
        onOk={() => {
          onValidateForm();
        }}
        width="60%"
        onCancel={() => props.close()}
      >
        <div style={{width: '100%', height: '50vh'}}>
          <Map resizeEnable events={mapEvents} rotateEnable={true}/>
        </div>
        <div style={{
          width: '35%', height: '150px', float: 'right',
          marginTop: '-50vh', paddingTop: 5, paddingRight: 5,
        }}>
          <Card bordered={false} style={{
            height: '150px', marginTop: 5,
          }}>
            <Form labelCol={{span: 6}} wrapperCol={{span: 18}} key="form">
              <Form.Item key="search" label="位置搜索" style={{marginBottom: 14}}>
                <Input.Search placeholder="输入搜索区域" onSearch={value => {
                  newMassMarks(mapCreated, value);
                }} enterButton/>
              </Form.Item>
              <Form.Item key="value" label="经纬度" style={{marginBottom: 14}}>
                {getFieldDecorator('value', {})(
                  <Input id="value" placeholder="鼠标点击地图获取"/>,
                )}
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Modal>
    );
  }
;

export default Form.create<Props>()(Location);

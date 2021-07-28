
import { Row, Badge, Form, Icon, Table, Select } from 'antd';
import {CheckCircleOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import Button from 'antd/es/button';
import React from 'react';
import { useState, useEffect } from 'react';
import styles from './index.less';
import Input from 'antd/es/input';
import { ReloadOutlined } from '@ant-design/icons';
import Detail from './detail'
import Handle from './handle';
import Service from './service';
import { FormComponentProps } from 'antd/lib/form';
import Col from 'antd/es/grid/col';
import moment from 'moment';

interface Props extends FormComponentProps { }

function Log(props: Props) {
  const { form: { getFieldDecorator }, form } = props;
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [deviceOfflineCount, setDeviceOfflineCount] = useState<number>(0);
  const [deviceOnlineCount, setDeviceOnlineCount] = useState<number>(0);
  const [visible, setVisible] = useState(false);
  const [handlevisible, setHandleVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [alarmName, setalarmName] = useState<any[]>([]);
  const [alarmLog, setAlarmLog] = useState<any>({});
  const [alarmId, setAlarmId] = useState<string>("");
  const [alarmSolveId, setalarmSolveId] = useState<string>("");
  const [alarmList, setAlarmList] = useState<any>({
    data: [],
    pageIndex: 0,
    pageSize: 8,
    total: 0
  });
  const [searchParam, setSearchParam] = useState<any>({
    pageSize: 8,
  });
  const deviceId = 'local';
  const service = new Service('/alarm/log');

//获告警记录列表
  const handleSearch = (params:any) =>{
    setSearchParam(params);
    service.getAlarmLog(deviceId, params).subscribe(
      (res) => {
        setAlarmList(res)
      }
    )
  }; 
  //获取告警名称
  const getAlarmList = (data:any) =>{
    service.getAlarmList(deviceId,data).subscribe(
      (res)=>{
        setalarmName(res)
      }
    )
  };
  //获取产品
  const getProductList = () => {
    service.getDeviceGatewayList(deviceId, { paging: false }).subscribe(
      (res) => {
        setProductList(res);
      }
    )
  };

  const onAlarm = (value?: string) => {
    handleSearch({
      pageSize: searchParam.pageSize,
      where: `alarmName=${value}`
    })
  };

  const columns = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '告警名称',
      dataIndex: 'alarmName',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      width: '220px',
      render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
    },
    {
      title: '处理状态',
      dataIndex: 'state',
      width: '200px',
      render: (text:any) => text === 'solve' ? <div><CheckCircleOutlined style={{color:'#52C41A'}}/> 已处理</div>: 
      <div><ExclamationCircleOutlined style={{color:'#FF4D4F'}} /> 未处理</div>
    },
    {
      title: '处理结果',
      dataIndex: 'description',
      width: '200px',
      render: (text: any) => text ? <div>{text}</div>: '-',
    },
    {
      title: '操作',
      // dataIndex: 'on',
      width: '200px',
      render: (record:any) => <div style={{position:'relative',right:15}}>
              <Button type='link' onClick={()=>{
                setVisible(true)
                setAlarmLog(record)
              }}>详情</Button>
              {record.state==='solve' ? '' :<Button type='link' onClick={()=>{
                setHandleVisible(true)
                setalarmSolveId(record.id)
              }}>处理</Button> }
              
            </div>
    }
  ];

useEffect(() => {
  service.getDeviceCount({ 
    "terms": 
  [
    { "column": "productId", "value": "onvif-media-device", "termType": "not" },
   { "column": "productId", "value": "GB28181-PRO", "termType": "not" }] }).subscribe(resp => {
    if (resp.status === 200) {
      setDeviceCount(resp.result[0])
    }
  })
  service.getDeviceCount({
    "terms": [
      { "column": "productId", "value": "onvif-media-device", "termType": "not" },
      { "column": "productId", "value": "GB28181-PRO", "termType": "not" },
      { "column": "state", "value": "online" }
    ]
  }).subscribe(resp => {
    if (resp.status === 200) {
      setDeviceOnlineCount(resp.result[0])
    }
  })
  service.getDeviceCount({
    "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" },
          { "column": "productId", "value": "GB28181-PRO", "termType": "not" },
          { "column": "state", "value": "offline" }
        ]
  }).subscribe(resp => {
    if (resp.status === 200) {
      setDeviceOfflineCount(resp.result[0])
    }
  })
  handleSearch(searchParam);
  getProductList();
  getAlarmList({});
}, []);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>告警记录</div>
        <div className={styles.right}>
          <div style={{
            fontSize:14
          }}>告警名称：</div>
          <Select allowClear style={{width:200,paddingRight:10}} value={alarmId}
          onChange={(value:string)=>{
            setAlarmId(value);
            if(value !=='' && value !== undefined){
              onAlarm(value);
            }else{
              handleSearch({
                pageSize: searchParam.pageSize
            });
            }
          }}>
              {
                alarmName.map(item => (
                  <Select.Option key={item.id} value={item.name}>{item.name}</Select.Option>
                ))
              }
           </Select>
          <Button type="link" style={{paddingLeft:5}}
                       onClick={() => {
                        setAlarmId('')
                        handleSearch({
                          pageSize: searchParam.pageSize
                        });
                       }}><ReloadOutlined /></Button>
        </div>
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>总设备数： {deviceCount}</span>
            <span></span>
            <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'green'} text="在线数" />{deviceOnlineCount}</span>
            <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'red'} text="离线数" />{deviceOfflineCount}</span>
          </div>
          <div><a onClick={() => {
            setSearchVisible(!searchVisible)
          }}>高级筛选<Icon type="up" /></a></div>
        </div>
        {
          searchVisible && (
            <div style={{marginTop:10}}>
              <Form
                    labelCol={{
                      xs: { span: 6 },
                      sm: { span: 6 },
                    }}
                    wrapperCol={{
                      xs: { span: 36 },
                      sm: { span: 18 },
                    }}>
                    <Row gutter={24}>
                      <Col span={6}>
                        <Form.Item label="设备ID">
                          {getFieldDecorator('deviceId', {})(
                            <Input />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="产品名称">
                          {getFieldDecorator('productName', {})(
                            <Select allowClear>
                              {
                                productList.map((item, index) => (
                                  <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
                                ))
                              }
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="告警状态">
                          {getFieldDecorator('state', {})(
                            <Select allowClear>
                            <Select.Option value="solve">已处理</Select.Option>
                            <Select.Option value="newer">未处理</Select.Option>
                          </Select>,
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
              <div style={{marginLeft:110}}>
                <Button style={{marginRight:5}} onClick={()=>{
                  form.resetFields();
                  handleSearch({
                    pageSize: 8,
                  })
                }}>重置</Button>
                <Button type="primary" onClick={()=>{
                  const data = form.getFieldsValue();
                  let terms: any[]=[];
                  Object.keys(data).forEach(i=>{
                    if(data[i]){
                      if(i=== 'deviceId'){
                        terms.push({
                          "column": i, "value": `%${data[i]}%`,"termType": "like"
                        })
                      }else{
                        terms.push({
                          "column": i, "value": data[i],
                        })
                      }
                    }
                  })
                  handleSearch({
                    pageSize: 8,
                    terms:[
                      // {column:'deviceId',value:`%${data.deviceId}%`,termType:'like'},
                      // {column:'productName',value:data.productName},
                      // {column:'state',value:data.state},
                      ...terms
                    ]
                  });
                }}>查询</Button>
              </div>
            </div>
          )
        }
      </div>
      <div>
        <div>
          <Table
            columns={columns}
            dataSource={alarmList.data}
            rowKey="id"
            bodyStyle={{ backgroundColor: '#fff' }}
            pagination={{
              current: alarmList?.pageIndex + 1,
              total: alarmList?.total,
              pageSize: alarmList?.pageSize,
              onChange: (page: number, pageSize?: number) => {
                handleSearch({
                  ...searchParam,
                  pageIndex: page - 1,
                  pageSize: pageSize || searchParam.pageSize
                })
              },
              onShowSizeChange: (current, size) => {
                handleSearch({
                  ...searchParam,
                  pageIndex: current,
                  pageSize: size || searchParam.pageSize
                })
              },
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['8', '16', '40', '80'],
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${alarmList?.pageIndex + 1}/${Math.ceil(
                  alarmList?.total / alarmList?.pageSize,
                )}页`
            }}
          />
        </div>
      </div>
      <Detail
        visible={visible}
        datalist={alarmLog}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          setVisible(false)
        }}
      />
      <Handle
        visible={handlevisible}
        deviceId={deviceId}
        id={alarmSolveId}
        onCancel={() => {
          setHandleVisible(false)
        }}
        onOk={() => {
          setHandleVisible(false)
          handleSearch(searchParam);
        }}
      />
    </div>
  );
}

export default Form.create<Props>()(Log);
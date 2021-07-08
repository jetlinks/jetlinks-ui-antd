
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

interface Props extends FormComponentProps { }

function Log(props: Props) {
  const { form: { getFieldDecorator }, form } = props;
  const [visible, setVisible] = useState(false);
  const [handlevisible, setHandleVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [alarmList, setAlarmList] = useState<any>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [searchParam, setSearchParam] = useState<any>({
    pageSize: 10
  });
  const deviceId = 'local';
  const service = new Service('/alarm/log');

//获取列表
  const handleSearch = (params:any) =>{
    setSearchParam(params);
    service.getAlarmLog(deviceId, params).subscribe(
      (res) => {
        setAlarmList(res)
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
  }

  const columns = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      width: 'deviceName',
      ellipsis: true,
    },
    {
      title: '告警内容',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      width: '220px',
      // render: record =>
      //   record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
    },
    {
      title: '处理状态',
      dataIndex: 'state',
      width: '200px',
      render:(record:any)=>{
        return <div>
          {record ? <div>
                    <CheckCircleOutlined style={{color:'#52C41A'}}/> 已处理</div>
                :<div>
                    <ExclamationCircleOutlined style={{color:'#FF4D4F'}} /> 未处理
                </div>}
        </div>
      }
    },
    {
      title: '处理结果',
      dataIndex: 'res',
      width: '200px',
    },
    {
      title: '操作',
      // dataIndex: 'on',
      width: '200px',
      render: (record:any) => <div style={{position:'relative',right:15}}>
              <Button type='link' onClick={()=>{
                setVisible(true)
              }}>详情</Button>
              {record.status ? '' :<Button type='link' onClick={()=>{
                setHandleVisible(true)
              }}>处理</Button> }
              
            </div>
    }
  ];

useEffect(() => {
  handleSearch({pageSize: 10});
  getProductList();
}, []);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>告警记录</div>
        <div className={styles.right}>
          <div style={{
            width:120,
            fontSize:14
          }}>告警名称：</div>
          <Input.Search style={{ marginRight: '16px' }} />
          <Button type="link" style={{paddingLeft:5}}
                       onClick={() => {
                        
                       }}><ReloadOutlined /></Button>
        </div>
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>总设备数： 20</span>
            <span></span>
            <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'green'} text="在线数" />1</span>
            <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'red'} text="离线数" />1</span>
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
                    pageSize: 10,
                  })
                }}>重置</Button>
                <Button type="primary" onClick={()=>{
                  const data = form.getFieldsValue();
                  handleSearch({
                    pageSize: 10,
                    terms:[
                      {deviceId:data.deviceId},
                      {productName:data.productName},
                      {state:data.state},
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
          // onChange={onTableChange}
          // pagination={{
          //   current: deviceData.pageIndex + 1,
          //   total: deviceData.total,
          //   pageSize: deviceData.pageSize,
          //   showQuickJumper: true,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['10', '20', '50', '100'],
          //   showTotal: (total: number) =>
          //     `共 ${total} 条记录 第  ${deviceData.pageIndex + 1}/${Math.ceil(
          //       deviceData.total / deviceData.pageSize,
          //     )}页`,
          // }}
          />
        </div>
      </div>
      <Detail
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          setVisible(false)
        }}
      />
      <Handle
        visible={handlevisible}
        onCancel={() => {
          setHandleVisible(false)
        }}
        onOk={() => {
          setHandleVisible(false)
        }}
      />
    </div>
  );
}

// export default Log;
export default Form.create<Props>()(Log);
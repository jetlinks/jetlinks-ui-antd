//告警日志
import { Badge, Table, Select ,Form,Row} from 'antd';
import Button from 'antd/es/button';
import React from 'react';
import { useState ,useEffect} from 'react';
import styles from './index.less';
import Input from 'antd/es/input';
import Col from 'antd/es/grid/col';
import { FormComponentProps } from 'antd/lib/form';
import Detali from '@/pages/alarm/log/detail';
import Handle from '@/pages/alarm/log/handle'
import {CheckCircleOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import Service from '../service';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps  {
    close: Function;
    id:string;
    deviceId:string;
    name:string;
    
  }

  interface State {
    id:string;
    deviceId: string;
    name:string;
    AlarmLogList:any;
    searchParam:any;
  }

  const Log: React.FC<Props> = props => {

    const initState: State = {
      deviceId: props.deviceId,
      id:props.id,
      AlarmLogList:[],
      name:props.name,
      searchParam: {
        
      },
    }
    const { form: { getFieldDecorator }, form } = props;
    const service = new Service('/alarm/setting');
    const [visible, setVisible] = useState(false);
    const [handlevisible, setHandleVisible] = useState(false);
    const [AlarmLogList, setAlarmLogList] =  useState(initState.AlarmLogList);
    const [searchParam, setSearchParam] = useState(initState.searchParam);


//获取告警日志
const handleSearch = (params: any) =>{
  setSearchParam(params);
    service.getAlarmInfo(props.deviceId, encodeQueryParam(params)).subscribe(
      (resp) => {
        setAlarmLogList(resp);
      }
    )
};


    useEffect(() => {
      handleSearch({id:props.id});
    }, []);
    
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
            </div>,
    }
  ];
  
  return (
    <div>
      <div className={styles.header}>
      <Button  onClick={()=>{
          props.close()
      }}>返回</Button>
      </div>
      <div style={{backgroundColor: 'white',color: '#000000FF'}}>
        <div style={{fontSize:16,
                    fontWeight:600,
                    paddingTop:20,
                    marginLeft:10
                    }}>{props.name}</div>
      </div>
      <div style={{
            backgroundColor: '#fff',
            marginBottom:10,
            paddingLeft:15,
            display:"flex",
            justifyContent:'space-between',
            alignItems:'center'
            }}>
      <Form
            style={{width:'600px',paddingTop:25}}
            labelCol={{
              xs: { span: 12 },
              sm: { span: 6 },
            }}
            wrapperCol={{
              xs: { span: 36 },
              sm: { span: 18 },
            }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('deviceName', {})(
                    <Input/>,
                  )}
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item label="处理状态">
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
        <div style={{marginRight:20}}>
          <Button style={{marginRight:5}} onClick={()=>{
            form.resetFields();
            handleSearch({
              id:props.id,
            })
          }}>重置</Button>
          <Button type="primary" onClick={()=>{
            const data = form.getFieldsValue();
            let list = searchParam.where ? searchParam.where.split(' and ') : [];
            let where: string[] = list.filter((item: string) => {
              return item.includes('like');
            });
            Object.keys(data).forEach(i => {
              if (data[i]) {
                where.push(`${i}=${data[i]}`)
              }
            })
            handleSearch({
              where: where.join(' and '),
              id:props.id,
            });
          }}>查询</Button>
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
        </div>

       

      </div>
      <div>
        <div>
          <Table
            columns={columns}
            dataSource={AlarmLogList}
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
      <Detali
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
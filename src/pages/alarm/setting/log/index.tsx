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
import moment from 'moment';

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
        pageIndex:0,
        pageSize: 8,
      },
    }
    const { form: { getFieldDecorator }, form } = props;
    const service = new Service('/alarm/setting');
    const [deviceCount, setDeviceCount] = useState<number>(0);
    const [deviceOfflineCount, setDeviceOfflineCount] = useState<number>(0);
    const [deviceOnlineCount, setDeviceOnlineCount] = useState<number>(0);
    const [visible, setVisible] = useState(false);
    const [handlevisible, setHandleVisible] = useState(false);
    const [AlarmLogList, setAlarmLogList] =  useState(initState.AlarmLogList);
    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [alarmLog, setAlarmLog] = useState<string>("");
    const [alarmSolveId, setalarmSolveId] = useState<string>("");

//获取告警日志
const handleSearch = (params: any) =>{
  setSearchParam(params);
    service.getAlarmLogList(props.deviceId, encodeQueryParam(params)).subscribe(
      (resp) => {
        setAlarmLogList(resp);
      }
    )
};
// const getDeviceCount = () => {
//   service.getDeviceCount().subscribe(resp => {
//     if (resp.status === 200) {
//       setDeviceCount(resp.result[0])
//     }
//   })
//   service.getDeviceCount({
//     terms: [
//       { column: "state", value: "online" }
//     ]
//   }).subscribe(resp => {
//     if (resp.status === 200) {
//       setDeviceOnlineCount(resp.result[0])
//     }
//   })
//   service.getDeviceCount({ column: "state", value: "offline" }).subscribe(resp => {
//     if (resp.status === 200) {
//       setDeviceOfflineCount(resp.result[0])
//     }
//   })
// };

    useEffect(() => {
      service.getDeviceCount({
        "terms":
          [
            { "column": "productId", "value": "onvif-media-device", "termType": "not" }
          ]
      }).subscribe(resp => {
        if (resp.status === 200) {
          setDeviceCount(resp.result[0])
        }
      })
      service.getDeviceCount({
        "terms":
          [
            { "column": "productId", "value": "onvif-media-device", "termType": "not" },
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
            { "column": "state", "value": "offline" }
          ]
      }).subscribe(resp => {
        if (resp.status === 200) {
          setDeviceOfflineCount(resp.result[0])
        }
      })
      handleSearch({
        pageIndex: searchParam.pageIndex,
        pageSize: searchParam.pageSize,
        where: `alarmName=${props.name}`,
      })
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
      dataIndex: 'content',
      width: '200px',
      ellipsis: true,
      render: (text: any) => text ? <div>{text}</div>: '-',
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      width: '220px',
      render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
      // render: record =>
      //   record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
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
              pageIndex: searchParam.pageIndex,
              pageSize: searchParam.pageSize,
              where: `alarmName=${props.name}`,
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
                where.push(`${i} like %${data[i]}%`)
              }
            })
            handleSearch({
              pageIndex: searchParam.pageIndex,
              pageSize: searchParam.pageSize,
              where:`alarmName=${props.name}`+` and `+where.join(' and '),
            });
          }}>查询</Button>
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
        </div>

       

      </div>
      <div>
        <div>
          <Table
            columns={columns}
            dataSource={AlarmLogList.data}
            rowKey="id"
            bodyStyle={{ backgroundColor: '#fff' }}
            pagination={{
              current: AlarmLogList?.pageIndex + 1,
              total: AlarmLogList?.total,
              pageSize: AlarmLogList?.pageSize,
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
                `共 ${total} 条记录 第  ${AlarmLogList?.pageIndex + 1}/${Math.ceil(
                  AlarmLogList?.total / AlarmLogList?.pageSize,
                )}页`
            }}
          />
        </div>
      </div>
      <Detali
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
        deviceId={props.deviceId}
        id={alarmSolveId}
        visible={handlevisible}
        onCancel={() => {
          setHandleVisible(false)
        }}
        onOk={() => {
          setHandleVisible(false)
          handleSearch({
            pageIndex: searchParam.pageIndex,
            pageSize: searchParam.pageSize,
            where: `alarmName=${props.name}`,
          })
        }}
      />
    </div>
  );
}

// export default Log;
export default Form.create<Props>()(Log);
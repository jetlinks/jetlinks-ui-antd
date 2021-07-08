import React, { useState, useEffect} from 'react';
import Cards from '@/components/Cards';
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import { message, Card, Tooltip, Modal, Select, Switch,Button,Form,Row,Spin} from 'antd';
import AliFont from '@/components/AliFont';
import styles from './index.less';
import Edit from './edit';
import Log from '../setting/log/index';
import Service from './service';
import { alarm } from '@/pages/device/alarm/data';
import moment from 'moment';
import { FormComponentProps } from 'antd/lib/form';
import Col from 'antd/es/grid/col';
import Input from 'antd/es/input';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps { }
interface State {
  data: any;
  searchParam: any;
  setlogVisble: boolean;
  editVisible:boolean;
  logVisble:boolean,
  currentData: Partial<alarm>;
}



function Setting(props: Props) {
  const deviceId = 'local';
  const initState: State = {
    data: {},
    currentData: {},
    searchParam: {
      pageSize: 8, 
    },
    
    
    setlogVisble: false,
    editVisible:false,
    logVisble:false,

  };
  const service = new Service('/alarm/setting');
  const [editVisible, setEditVisible] = useState(initState.editVisible);
  const [logVisble, setlogVisble] = useState(initState.setlogVisble);
  const [delVisible, setDelVisible] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>({})
  const [alarmList, setAlarmList] = useState<any>({});
  const [alarmLogId, setAlarmLogId] = useState<string>("");
  const [alarmLogName, setalarmLogName] = useState<string>("");
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const { form: { getFieldDecorator }, form } = props;
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

 

//获取告警信息
const handleSearch = (params: any) => {
  setSearchParam(params);
  setLoading(true);
  service.getAlarmPage(deviceId, encodeQueryParam(params)).subscribe(
    (res) => {
      setAlarmList(res)
    },
    () => {
    },
    () => setLoading(false)) 
};
//保存
const saveInfo = (params?: any) => {
  service.savaAlarm(deviceId, params).subscribe(
    () => {
        message.success('操作成功！');
        handleSearch({ pageSize: 8 });
    }
  )
};
//删除
const remove = (id: string) => {
  service._remove(deviceId, {id:id}).subscribe(
      ()=>{
        message.success('删除成功');
       
        handleSearch({ pageSize: 8 });
        setDelVisible(false);
  })

};
//启动
const start = (data: any) => {
  service._start(deviceId, {id:data.id}).subscribe(
    () => {
        message.success('启动成功！');
        handleSearch({ pageSize: 8 });
    }
  )
};
//停止
const stop = (data: any) => {
  service._stop(deviceId, {id:data.id}).subscribe(
    () => {
        message.success('停止成功！');
        handleSearch({ pageSize: 8 });
    }
  )
};

useEffect(() => {
  handleSearch({ pageSize: 8 });
}, []);


  return (
    <div>
      {logVisble ? <div>
        <Log 
        id={alarmLogId}
        name={alarmLogName}
        deviceId={deviceId}
        close={()=>{
            setlogVisble(false)
        }}
        />
      </div>:<div style={{ height: '100%' }}>
      <Spin spinning={loading}>
      <Cards
        title='告警设置'
        cardItemRender={(data: any) => <div style={{ height: 200, backgroundColor: '#fff' }}>
            <Card hoverable bodyStyle={{ paddingBottom: 20 }}
              actions={[
                <a onClick={()=>{
                  setEditVisible(true);
                  setCurrentData(data);
                }}>编辑</a>,
                <a onClick={()=>{
                  setlogVisble(true)
                  setAlarmLogId(data.id)
                  setalarmLogName(data.name)
                }}>告警日志</a>,
                <a onClick={()=>{
                  setDelVisible(true);
                  setCurrentData(data);
                }}>删除</a>,
              ]}
            >
                <Card.Meta
                avatar={<AliFont type='icon-touxiang5' style={{ fontSize: 46 }}/>}
                title={
                  <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <AutoHide title={data.name} style={{ flexGrow: 1, fontWeight: 600,fontSize:16}} />
                    <Switch checked={data.state.value !=='stopped'} onChange={(e)=>{
                      console.log(data.state)
                      if(e){
                        start(data)
                      }else{
                        stop(data)
                      }
                    }}/>
                  </div>
                }
                />
                
                <div className={styles.content}>
                  <div className={styles.item}>
                    <p>创建时间：{moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>规则描述</p>
                    <Tooltip placement='top' title={data.description} >
                        <div className={styles.itemtext}>
                          规则描述
                        </div>
                    </Tooltip>
                  </div>
                </div> 
            </Card>
        </div>}

        toolNode={<Button type="primary" onClick={()=>{
          setEditVisible(true);
          setCurrentData({});
        }}>新增告警</Button>}

        extraTool={<div style={{ padding: 16, 
          backgroundColor: '#fff',
          marginBottom:10,
          height:'76px',
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
                <Form.Item label="告警名称">
                  {getFieldDecorator('name', {})(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item label="启停状态">
                  {getFieldDecorator('state', {})(
                    <Select allowClear>
                      <Select.Option value="stopped">已停止</Select.Option>
                      <Select.Option value="running">运行中</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div >
        <Button style={{marginRight:5}} onClick={()=>{
          form.resetFields();
          handleSearch({
            pageSize: 8
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
            pageSize: 8
          });
        }}>查询</Button>
      </div>
    </div>}
        pagination={{
          pageSize: 10,
          current: 1,
          total: 6
        }}
        dataSource={alarmList.data}
        columns={[
          {
            title: '告警名称',
            dataIndex: 'name',
          },
          {
            title: '规则描述',
            dataIndex: 'description',
            width:600
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
          },
          {
            title: '状态',
            dataIndex: 'state',
            render: (record)=><>
              <Switch></Switch>
            </>
          },
          {
            title: '操作',
            width: 280,
            render: (record) => <div style={{position:'relative',right:15}}>
              <Button type='link' onClick={()=>{
                setEditVisible(true);
                setCurrentData(record);
              }}>编辑</Button>
              <Button type='link' onClick={()=>{
                setlogVisble(true)
                setAlarmLogId(record.id)
                setalarmLogName(record.name)
              }}>告警日志</Button>
              <Button type='link'  onClick={()=>{
                  setDelVisible(true);
                  setCurrentData(record);
                }}>删除</Button>
            </div>
            
          },
        ]}
      />
      </Spin>
      {editVisible && 
        <Edit
          close={() => {
            setEditVisible(false);
            setCurrentData({});
          }}
          save={(data: any) => {
            saveInfo(data);
            setEditVisible(false);
            setCurrentData({});
          }}
          data={currentData}
          deviceId={deviceId}
          
        />
      }
       <Modal
                title="确认删除"
                visible={delVisible}
                onOk={() => {
                  remove(currentData.id);
                  setDelVisible(false);
                }}
                onCancel={() => { setDelVisible(false); }}
            >
                <p>是否确认删除该告警配置？</p>
        </Modal>
    </div>}
    </div>
  );
}


export default Form.create<Props>()(Setting);
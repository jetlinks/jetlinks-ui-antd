import React, { useState, useRef } from 'react';
import Cards from '@/components/Cards';
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import { Avatar, Card, Tooltip, List, Select, Switch,Button,Input} from 'antd';
import AliFont from '@/components/AliFont';
import styles from './index.less';
import BaseForm from '@/components/BaseForm';
import Edit from './edit';
import Log from '../setting/log/index';

interface Props {
  ruleInstance: any;
  // dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  sceneList: any,
  setlogVisble: boolean;
  editVisible:boolean;
  detailVisible: boolean,
  logVisble:boolean,
  detailData: any;
}



function Setting() {
  const initState: State = {
    data: {},
    searchParam: {
      pageSize: 8, sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    sceneList: {},
    setlogVisble: false,
    editVisible:false,
    detailVisible: false,
    logVisble:false,
    detailData: {},
  };
  
  const [editVisible, setEditVisible] = useState(initState.editVisible);
  const [logVisble, setlogVisble] = useState(initState.setlogVisble);
  const [detailData, setDetailData] = useState(initState.detailData);

  // const onEdit = (item: any) => {
  //   setDetailData(item);
  // }

const ExtraTool = () => {
  return <div style={{ padding: 16, 
            backgroundColor: '#fff',
            marginBottom:10,
            height:'76px',
            display:"flex",
            justifyContent:'space-between',
            alignItems:'center'
            }}>
      <BaseForm
      style={{width:'600px',paddingTop:25}}
          labelCol={{
            xs: { span: 12 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 36 },
            sm: { span: 18 },
          }}
          column={2}
          items={[
            {
              name: 'test',
              label: '告警名称',
              render: () => <Input placeholder='告警名称'/>
            },
            {
              name: 'test2',
              label: '启停状态',
              render: () => <Select placeholder='请选择'>
                <Select.Option value={0}>全部</Select.Option>
                <Select.Option value={1}>在线</Select.Option>
                <Select.Option value={2}>离线</Select.Option>
              </Select>
            },
          ]}
        />
        <div >
          <Button style={{marginRight:5}}>重置</Button>
          <Button type="primary">查询</Button>
        </div>
        
  </div>
}

  return (
    <div>
      {logVisble ? <div>
        <Log 
        close={()=>{
            setlogVisble(false)
        }}
        />
      </div>:<div style={{ height: '100%' }}>
      <Cards
        
        title='告警设置'
        cardItemRender={(data: any) => <div style={{ height: 200, backgroundColor: '#fff' }}>
        
            <Card hoverable bodyStyle={{ paddingBottom: 20 }}
              actions={[
                <a onClick={()=>{
                  setEditVisible(true)
                  setDetailData(data)
                }}>编辑</a>,
                <a onClick={(data)=>{
                  setlogVisble(true)
                }}>告警日志</a>,
                <a onClick={()=>{
                  
                }}>删除</a>,
              ]}
            >
                <Card.Meta
                avatar={<AliFont type='icon-touxiang5' style={{ fontSize: 46 }}/>}
                title={
                  <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <AutoHide title={data.name} style={{ flexGrow: 1, fontWeight: 600,fontSize:16}} />
                    <Switch checked={data.status}/>
                  </div>
                }
                />
                
                <div className={styles.content}>
                  <div className={styles.item}>
                    <p>创建时间：{data.time}</p>
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>规则描述</p>
                    <Tooltip placement='top' title={data.text} >
                        <div className={styles.itemtext}>
                          {data.text}
                        </div>
                    </Tooltip>
                  </div>
                </div> 
            </Card>
          
        </div>}
        toolNode={<Button type="primary" onClick={()=>{
          setEditVisible(true);
          setDetailData({});
        }}>新增告警</Button>}
        extraTool={<ExtraTool />}
        pagination={{
          pageSize: 10,
          current: 1,
          total: 6
        }}
        dataSource={[
          {
            id:1,
            name: '告警名称',
            text: '主机CPU使用率连续3次，总是大于等于60，则每15分钟告警',
            time: '2021-05-07 09:23:45',
            status: true
          },
          {
            id:2,
            name: '告警名称',
            text: '规则描述',
            time: '2021-05-07 09:23:45',
            status: true
          },
          {
            id:3,
            name: '告警名称',
            text: '规则描述',
            time: '2021-05-07 09:23:45',
            status: true
          },
          {
            id:4,
            name: '告警名称',
            text: '规则描述',
            time: '2021-05-07 09:23:45',
            status: true
          },
          {
            id:5,
            name: '告警名称',
            text: '规则描述',
            time: '2021-05-07 09:23:45',
            status: false
          },
        ]}
        columns={[
          {
            title: '告警名称',
            dataIndex: 'name',
          },
          {
            title: '规则描述',
            dataIndex: 'text',
            width:600
          },
          {
            title: '创建时间',
            dataIndex: 'time',
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (record)=><>
              <Switch checked={record}></Switch>
            </>
          },
          {
            title: '操作',
            width: 280,
            render: () => <div style={{position:'relative',right:15}}>
              <Button type='link' onClick={()=>{
                setEditVisible(true)
              }}>编辑</Button>
              <Button type='link' onClick={()=>{setlogVisble(true)}}>告警日志</Button>
              <Button type='link'>删除</Button>
            </div>
            
          },
        ]}
      />
      {editVisible && (
        <Edit
          data={detailData}
          close={() => {
            setEditVisible(false);
          }}
          save={(data: any) => {
            setEditVisible(false);
            
          }}
        />
      )}
    </div>}
    </div>
  );
}

export default Setting;

//告警日志
import { Badge, Table, Select } from 'antd';
import Button from 'antd/es/button';
import React from 'react';
import { useState } from 'react';
import styles from './index.less';
import Input from 'antd/es/input';
import BaseForm from '@/components/BaseForm';
import Detali from '@/pages/alarm/log/detail';
import Handle from '@/pages/alarm/log/handle'
import {CheckCircleOutlined,ExclamationCircleOutlined} from '@ant-design/icons';

interface Props  {
    
    close: Function;
  }

  const Log: React.FC<Props> = props => {

    const [visible, setVisible] = useState(false)
    const [handlevisible, setHandleVisible] = useState(false)



  const columns = [
    {
      title: '设备ID',
      dataIndex: 'id',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '告警内容',
      dataIndex: 'text',
      ellipsis: true,
    },
    {
      title: '告警时间',
      dataIndex: 'time',
      width: '220px',
      // render: record =>
      //   record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
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
  
const dataSource = [
  {
    id: '1',
    name: '警告一',
    text: '规则实例',
    time: '-',
    status: false,
    res:'ok'
  },
  {
    id: '2',
    name: '警告一',
    text: '规则实例撒大苏打实打实大苏打',
    time: '2021-05-01 09:23:44',
    status: false,
    res:'ok'
  },
  {
    id: '3',
    name: '警告一',
    text: '规则实例',
    time: '-',
    status: true,
    res:'ok'
  },
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
                    }}>test告警</div>
      </div>
      <div style={{
            backgroundColor: '#fff',
            marginBottom:10,
            display:"flex",
            justifyContent:'space-between',
            alignItems:'center'
            }}>
      <BaseForm
      style={{width:'650px',paddingTop:5}}
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
              label: '设备',
              render: () => <Input placeholder='设备ID/名称'/>
            },
            {
              name: 'test2',
              label: '处理状态',
              render: () => <Select placeholder='全部'>
                <Select.Option value={0}>已处理</Select.Option>
                <Select.Option value={1}>未处理</Select.Option>
                
              </Select>
            },
          ]}
        />
        <div style={{marginRight:20}}>
          <Button style={{marginRight:5}}>重置</Button>
          <Button type="primary">查询</Button>
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
            dataSource={dataSource}
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

export default Log;
import React, { useState } from 'react';
import styles from './index.less';
import { Table, Button, Input, Select, Badge, Icon } from 'antd';
import BaseForm from '@/components/BaseForm';
import DeviceModel from './deviceModel';

function Left() {

  const [advanced, setAdvanced] = useState(false)
  const [visible, setVisible] = useState(false)

  const openModel = (type: string) => {
    setVisible(true)
  }

  return (
    <div className={styles.left}>
      <div className={styles.header}>
        <span>视频设备</span>
        <div>
          <Button type='primary' onClick={() => {
            openModel('add')
          }}>添加设备</Button>
          <Icon style={{ color: 'rgba(0,0,0,.45)', marginLeft: 25, cursor: 'pointer' }} type="redo" />
        </div>
      </div>
      <div className={styles.tool}>
        <span>已接入设备数 20</span>
        <div onClick={() => { setAdvanced(!advanced) }} style={{ color: '#1890FF', cursor: 'pointer' }}>
          高级筛选 <Icon style={{ transform: `rotate( ${advanced ? 0 : '-180deg'})`, transition: 'all .3s' }} type="down" />
        </div>
      </div>
      <div className={`${styles.advanced} ${advanced ? styles.active : ''}`}>
        <BaseForm
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
              label: '设备名称',
              render: () => <Input />
            },
            {
              name: 'test2',
              label: '状态',
              render: () => <Select>
                <Select.Option value={0}>全部</Select.Option>
                <Select.Option value={1}>在线</Select.Option>
                <Select.Option value={2}>离线</Select.Option>
              </Select>
            }
          ]}
        />
        <div className={styles.advancedTool}>
          <Button>重置</Button>
          <Button type="primary">查询</Button>
        </div>
      </div>
      <div className={styles.table}>
        <Table
          dataSource={[
            { status: 1, name: '测试', xieyi: '' }
          ]}
          columns={[
            {
              title: '状态',
              dataIndex: 'status',
              render: () => {
                return <Badge color="#f50" text="离线" />
              },
              width: 90
            },
            {
              title: '设备名称',
              dataIndex: 'name',
            },
            {
              title: '接入协议',
              dataIndex: 'xieyi',
              render: () => {
                return <div>
                  <div></div>
                  <div>IP: </div>
                </div>
              }
            },
            {
              title: '操作',
              render: () => {
                return <>
                  <Button type='link'>编辑</Button>
                  <Button type='link'>删除</Button>
                </>
              },
              width: 154
            },
          ]}
        />

      </div>
      <DeviceModel
        visible={visible}
      />
    </div>
  );
}

export default Left;

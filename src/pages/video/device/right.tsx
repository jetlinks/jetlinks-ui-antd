import React, { useState } from 'react';
import styles from './index.less';
import { Table, Button, Badge, Icon } from 'antd';
import ChannelModel from './channelModel';

function Right() {

  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.right}>
      <div className={styles.header}>
        <span>视频通道</span>
        <div>
          <Icon style={{ color: 'rgba(0,0,0,.45)', marginLeft: 25, cursor: 'pointer' }} type="redo" />
        </div>
      </div>
      <Table
        dataSource={[
          { number: '001', status: 1, name: '测试', xieyi: '' }
        ]}
        columns={[
          {
            title: '序号',
            dataIndex: 'number',
            width: 90
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: () => {
              return <Badge color="#f50" text="离线" />
            },
            width: 90
          },
          {
            title: '通道名称',
            dataIndex: 'name',
          },
          {
            title: '通道ID',
            dataIndex: 'xieyi',
          },
          {
            title: '操作',
            render: () => {
              return <>
                <Button type='link' onClick={() => {
                  setVisible(true)
                }}>编辑</Button>
                <Button type='link'>播放</Button>
                <Button type='link'>删除</Button>
              </>
            },
            width: 214
          },
        ]}
      />
      <ChannelModel
        visible={visible}
      />
    </div>
  );
}

export default Right;

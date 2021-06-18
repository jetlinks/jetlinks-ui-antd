import React from 'react';
import { Table, Button, Input, Select, Badge, Switch } from 'antd';
import styles from './index.less';

function Cascade() {
  return (
    <div style={{ height: '100%', backgroundColor: '#fff', padding: 16 }}>
      <div className={styles.header}>
        <span>国标级联</span>
        <div>
          <Button type='primary'>新增国标级联</Button>
        </div>
      </div>
      <div>
        <Table
          columns={[
            {
              title: "级联信息",
              render: () => {
                return <>
                  <div>级联ID:</div>
                  <div>级联名称:</div>
                </>
              }
            }, {
              title: "上级SIP信息",
              render: () => {
                return <>
                  <div>名称:</div>
                  <div>SIP ID:</div>
                  <div>SIP域:</div>
                  <div>SIP HOST:</div>
                  <div>SIP PORT:</div>
                </>
              }
            }, {
              title: "本地SIP",
              render: () => {
                return <>
                  <div>SIP本地 ID:</div>
                  <div>SIP本地端口:</div>
                  <div>SIP本地地址:</div>
                </>
              }
            }, {
              title: "其它",
              render: () => {
                return <>
                  <div>注册时间(秒):</div>
                  <div>心跳周期(秒):</div>
                  <div>传输协议:</div>
                  <div>字符集:</div>
                </>
              }
            }, {
              title: "启用状态",
              render: () => {
                return <Switch />
              }
            }, {
              title: "连接状态",
              render: () => {
                return <Badge color="#87d068" title="在线" />
              }
            }, {
              title: "操作",
              render: () => {
                return <>
                  <Button type="link">编辑</Button>
                  <Button type="link">选择通道</Button>
                  <Button type="link">删除</Button>
                </>
              }
            }
          ]}
        />
      </div>
    </div>
  );
}

export default Cascade;

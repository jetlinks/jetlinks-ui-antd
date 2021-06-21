import React, { useState } from 'react';
import { Modal, Input, Radio, Button, InputNumber } from 'antd';
import Form from '@/components/BaseForm';
import IpInput from '@/components/BaseForm/IPInput'
import AliFont from '@/components/AliFont';
import ChannelModel from './channelModel';

interface CascadeProps {
  visible?: boolean
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}


function CascadeModel(props: CascadeProps) {
  const { onOk, ...extra } = props

  const [channelVisible, setChannelVisible] = useState(false)

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title={props.data ? '编辑国标级联' : '新增国标级联'}
      onOk={OnOk}
      {...extra}
      width='50vw'
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          column={2}
          data={props.data}
          items={[
            {
              title: '基本信息'
            },
            {
              name: 'test',
              label: '级联ID',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入级联ID' }],
              },
              render: () => {
                return <Input placeholder='请输入级联ID' />
              }
            },
            {
              name: 'test2',
              label: '通道ID',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入通道ID' }],
              },
              render: () => {
                return <Input placeholder='请输入通道ID' />
              }
            },
            {
              name: 'test3',
              label: '代理视频流',
              options: {

              },
              render: () => {
                return <Radio.Group buttonStyle='solid'>
                  <Radio.Button value={1}>启用</Radio.Button>
                  <Radio.Button value={2}>禁用</Radio.Button>
                </Radio.Group>
              }
            },
            {
              title: <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>上级SIP配置</span>
                <Button type='link' onClick={() => { setChannelVisible(true) }}>
                  <AliFont type='icon-huoquduixiang' />获取平台配置
                </Button>
              </div>
            },
            {
              name: 'test4',
              label: '名称',
              column: 2,
              required: true,
              options: {
                rules: [{ required: true, message: '请输入国标信令的名称' }],
              },
              render: () => {
                return <Input placeholder='请输入国标信令的名称' />
              }
            },
            {
              name: 'test5',
              label: 'SIP ID',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入平台侧的SIP ID' }],
              },
              render: () => {
                return <Input placeholder='请输入平台侧的SIP ID' />
              }
            },
            {
              name: 'test6',
              label: 'SIP域',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入SIP域' }],
              },
              render: () => {
                return <IpInput />
              }
            },
            {
              name: 'test7',
              label: 'SIP HOST',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入SIP HOST' }],
              },
              render: () => {
                return <IpInput />
              }
            },
            {
              name: 'test8',
              label: 'SIP PORT',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入平台侧SIP的端口' }],
              },
              render: () => {
                return <InputNumber placeholder='请输入平台侧SIP的端口' style={{ width: '100%' }} />
              }
            },
            {
              name: 'test9',
              label: '用户名',
              render: () => {
                return <Input placeholder='请输入联级名称' />
              }
            },
            {
              name: 'test10',
              label: '接入密码',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入平台侧的密码' }],
              },
              render: () => {
                return <Input placeholder='请输入平台侧的密码' />
              }
            },
            { title: '本地SIP配置' },
            {
              name: 'test11',
              label: 'SIP本地ID',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入网关侧的SIP ID' }],
              },
              render: () => {
                return <Input placeholder='请输入网关侧的SIP ID' />
              }
            },
            {
              name: 'test12',
              label: 'SIP本地地址',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入SIP HOST' }],
              },
              render: () => {
                return <IpInput />
              }
            },
            {
              name: 'test13',
              label: 'SIP本地端口',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入网关侧SIP的端口' }],
              },
              render: () => {
                return <InputNumber placeholder='请输入网关侧SIP的端口' style={{ width: '100%' }} />
              }
            },
            { title: '其他信息' },
            {
              name: 'test14',
              label: '注册间隔(秒)',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入注册间隔' }],
              },
              render: () => {
                return <InputNumber placeholder='请输入注册间隔' style={{ width: '100%' }} />
              }
            },
            {
              name: 'test15',
              label: '心跳周期',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入心跳周期' }],
              },
              render: () => {
                return <InputNumber placeholder='请输入心跳周期' style={{ width: '100%' }} />
              }
            },
            {
              name: 'test16',
              label: '传输协议',
              required: true,
              render: () => {
                return <Radio.Group buttonStyle='solid'>
                  <Radio.Button value='udp'>UDP</Radio.Button>
                  <Radio.Button value='tcp'>TCP</Radio.Button>
                </Radio.Group>
              }
            },
            {
              name: 'test17',
              label: '字符集',
              required: true,
              render: () => {
                return <Radio.Group buttonStyle='solid'>
                  <Radio.Button value='gb2312'>GB2312</Radio.Button>
                  <Radio.Button value='utf-8'>UTF-8</Radio.Button>
                </Radio.Group>
              }
            },
          ]}
        />
      </div>
      <ChannelModel
        visible={channelVisible}
      />
    </Modal>
  );
}

export default CascadeModel;

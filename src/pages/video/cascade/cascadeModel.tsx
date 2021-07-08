import React, { useState, useRef } from 'react';
import { Modal, Input, Radio, Button, InputNumber } from 'antd';
import Form from '@/components/BaseForm';
import IpInput from '@/components/BaseForm/IPInput'
import AliFont from '@/components/AliFont';

import { useRequest } from 'ahooks';
import { CascadeList, saveCascade } from '@/pages/edge-gateway/device/detail/video/cascade/service';
import { ApiResponse } from '@/services/response';

interface CascadeProps {
  visible?: boolean
  data?: CascadeList
  // id: string
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}


function CascadeModel(props: CascadeProps) {
  const { onOk, ...extra } = props


  const [defaultData] = useState({
    id: Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 17 - 1)),
    sipConfigs: [{
      transport: 'udp',
      charset: 'gb2312',
      port: '5060',
      registerInterval: '3600',
      keepaliveInterval: '60',
    }],
    proxyStream: false
  })
  const [items] = useState([
    {
      title: '基本信息'
    },
    {
      name: 'id',
      label: '级联ID',
      required: true,
      options: {
        // TODO 级联ID自动生成且不可更改
        rules: [
          { required: true, message: '请输入级联ID' },
          { max: 64, message: '级联ID不超过64个字符' },
          { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, "g"), message: '级联ID只能由数字、字母、下划线、中划线组成' }
        ],
      },
      render: () => {
        return <Input placeholder='请输入级联ID' readOnly />
      }
    },
    {
      name: 'name',
      label: '级联名称',
      required: true,
      options: {
        rules: [{ required: true, message: '请输入级联名称' }],
      },
      render: () => {
        return <Input placeholder='请输入级联名称' />
      }
    },
    {
      name: 'proxyStream',
      label: '代理视频流',

      render: () => {
        return <Radio.Group buttonStyle='solid'>
          <Radio.Button value={true}>启用</Radio.Button>
          <Radio.Button value={false}>禁用</Radio.Button>
        </Radio.Group>
      }
    },
    {
      title: <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>上级SIP配置</span>
        <Button type='link' onClick={() => { }}>
          <AliFont type='icon-huoquduixiang' />获取平台配置
        </Button>
      </div>
    },
    {
      name: 'sipConfigs[0].name',
      label: '名称',
      column: 2,
      required: true,
      options: {
        rules: [{ required: true, message: '请输入国标信令的名称' }, { max: 200, message: '名称不超过200个字符' }],
      },
      render: () => {
        return <Input placeholder='请输入国标信令的名称' />
      }
    },
    {
      name: 'sipConfigs[0].sipId',
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
      name: 'sipConfigs[0].domain',
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
      name: 'sipConfigs[0].remoteAddress',
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
      name: 'sipConfigs[0].remotePort',
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
      name: 'sipConfigs[0].user',
      label: '用户名',
      render: () => {
        return <Input placeholder='请输入联级名称' />
      }
    },
    {
      name: 'sipConfigs[0].password',
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
      name: 'sipConfigs[0].localSipId',
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
      name: 'sipConfigs[0].localAddress',
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
      name: 'sipConfigs[0].port',
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
      name: 'sipConfigs[0].registerInterval',
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
      name: 'sipConfigs[0].keepaliveInterval',
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
      name: 'sipConfigs[0].transport',
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
      name: 'sipConfigs[0].charset',
      label: '字符集',
      required: true,

      render: () => {
        return <Radio.Group buttonStyle='solid'>
          <Radio.Button value='gb2312'>GB2312</Radio.Button>
          <Radio.Button value='utf-8'>UTF-8</Radio.Button>
        </Radio.Group>
      }
    },
  ])
  const { loading, run } = useRequest<ApiResponse<any>>(saveCascade, {
    manual: true,
    onSuccess(result) {
      if (result.status === 200) {
        if (props.onOk) {
          props.onOk()
        }
      }
    }
  })

  const form: any = useRef(null)

  const OnOk = () => {
    // 提交数据
    form.current.validateFields((err: any, data: any) => {
      if (err) return
      if (props.data && props.data.id) {
        data.id = props.data.id
      }
      run('local', data)

    })
  }
  return (
    <Modal
      title={props.data && props.data.id ? '编辑国标级联' : '新增国标级联'}
      onOk={OnOk}
      confirmLoading={loading}
      {...extra}
      width='50vw'
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          column={2}
          ref={form}
          data={props.data || defaultData}
          items={items}
        />
      </div>

    </Modal>
  );
}

export default CascadeModel;

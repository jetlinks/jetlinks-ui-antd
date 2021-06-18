import React from 'react';
import { Modal, Input, InputNumber } from 'antd';
import Form from '@/components/BaseForm';
import IPInput from '@/components/BaseForm/IPInput';

interface AddDeviceProps {
  visible?: boolean
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function DeviceModel(props: AddDeviceProps) {
  const { onOk, ...extra } = props

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title='平台地址配置'
      onOk={OnOk}
      {...extra}
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          data={props.data}
          items={[
            {
              name: 'test',
              label: '名称',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入名称' }],
              },
              render: () => {
                return <Input placeholder='请输入名称' />
              }
            },
            {
              name: 'test2',
              label: '协议类型',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入协议类型' }],
              },
              render: () => {
                return <Input placeholder='请输入协议类型' />
              }
            },
            {
              name: 'test3',
              label: '端口',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入端口' }],
              },
              render: () => {
                return <InputNumber style={{ width: '100%' }} placeholder='请输入端口' />
              }
            },
            {
              name: 'test4',
              label: 'IP地址',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入IP地址' }],
              },
              render: () => {
                return <IPInput />
              }
            },
            {
              name: 'test5',
              label: '用户名',
              render: () => {
                return <Input placeholder='请输入用户名' />
              }
            },
            {
              name: 'test6',
              label: '密码',
              render: () => {
                return <Input.Password placeholder='请输入密码' />
              }
            },
            {
              name: 'test7',
              label: '说明',
              render: () => {
                return <Input.TextArea placeholder='说明' cols={3} />
              }
            },
          ]}
        />
      </div>
    </Modal>
  );
}

export default DeviceModel;

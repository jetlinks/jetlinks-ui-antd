import React from 'react';
import { Modal, Input } from 'antd';
import Form from '@/components/BaseForm';

interface ChannelProps {
  visible?: boolean
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function ChannelModel(props: ChannelProps) {

  const { onOk, ...extra } = props

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title='编辑通道'
      onOk={OnOk}
      {...extra}
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          data={props.data}
          items={[
            {
              name: 'test',
              label: '设备名称',
              render: () => {
                return <Input placeholder='请输入名称' />
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
              label: '通道名称',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入通道名称' }],
              },
              render: () => {
                return <Input placeholder='请输入通道名称' />
              }
            },
            {
              name: 'test4',
              label: '接入协议',
              render: () => {
                return <Input placeholder='请输入接入协议' />
              }
            }
          ]}
        />
      </div>
    </Modal>
  );
}

export default ChannelModel;

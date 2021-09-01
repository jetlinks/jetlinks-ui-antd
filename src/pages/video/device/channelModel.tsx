import React, { useRef } from 'react';
import { Modal, Input } from 'antd';
import Form from '@/components/BaseForm';
import { useRequest } from 'ahooks';
import { MediaDeviceList, saveChannel } from '@/pages/edge-gateway/device/service';

interface ChannelProps {
  visible?: boolean
  data?: MediaDeviceList
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  // edgeId?: string
}

function ChannelModel(props: ChannelProps) {

  const { onOk, ...extra } = props
  const { loading, run } = useRequest(saveChannel, {
    manual: true,
  })
  const form: any = useRef(null)

  const OnOk = () => {
    // 提交数据
    form.current.validateFields((err: any, values: any) => {
      if (err) return
      if (props.data && props.data.id) {
        values.id = props.data.id
      }
      run('local', values)
    })
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title='编辑通道'
      onOk={OnOk}
      confirmLoading={loading}
      {...extra}
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          data={props.data}
          ref={form}
          items={[
            {
              name: 'name',
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
              name: 'deviceName',
              label: '设备名称',
              render: () => {
                return <Input placeholder='请输入名称' readOnly={true} disabled />
              }
            },
            {
              name: 'channelId',
              label: '通道ID',
              render: () => {
                return <Input placeholder='请输入通道ID' disabled />
              }
            },
            {
              name: 'provider',
              label: '接入协议',
              render: () => {
                return <Input placeholder='请输入接入协议' readOnly={true} disabled />
              }
            }
          ]}
        />
      </div>
    </Modal>
  );
}

export default ChannelModel;

import React, { useRef } from 'react';
import Form from '@/components/BaseForm';
import Service from '../service';
import { Input, Modal } from 'antd';

interface AddressSettingProps {
  visible?: boolean
  data?: any
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 36 },
    sm: { span: 18 },
  },
};

const AddressSetting = (props: AddressSettingProps) => {
  const { onOk, ...extra } = props
  const form: any = useRef(null)
  const service = new Service('edge/network');

  const OnOk = () => {
    // 提交数据
    form.current.validateFields().then(async (data: any, err: any) => {
      if (err) return;
      service.editPlateInfo(data).subscribe(resp => {
        if (resp.status === 200) {
          if (props.onOk) {
            props.onOk()
          }
        }
      })
    })
  }


  return <>
    <Modal
      title='平台配置'
      onOk={OnOk}
      {...extra}
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          ref={form}
          {...formItemLayout}
          data={props.data}
          items={[
            {
              name: 'edgeName',
              label: '网关名称',
              options: {
                initialValue: props.data?.edgeName
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'geoAdder',
              label: '网关地理位置',
              options: {
                initialValue: props.data?.geoAdder
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'productId',
              label: '平台产品id',
              options: {
                initialValue: props.data?.productId
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'deviceId',
              label: '硬件id',
              options: {
                initialValue: props.data?.deviceId
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'secureId',
              label: '密钥ID',
              options: {
                initialValue: props.data?.secureId
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'secureKey',
              label: '密钥Key',
              options: {
                initialValue: props.data?.secureKey
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'host',
              label: '平台地址',
              options: {
                initialValue: props.data?.host
              },
              render: () => {
                return <Input />
              }
            },
            {
              name: 'port',
              label: '平台端口',
              options: {
                initialValue: props.data?.port
              },
              render: () => {
                return <Input />
              }
            }
          ]}
        />
      </div>
    </Modal>
  </>
}

export default AddressSetting
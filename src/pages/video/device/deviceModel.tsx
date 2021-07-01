import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, InputNumber, Select } from 'antd';
import Form from '@/components/BaseForm';
import IPInput from '@/components/BaseForm/IPInput';

interface AddDeviceProps {
  visible?: boolean
  data: any
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function DeviceModel(props: AddDeviceProps) {
  const { onOk, data, ...extra } = props
  const [formItems, setForemItems] = useState<any[]>([
    {
      name: 'name',
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
      name: 'provider',
      label: '协议类型',
      required: true,
      options: {
        rules: [{ required: true, message: '请输入协议类型' }],
      },
      render: () => {
        return <Select placeholder="请选择">
          <Select.Option value="onvif" key="onvif">ONVIF</Select.Option>
        </Select>
      }
    },

    {
      name: 'description',
      label: '说明',
      render: () => {
        return <Input.TextArea placeholder='说明' cols={3} />
      }
    },
  ])
  const [dataType, setDataType] = useState("");
  const form: any = useRef(null)

  const renderType = [
    {
      name: 'port',
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
      name: 'url',
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
      name: 'username',
      label: '用户名',
      render: () => {
        return <Input placeholder='请输入用户名' />
      }
    },
    {
      name: 'password',
      label: '密码',
      render: () => {
        return <Input.Password placeholder='请输入密码' />
      }
    },
  ]

  useEffect(() => {
    if (dataType === 'onvif') {
      setForemItems(formItems.concat(renderType))

    } else if (formItems.length > 3) {
      let _formItems = formItems
      _formItems.splice(1, _formItems.length - 2)
      setForemItems(_formItems)
    }
  }, [dataType])

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title={data.id ? "编辑视频设备" : '添加视频设备'}
      onOk={OnOk}
      {...extra}
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          data={props.data}
          items={formItems}
          ref={form}
          onValuesChange={(changeValue, allValues) => {
            console.log(changeValue, allValues);
            if (changeValue.provider) {
              // setDataType(changeValue.provider);
            }
          }}
        />
      </div>
    </Modal>
  );
}

export default DeviceModel;

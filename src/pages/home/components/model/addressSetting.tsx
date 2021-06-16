import React from 'react';
import { Modal, Input } from 'antd';
import Form from '@/components/BaseForm';

interface AddressSettingProps {
  visible?: boolean
  data?: object
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

  const onSearch = (value: string) => {
    console.log(value);
  }

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return <>
    <Modal
      title='平台地址配置'
      onOk={OnOk}
      {...extra}
    >
      <div style={{ overflow: 'hidden' }}>
        <Form
          {...formItemLayout}
          data={props.data}
          items={[
            {
              name: 'test',
              label: '平台地址',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入平台地址' }],
              },
              render: () => {
                return <Input.Search onSearch={onSearch} />
              }
            }
          ]}
        />
      </div>
    </Modal>
  </>
}

export default AddressSetting
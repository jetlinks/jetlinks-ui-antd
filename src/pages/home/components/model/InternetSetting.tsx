import React, { useState } from 'react';
import { Modal, Input, Switch, Radio } from 'antd';
import Form from '@/components/BaseForm';
import { RadioChangeEvent } from 'antd/lib/radio';
import IPInput from '@/components/BaseForm/IPInput';
interface InternetSettingProps {
  visible?: boolean
  title: string
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function InternetSetting(props: InternetSettingProps) {

  const { onOk, ...extra } = props
  const [hidden, setHidden] = useState(true)

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  const changeIPStatus = (e: RadioChangeEvent) => {
    setHidden(e.target.value === 1 ? true : false)
  }

  return <Modal
    onOk={OnOk}
    {...extra}
  >
    <div style={{ overflow: 'hidden' }}>
      <Form
        data={props.data}
        items={[
          {
            name: 'test',
            label: '启用网口配置',
            options: {
              valuePropName: 'checked',
            },
            render: () => {
              return <Switch />
            }
          },
          {
            name: 'test2',
            label: 'IP地址获取方式',
            render: () => {
              return <Radio.Group onChange={changeIPStatus}>
                <Radio value={1}>自动获取</Radio>
                <Radio value={2}>手动配置</Radio>
              </Radio.Group>
            }
          }
        ]}
      />
      <div style={{ padding: 10, backgroundColor: '#fafafa', overflow: 'hidden' }}>
        <Form
          data={props.data}
          onValuesChange={(changeValue, allValues) => {
            console.log(changeValue, allValues);
            if (changeValue.provider) {
              // setDataType(changeValue.provider);
            }
          }}
          items={[
            {
              name: 'test3',
              label: 'IP地址',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入IP地址' }],
              },
              render: () => {
                return <IPInput disabled={hidden} />
              }
            },
            {
              name: 'test4',
              label: '子网掩码',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入子网掩码' }],
              },
              render: () => {
                return <IPInput disabled={hidden} />
              }
            },
            {
              name: 'test5',
              label: '网关',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入网关' }],
              },
              render: () => {
                return <IPInput disabled={hidden} />
              }
            },
            {
              name: 'test6',
              label: '首选DNS服务器',
              render: () => {
                return <IPInput disabled={hidden} />
              }
            },
            {
              name: 'test7',
              label: '备用DNS服务器',
              render: () => {
                return <IPInput disabled={hidden} />
              }
            }
          ]}

        />
      </div>
    </div>
  </Modal>;
}

export default InternetSetting;

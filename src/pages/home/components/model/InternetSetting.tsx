import React, { useRef, useState } from 'react';
import { Modal, Input, Switch, Radio } from 'antd';
import Form from '@/components/BaseForm';
import { RadioChangeEvent } from 'antd/lib/radio';
import IPInput from '@/components/BaseForm/IPInput';
import Service from '../service';
import { useEffect } from 'react';
interface InternetSettingProps {
  visible?: boolean
  title: string
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function InternetSetting(props: InternetSettingProps) {

  const service = new Service('edge/network');
  const { onOk, ...extra } = props
  const [hidden, setHidden] = useState(props.data?.netWay === 'dhcp' ? true : false)
  const form: any = useRef(null)

  const OnOk = () => {
    if(hidden){
      service.saveNetworkConfiguration(
        {
          netWay: 'dhcp',
          // deviceId: 'local',
          ethName: props.data?.ethName,
          // ipAdd: props.data?.ipAdd,
          // mask: props.data?.mask,
          // gateWayAdd: props.data?.gateWayAdd,
        }
      ).subscribe(resp => {
        // 提交数据
        if(resp.status === 200){
          if (props.onOk) {
            props.onOk()
          }
        }
      })
    }else{
    form.current.validateFields().then(async (data: any, err: any) => {
      if (err) return;
      service.saveNetworkConfiguration(
        {
          deviceId: 'local',
          ethName: props.data?.ethName,
          ipAdd: data.ipAdd,
          mask: data.mask,
          gateWayAdd: data.gateWayAdd,
          netWay: 'static'
          // dns: data.dns
        }
      ).subscribe(resp => {
        if(resp.status === 200){
          if (props.onOk) {
            props.onOk()
          }
        }
      })
      })
    }
  }

  const changeIPStatus = (e: RadioChangeEvent) => {
    setHidden(e.target.value=== 'dhcp' ? true : false)
  }

  useEffect(() => {
    setHidden(props.data?.netWay === 'dhcp' ? true : false)
  }, [props.data])

  return <Modal
    onOk={OnOk}
    {...extra}
  >
    <div style={{ overflow: 'hidden' }}>
      <Form
        data={props.data}
        items={[
          // {
          //   name: 'test',
          //   label: '启用网口配置',
          //   options: {
          //     valuePropName: 'checked',
          //   },
          //   render: () => {
          //     return <Switch />
          //   }
          // },
          {
            name: 'netWay',
            label: 'IP地址获取方式',
            render: () => {
              return <Radio.Group onChange={changeIPStatus}>
                <Radio value={'dhcp'}>自动获取</Radio>
                <Radio value={'static'}>手动配置</Radio>
              </Radio.Group>
            }
          }
        ]}
      />
      <div style={{ padding: 10, backgroundColor: '#fafafa', overflow: 'hidden' }}>
        <Form
          data={props.data}
          ref={form}
          onValuesChange={(changeValue, allValues) => {
            if (changeValue.provider) {
              // setDataType(changeValue.provider);
            }
          }}
          items={[
            {
              name: 'ipAdd',
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
              name: 'mask',
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
              name: 'gateWayAdd',
              label: '网关',
              required: true,
              options: {
                rules: [{ required: true, message: '请输入网关' }],
              },
              render: () => {
                return <IPInput disabled={hidden} />
              }
            },
            // {
            //   name: 'dns',
            //   label: '首选DNS服务器',
            //   render: () => {
            //     return <IPInput disabled={hidden} />
            //   }
            // }
          ]}
        />
      </div>
    </div>
  </Modal>;
}

export default InternetSetting;

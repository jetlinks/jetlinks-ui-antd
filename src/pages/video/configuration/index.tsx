import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Radio } from 'antd';
import styles from './index.less';
import Form from '@/components/BaseForm';
import IPInput from '@/components/BaseForm/IPInput';
import { useRequest } from 'ahooks';
import { getGBInfo, saveGBInfo } from '@/pages/edge-gateway/device/detail/video/cascade/service'
function Configuration() {

  const [isEdit, setIsEdit] = useState(false)

  const { data, run } = useRequest(getGBInfo, {
    manual: true,
  })

  const { run: SaveData } = useRequest(saveGBInfo, {
    manual: true,
  })

  const form: any = useRef(null)

  useEffect(() => {
    run()
  }, [])

  const submit = () => {
    form.current.validateFields().then(async (err: any, data: any) => {
      if (err) return;
      const res = await SaveData(data)
      if (res.status === 200) {
        setIsEdit(false)
      }
    })
  }

  return (
    <div className={styles.configuration}>
      <div className={styles.header}>
        国标配置
      </div>
      <div className={styles.form} style={{}}>
        <Form
          column={2}
          data={data || {
            configuration: {
              charset: ''
            }
          }}
          ref={form}
          items={[
            {
              name: 'name',
              label: '信令名称',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入信令名称' disabled={!isEdit} />,
              column: 2
            },
            {
              name: 'configuration.sipId',
              label: 'SIP ID',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP ID' disabled={!isEdit} />,
            },
            {
              name: 'configuration.domain',
              label: 'SIP域',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP域' disabled={!isEdit} />,
            },
            {
              name: 'configuration.localAddress',
              label: 'SIP HOST',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <IPInput disabled={!isEdit} />,
            },
            {
              name: 'configuration.password',
              label: '接入密码',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入接入密码' disabled={!isEdit} />,
            },
            {
              name: 'configuration.port',
              label: '端口',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入端口' disabled={!isEdit} />,
            },
            {
              name: 'configuration.charset',
              label: '字符集',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Radio.Group buttonStyle="solid" disabled={!isEdit}>
                <Radio.Button value='gb2312'>GB2312</Radio.Button>
                <Radio.Button value='utf-8'>UTF-8</Radio.Button>
              </Radio.Group>,
            },
            {
              name: 'test8',
              label: '说明',
              render: () => <Input.TextArea placeholder='请输入至少5个字符' rows={3} disabled={!isEdit} />,
              column: 2
            },

          ]}
        />

      </div>

      <div className={styles.tool}>
        {
          !isEdit ?
            <Button type="primary" onClick={() => {
              setIsEdit(true)
            }}>编辑</Button> :
            <>
              <Button style={{ marginRight: 12 }} onClick={() => { setIsEdit(false) }}>取消</Button>
              <Button type="primary" onClick={submit}>保存</Button>
            </>
        }
      </div>
    </div>
  );
}

export default Configuration;

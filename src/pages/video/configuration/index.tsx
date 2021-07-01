import React, { useState, useRef } from 'react';
import { Button, Input, Radio } from 'antd';
import styles from './index.less';
import Form from '@/components/BaseForm';
import IPInput from '@/components/BaseForm/IPInput';
import { CascadeDisabled, CascadeEnabled, CascadeList, getCascadeList, removeCascade } from '@/pages/edge-gateway/device/detail/video/cascade/service';
import { useRequest } from 'ahooks';

function Configuration() {

  const [data, setData] = useState({
    test7: 1
  })

  const [isEdit, setIsEdit] = useState(false)

  // const {data, run: DetailRun} = useRequest()

  const form: any = useRef(null)


  return (
    <div className={styles.configuration}>
      <div className={styles.header}>
        国标配置
      </div>
      <div className={styles.form} style={{}}>
        <Form
          column={2}
          data={data}
          ref={form}
          items={[
            {
              name: 'test1',
              label: '信令名称',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入信令名称' disabled={!isEdit} />,
              column: 2
            },
            {
              name: 'test2',
              label: 'SIP ID',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP ID' disabled={!isEdit} />,
            },
            {
              name: 'test3',
              label: 'SIP域',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP域' disabled={!isEdit} />,
            },
            {
              name: 'test4',
              label: 'SIP HOST',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <IPInput disabled={!isEdit} />,
            },
            {
              name: 'test5',
              label: '接入密码',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入接入密码' disabled={!isEdit} />,
            },
            {
              name: 'test6',
              label: '端口',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入端口' disabled={!isEdit} />,
            },
            {
              name: 'test7',
              label: '字符集',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Radio.Group buttonStyle="solid" disabled={!isEdit}>
                <Radio.Button value={1}>GB2312</Radio.Button>
                <Radio.Button value={2}>UTF-8</Radio.Button>
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
              <Button type="primary" onClick={() => {
                console.log(form);
                setIsEdit(false)
                form.current.validateFields()
              }}>保存</Button>
            </>
        }
      </div>
    </div>
  );
}

export default Configuration;

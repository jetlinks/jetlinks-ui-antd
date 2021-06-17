import React, { useState } from 'react';
import { Button, Input, Radio } from 'antd';
import styles from './index.less';
import Form from '@/components/BaseForm';

function Configuration() {
  const [data, setData] = useState({
    test7: 1
  })
  return (
    <div>
      <div className={styles.header}>
        国标配置
      </div>
      <div className={styles.form} style={{}}>
        <Form
          column={2}
          data={data}
          items={[
            {
              name: 'test1',
              label: '信令名称',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入信令名称' />,
              column: 2
            },
            {
              name: 'test2',
              label: 'SIP ID',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP ID' />,
            },
            {
              name: 'test3',
              label: 'SIP域',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP域' />,
            },
            {
              name: 'test4',
              label: 'SIP HOST',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入SIP HOST' />,
            },
            {
              name: 'test5',
              label: '接入密码',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入接入密码' />,
            },
            {
              name: 'test6',
              label: '端口',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Input placeholder='请输入端口' />,
            },
            {
              name: 'test7',
              label: '字符集',
              required: true,
              options: {
                rules: [{ required: true, message: '' }]
              },
              render: () => <Radio.Group buttonStyle="solid">
                <Radio.Button value={1}>GB2312</Radio.Button>
                <Radio.Button value={2}>UTF-8</Radio.Button>
              </Radio.Group>,
            },
            {
              name: 'test8',
              label: '说明',
              render: () => <Input.TextArea placeholder='请输入至少5个字符' rows={3} />,
              column: 2
            },

          ]}
        />

      </div>

      <div className={styles.tool}>
        <Button style={{ marginRight: 12 }}>取消</Button>
        <Button type="primary">保存</Button>
      </div>
    </div>
  );
}

export default Configuration;

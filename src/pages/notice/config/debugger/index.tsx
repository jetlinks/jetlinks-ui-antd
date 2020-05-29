import { Modal, Form, Select, Input, message } from 'antd';

import React, { useEffect, useState } from 'react';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props {
  close: Function;
  data: any;
}
interface State {
  configList: any[];
  context: any;
  configId: string;
}
const Debug: React.FC<Props> = props => {
  const initState: State = {
    configList: [],
    context: '',
    configId: '',
  };
  const [configList, setConfigList] = useState(initState.configList);
  const [context, setContext] = useState(initState.context);
  const [configId, setConfigId] = useState(initState.configId);
  const { data } = props;

  useEffect(() => {
    apis.notifier
      .template(
        encodeQueryParam({
          paging: false,
          terms: {
            type: data.type,
            provider: data.provider,
          },
        }),
      )
      .then(res => {
        setConfigList(res.result?.data);
      })
      .catch(() => { });
  }, []);

  const start = () => {
    if (configId) {
      apis.notifier
        .debugTemplate(data.id, {
          template: configList.find(i => i.id === configId),
          context: JSON.parse(context || '{}'),
        })
        .then((response: any) => {
          if (response.status === 200) {
            message.success('发送成功');
          }
        });
    } else {
      message.error('请选择通知配置！');
    }
  };
  return (
    <Modal
      visible
      title="调试通知模版"
      okText="发送"
      width={640}
      onOk={() => {
        start();
      }}
      onCancel={() => {
        props.close();
      }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="通知配置">
          <Select value={configId} onChange={(e: string) => setConfigId(e)}>
            {configList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="变量">
          <Input.TextArea
            rows={3}
            onChange={e => {
              setContext(e.target.value);
            }}
            value={context}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Debug;

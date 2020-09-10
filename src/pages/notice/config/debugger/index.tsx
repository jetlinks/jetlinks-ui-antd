import {Modal, Form, Select, Input, message, Spin} from 'antd';

import React, {useEffect, useState} from 'react';
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
  const [loading, setLoading] = useState(false);
  const {data} = props;

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
      .catch(() => {
      });
  }, []);

  const start = () => {
    if (configId) {
      apis.notifier
        .debugTemplate(data.id, {
          template: configList.find(i => i.id === configId),
          context: JSON.parse(context || '{}'),
        })
        .then(res => {
          setLoading(false);
          if (res.status === 200) {
            message.success('发送成功');
          }
        }).catch(() => {
        message.error('系统错误');
        setLoading(false);
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
        setLoading(true);
        start();
      }}
      onCancel={() => {
        props.close();
      }}
    >
      <Spin spinning={loading}>
        <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
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
      </Spin>
    </Modal>
  );
};
export default Debug;

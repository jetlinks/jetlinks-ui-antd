import { Form } from 'antd';
import NotifyType from './components/notifyType';
import { useEffect, useState } from 'react';
import { queryMessageType } from '@/pages/rule-engine/Scene/Save/action/service';

export default () => {
  const [form] = Form.useForm();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    queryMessageType().then((resp) => {
      if (resp.status === 200) {
        setList(resp.result);
      }
    });
  }, []);

  return (
    <Form form={form} layout={'vertical'}>
      <Form.Item
        name="notifyType"
        label="应用"
        required
        rules={[{ required: true, message: '请选择类型' }]}
      >
        <NotifyType options={list} />
      </Form.Item>
    </Form>
  );
};

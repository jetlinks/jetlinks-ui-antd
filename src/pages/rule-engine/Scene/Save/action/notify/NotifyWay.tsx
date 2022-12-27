import { Form, Spin } from 'antd';
import NotifyType from './components/notifyType';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { queryMessageType } from '@/pages/rule-engine/Scene/Save/action/service';

interface NotifyWayProps {
  value: string | undefined;
}
export default forwardRef((props: NotifyWayProps, ref) => {
  const [form] = Form.useForm();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    queryMessageType().then((resp) => {
      if (resp.status === 200) {
        setList(resp.result);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (props.value) {
      form.setFieldsValue({
        notifyType: props.value || '',
      });
    }
  }, [props.value]);

  const getValue = () => {
    return new Promise(async (resolve) => {
      const formData = await form.validateFields().catch(() => {
        resolve(false);
      });
      if (formData?.notifyType) {
        resolve(formData?.notifyType);
      } else {
        resolve(false);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    save: getValue,
  }));

  return (
    <Spin spinning={loading}>
      <Form form={form} layout={'vertical'}>
        <Form.Item
          name="notifyType"
          label="应用"
          required
          rules={[{ required: true, message: '请选择通知方式' }]}
        >
          <NotifyType options={list} />
        </Form.Item>
      </Form>
    </Spin>
  );
});

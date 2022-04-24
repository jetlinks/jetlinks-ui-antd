import { service } from '@/pages/rule-engine/Alarm/Log';
import { Form, Input, message, Modal } from 'antd';

interface Props {
  close: () => void;
  reload: () => void;
  data: Partial<AlarmLogItem>;
}

const SolveComponent = (props: Props) => {
  const { data } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      title="告警处理"
      visible
      onOk={form.submit}
      onCancel={() => {
        props.close();
      }}
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={async (values: any) => {
          const resp = await service.handleLog(data?.id || '', {
            describe: values.describe,
            type: 'user',
            state: 'normal',
          });
          if (resp.status === 200) {
            message.success('操作成功！');
            props.reload();
          } else {
            message.error('操作失败！');
          }
        }}
      >
        <Form.Item
          label="处理结果"
          name="describe"
          rules={[{ required: true, message: '请输入处理结果!' }]}
        >
          <Input.TextArea showCount maxLength={200} rows={8} placeholder="请输入处理结果" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SolveComponent;

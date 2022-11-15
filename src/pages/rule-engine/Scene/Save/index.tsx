import { Modal } from '@/components';
import { Form, Input } from 'antd';
import TriggerWay from '@/pages/rule-engine/Scene/Save/components/TriggerWay';
interface Props {
  close: () => void;
}

export default (props: Props) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={'新增'}
      maskClosable={false}
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        const values = await form.validateFields();
        console.log(values);
      }}
      width={700}
    >
      <Form name="scene-save" layout={'vertical'} form={form} autoComplete="off">
        <Form.Item
          name={'name'}
          label={'名称'}
          rules={[
            { required: true, message: '请输入名称' },
            {
              max: 64,
              message: '最多输入64个字符',
            },
          ]}
        >
          <Input placeholder={'请输入名称'} />
        </Form.Item>
        <Form.Item
          label={'触发方式'}
          name={['trigger', 'type']}
          rules={[{ required: true, message: '请选择触发方式' }]}
          initialValue={'device'}
        >
          <TriggerWay
            onSelect={(val) => {
              console.log(val);
            }}
            disabled={false}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

import { Form } from 'antd';
import TopCard from './TopCard';

const TypeList = [
  {
    label: '自定义',
    value: 'custom',
    image: require('/public/images/scene/device-custom.png'),
    tip: '自定义选择当前产品下的任意设备',
  },
  {
    label: '全部',
    value: 'all',
    image: require('/public/images/scene/trigger-device-all.png'),
    tip: '产品下的所有设备',
  },
  {
    label: '按组织',
    value: 'org',
    image: require('/public/images/scene/trigger-device-org.png'),
    tip: '选择产品下归属于具体组织的设备',
  },
];

export default () => {
  const [form] = Form.useForm();

  return (
    <div>
      <Form form={form} layout={'vertical'}>
        <Form.Item name="type" label="触发类型" required>
          <TopCard typeList={TypeList} />
        </Form.Item>
      </Form>
    </div>
  );
};

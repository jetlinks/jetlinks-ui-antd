import { useEffect } from 'react';
import { observer } from '@formily/reactive-react';
import { Form } from 'antd';
import TopCard from './TopCard';
import { DeviceModel } from './addModel';
import DeviceList from './deviceList';
import OrgList from './org';

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

export default observer(() => {
  const [form] = Form.useForm();

  const selector = Form.useWatch('type', form);

  useEffect(() => {
    form.setFieldsValue({ type: DeviceModel.selector });
  }, [DeviceModel.selector]);

  const contentRender = (type?: string) => {
    switch (type) {
      case 'custom':
        return <DeviceList />;
      case 'org':
        return <OrgList />;
      default:
        return <></>;
    }
  };

  return (
    <div>
      <Form form={form} layout={'vertical'}>
        <Form.Item name="selector" label="选择方式" required>
          <TopCard typeList={TypeList} />
        </Form.Item>
      </Form>
      {contentRender(selector)}
    </div>
  );
});

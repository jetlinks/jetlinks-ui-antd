import { observer } from '@formily/reactive-react';
import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import ReadProperty from '../../device/readProperty';
import TopCard from '../device/TopCard';
import DeviceModel from '../model';
import WriteProperty from './WriteProperty';

interface Props {
  get: (data: any) => void;
}

export default observer((props: Props) => {
  const [form] = Form.useForm();
  const [deviceMessageType, setDeviceMessageType] = useState('WRITE_PROPERTY');
  const [properties, setProperties] = useState([]); // 物模型-属性
  const [propertiesId, setPropertiesId] = useState<string | undefined>(''); // 物模型-属性ID,用于串行

  const TypeList = [
    {
      label: '功能调用',
      value: 'INVOKE_FUNCTION',
      image: require('/public/images/scene/invoke-function.png'),
      tip: '-',
    },
    {
      label: '读取属性',
      value: 'READ_PROPERTY',
      image: require('/public/images/scene/read-property.png'),
      tip: '-',
    },
    {
      label: '设置属性',
      value: 'WRITE_PROPERTY',
      image: require('/public/images/scene/write-property.png'),
      tip: '-',
    },
  ];

  useEffect(() => {
    if (DeviceModel.productDetail) {
      const metadata = JSON.parse(DeviceModel.productDetail?.metadata || '{}');
      setProperties(metadata.properties);
    }
  }, [DeviceModel.productDetail]);

  useEffect(() => {
    props.get(form);
    console.log(propertiesId);
  }, [form]);

  return (
    <div>
      <Form form={form} layout={'vertical'}>
        <Form.Item name="messageType" label="动作类型" required>
          <TopCard
            typeList={TypeList}
            onChange={(value: string) => {
              setDeviceMessageType(value);
            }}
          />
        </Form.Item>
        {deviceMessageType === 'INVOKE_FUNCTION' && (
          <Form.Item name={['device', 'message', 'inputs']} label="功能调用" required>
            <Select></Select>
          </Form.Item>
        )}
        {deviceMessageType === 'READ_PROPERTY' && (
          <Form.Item
            name={['device', 'message', 'properties']}
            label="读取属性"
            rules={[{ required: true, message: '请选择读取属性' }]}
          >
            <ReadProperty properties={properties} propertiesChange={setPropertiesId} />
          </Form.Item>
        )}
        {deviceMessageType === 'WRITE_PROPERTY' && <WriteProperty properties={properties} />}
      </Form>
    </div>
  );
});

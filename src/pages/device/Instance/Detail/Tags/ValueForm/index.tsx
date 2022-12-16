import { DatePicker, Input, InputNumber, Select } from 'antd';
import { GeoPoint, MetadataJsonInput } from '@/components';

type ValueFormProps = {
  value: any;
  data: any;
  onChange: () => void;
};

const ValueForm = (props: ValueFormProps) => {
  const { data } = props;
  const getItemNode = (record: any) => {
    const type = record.type;

    switch (type) {
      case 'enum':
        return (
          <Select
            style={{ width: '100%', textAlign: 'left' }}
            options={record.options}
            fieldNames={{ label: 'text', value: 'value' }}
            placeholder={'请选择' + name}
          />
        );
      case 'boolean':
        return (
          <Select
            style={{ width: '100%', textAlign: 'left' }}
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
            placeholder={'请选择' + name}
          />
        );
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return <InputNumber style={{ width: '100%' }} placeholder={'请输入' + name} />;
      case 'geoPoint':
        return <GeoPoint />;
      case 'object':
        return <MetadataJsonInput json={record.json} />;
      case 'date':
        return (
          // @ts-ignore
          <DatePicker format={'YYYY-MM-DD HH:mm:ss'} style={{ width: '100%' }} showTime />
        );
      default:
        return <Input placeholder={type === 'array' ? '多个数据用英文,分割' : '请输入' + name} />;
    }
  };

  return getItemNode(data);
};

export default ValueForm;

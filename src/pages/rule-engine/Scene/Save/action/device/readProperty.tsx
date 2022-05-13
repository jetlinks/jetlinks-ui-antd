import { Select } from 'antd';

interface ReadPropertyProps {
  properties: any[];
  value?: any;
  onChange?: (value?: any) => void;
}

export default (props: ReadPropertyProps) => {
  return (
    <Select
      value={props.value ? props.value[0] : undefined}
      options={props.properties.filter((item) => {
        if (item.expands && item.expands.type) {
          return item.expands.type.includes('read');
        }
        return false;
      })}
      fieldNames={{ label: 'name', value: 'id' }}
      style={{ width: '100%' }}
      onSelect={(key: any) => {
        if (props.onChange) {
          props.onChange([key]);
        }
      }}
      placeholder={'请选择属性'}
    ></Select>
  );
};

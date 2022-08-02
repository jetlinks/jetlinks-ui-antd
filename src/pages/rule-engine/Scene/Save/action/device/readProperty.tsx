import { Select } from 'antd';

interface ReadPropertyProps {
  properties: any[];
  value?: any;
  onChange?: (value?: any) => void;
  propertiesChange?: (value?: string) => void;
  id?: string;
}

export default (props: ReadPropertyProps) => {
  return (
    <Select
      id={props.id}
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
          props.propertiesChange?.(key);
        }
      }}
      placeholder={'请选择属性'}
    ></Select>
  );
};

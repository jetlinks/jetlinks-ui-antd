import { Select } from 'antd';

interface ReadPropertyProps {
  properties: any[];
  value?: any;
  onChange?: (value?: any, text?: any) => void;
  propertiesChange?: (value?: string) => void;
  id?: string;
}

export default (props: ReadPropertyProps) => {
  return (
    <Select
      id={props.id}
      value={props.value ? props.value[0] : undefined}
      options={props.properties?.filter((item) => {
        if (item.expands && item.expands.type) {
          return item.expands.type.includes('read');
        }
        return false;
      })}
      fieldNames={{ label: 'name', value: 'id' }}
      filterOption={(input: string, option: any) =>
        option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      showSearch
      allowClear
      style={{ width: '100%' }}
      onSelect={(key: any, option: any) => {
        // console.log(key,option)
        if (props.onChange) {
          props.onChange([key], option.name);
          props.propertiesChange?.(key);
        }
      }}
      placeholder={'请选择属性'}
    ></Select>
  );
};

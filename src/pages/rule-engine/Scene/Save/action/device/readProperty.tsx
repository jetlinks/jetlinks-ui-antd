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
      options={props.properties}
      fieldNames={{ label: 'name', value: 'id' }}
      style={{ width: 120 }}
      onSelect={(key: any) => {
        if (props.onChange) {
          props.onChange([key]);
        }
      }}
      placeholder={'请选择属性'}
    ></Select>
  );
};

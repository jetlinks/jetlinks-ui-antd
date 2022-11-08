import { Space, Select, Checkbox, SelectProps } from 'antd';
import { useState } from 'react';
import { ArrayItems } from '@formily/antd';
interface Props extends SelectProps {
  value: any;
  onChange: (data: any) => void;
  placeholder?: string;
  options: any[];
}
export default (props: Props) => {
  const { onChange, ...extra } = props;
  const [edit, setEdit] = useState<boolean>(true);
  const index = ArrayItems.useIndex!();
  return (
    <Space>
      <Select
        style={{ minWidth: 170 }}
        placeholder={props.placeholder}
        {...extra}
        onChange={(val) => {
          props.onChange(val);
        }}
      >
        {props.options.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
      {index > 0 && (
        <Checkbox
          style={{ width: 60 }}
          onChange={() => {
            setEdit(!edit);
          }}
          checked={edit}
        >
          同上
        </Checkbox>
      )}
    </Space>
  );
};

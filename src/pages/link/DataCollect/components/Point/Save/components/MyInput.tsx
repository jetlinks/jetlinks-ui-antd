import { Space, InputNumber, Checkbox } from 'antd';
import { useState } from 'react';
import { ArrayItems } from '@formily/antd';

interface Props {
  value: any;
  onChange: (data: any) => void;
  placeholder?: string;
}
export default (props: Props) => {
  const index = ArrayItems.useIndex!();
  const [edit, setEdit] = useState<boolean>(index > 0);
  return (
    <Space>
      <InputNumber
        style={{ width: 150 }}
        defaultValue={3000}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(val) => {
          props.onChange(val);
        }}
        readOnly={edit}
        addonAfter={'毫秒'}
      />
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

import { Space, InputNumber, Checkbox } from 'antd';
import { ArrayItems } from '@formily/antd';
import { useForm } from '@formily/react';

interface Props {
  value: any;
  onChange: (data: any) => void;
  placeholder?: string;
}
export default (props: Props) => {
  const index = ArrayItems.useIndex!();
  const form = useForm();
  const list = form.getState().values?.array || [];
  return (
    <Space>
      <InputNumber
        style={{ width: 120 }}
        defaultValue={3000}
        placeholder={props.placeholder}
        value={props.value?.value}
        stringMode={true}
        onChange={(val) => {
          props.onChange({
            ...props.value,
            value: val,
          });
        }}
        disabled={index > 0 && props.value?.check}
        addonAfter={'毫秒'}
      />
      {index > 0 && (
        <Checkbox
          style={{ width: 60 }}
          onChange={(e) => {
            if (e.target.checked) {
              const item = list[index - 1];
              props.onChange({
                check: e.target.checked,
                value: item?.configuration?.interval?.value,
              });
            } else {
              props.onChange({
                ...props.value,
                check: e.target.checked,
              });
            }
          }}
          checked={props.value?.check}
        >
          同上
        </Checkbox>
      )}
    </Space>
  );
};

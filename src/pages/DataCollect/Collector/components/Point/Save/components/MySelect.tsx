import { Space, Select, Checkbox, SelectProps } from 'antd';
import { ArrayItems } from '@formily/antd';
import { useForm, useField } from '@formily/react';
interface Props extends SelectProps {
  value: any;
  onChange: (data: any) => void;
  placeholder?: string;
  options: any[];
}
export default (props: Props) => {
  const { onChange, ...extra } = props;
  const form = useForm();
  const self = useField();
  const list = form.getState().values?.array || [];
  const index = ArrayItems.useIndex!();
  return (
    <Space>
      <Select
        style={{ minWidth: 150 }}
        placeholder={props.placeholder}
        {...extra}
        value={props.value?.value}
        onChange={(val) => {
          props.onChange({
            ...props.value,
            value: val,
          });
        }}
        disabled={index > 0 && props.value?.check}
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
          onChange={(e) => {
            if (e.target.checked) {
              const item = list[index - 1];
              const str = String(self.props?.name);
              props.onChange({
                check: e.target.checked,
                value: item[str].value,
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

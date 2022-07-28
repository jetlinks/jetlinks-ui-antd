import { Checkbox, InputNumber, Space, DatePicker, Input } from 'antd';
import moment from 'moment';

interface Props {
  value: any;
  type: any;
  onChange: (value: any) => void;
}

const FIndicators = (props: Props) => {
  const { value, onChange, type } = props;
  const DatePicker1: any = DatePicker;

  const renderComponent = () => {
    if (['int', 'long', 'double', 'float'].includes(type)) {
      return (
        <>
          <InputNumber
            value={value?.value ? value?.value[0] : ''}
            onChange={(val) => {
              if (value?.range) {
                onChange({
                  ...value,
                  value: [val > value?.value[1] ? value?.value[0] : val, value?.value[1] || ''],
                });
              } else {
                onChange({
                  ...value,
                  value: [val],
                });
              }
            }}
          />
          {value.range && (
            <>
              ~
              <InputNumber
                value={value?.value ? value?.value[1] : ''}
                onChange={(val) => {
                  onChange({
                    ...value,
                    value: [value?.value[0], val > value?.value[0] ? val : value?.value[1]],
                  });
                }}
              />
            </>
          )}
        </>
      );
    } else if (type === 'date') {
      if (value.range) {
        return (
          <DatePicker1.RangePicker
            allowClear={false}
            showTime
            value={
              value?.value && [
                !!value?.value[0] && moment(value.value[0], 'YYYY-MM-DD HH:mm:ss'),
                !!value?.value[1] && moment(value.value[1], 'YYYY-MM-DD HH:mm:ss'),
              ]
            }
            onChange={(_: any, date: string[]) => {
              onChange({
                ...value,
                value: [...date],
              });
            }}
          />
        );
      } else {
        return (
          <DatePicker1
            showTime
            allowClear={false}
            value={value?.value ? moment(value.value[0], 'YYYY-MM-DD HH:mm:ss') : ''}
            onChange={(_: any, date: string) => {
              onChange({
                ...value,
                value: [date],
              });
            }}
          />
        );
      }
    } else {
      return (
        <>
          <Input
            value={value?.value ? value?.value[0] : ''}
            onChange={(val) => {
              onChange({
                ...value,
                value: [val, value?.value && value?.value[1]],
              });
            }}
          />
          {value.range && (
            <>
              ~
              <Input
                value={value?.value ? value?.value[1] : ''}
                onChange={(val) => {
                  onChange({
                    ...value,
                    value: [value?.value && value?.value[0], val],
                  });
                }}
              />
            </>
          )}
        </>
      );
    }
  };
  return (
    <Space align="baseline">
      {renderComponent()}
      <Checkbox
        style={{ minWidth: 60 }}
        checked={value?.range}
        onChange={(e) => {
          onChange({
            ...value,
            value: e.target.checked ? [undefined, undefined] : [undefined],
            range: e.target.checked,
          });
        }}
      >
        范围
      </Checkbox>
    </Space>
  );
};
export default FIndicators;

import { TimePicker } from 'antd';
import moment from 'moment';
import type { FormInstance } from 'antd';

type RangePickerValue = {
  from: string;
  to: string;
  every?: number;
  unit?: string;
};

interface RangePickerProps {
  value?: RangePickerValue;
  onChange?: (value: RangePickerValue) => void;
  id?: string;
  form?: FormInstance<any>;
  name: (string | number)[];
}
export default (props: RangePickerProps) => {
  return (
    <TimePicker.RangePicker
      id={props.id}
      style={{ width: '100%' }}
      format={'HH:mm:ss'}
      value={[
        moment(props.value?.from || new Date(), 'HH:mm:ss'),
        moment(props.value?.to || new Date(), 'hh:mm:ss'),
      ]}
      onChange={(_, dateString) => {
        if (props.onChange) {
          const { every, unit } = props.form?.getFieldValue([...props.name]);
          console.log(every, unit);
          props.onChange({
            from: dateString[0],
            to: dateString[1],
            every: every,
            unit: unit,
          });
        }
      }}
    />
  );
};

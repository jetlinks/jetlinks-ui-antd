import { TimePicker } from 'antd';
import moment from 'moment';

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
  form?: any;
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
          if (props.form.getFieldsValue().trigger.type === 'timer') {
            const { every, unit } = props.form.getFieldsValue().trigger?.timer?.period;
            props.onChange({
              from: dateString[0],
              to: dateString[1],
              every: every,
              unit: unit,
            });
          } else {
            const { every, unit } =
              props.form.getFieldsValue().trigger?.device?.operation?.timer?.period;
            props.onChange({
              from: dateString[0],
              to: dateString[1],
              every: every,
              unit: unit,
            });
          }
        }
      }}
    />
  );
};

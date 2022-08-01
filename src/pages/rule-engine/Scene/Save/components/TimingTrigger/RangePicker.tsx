import { TimePicker } from 'antd';
import moment from 'moment';

type RangePickerValue = {
  from: string;
  to: string;
};

interface RangePickerProps {
  value?: RangePickerValue;
  onChange?: (value: RangePickerValue) => void;
  id?: string;
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
          props.onChange({
            from: dateString[0],
            to: dateString[1],
          });
        }
      }}
    />
  );
};

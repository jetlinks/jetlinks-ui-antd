import { TimePicker } from 'antd';
import moment from 'moment';

type TimePickerValue = {
  time: string;
};

interface TimePickerProps {
  value?: TimePickerValue;
  onChange?: (value: TimePickerValue) => void;
}
export default (props: TimePickerProps) => {
  return (
    <TimePicker
      style={{ width: '100%' }}
      format={'HH:mm:ss'}
      value={moment(props.value?.time || new Date(), 'HH:mm:ss')}
      onChange={(_, dateString) => {
        if (props.onChange) {
          props.onChange({
            time: dateString,
          });
        }
      }}
    />
  );
};

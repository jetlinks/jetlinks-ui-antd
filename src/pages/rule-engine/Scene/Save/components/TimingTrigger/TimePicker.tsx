import { TimePicker } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

type TimePickerValue = {
  time: string;
};

interface TimePickerProps {
  value?: TimePickerValue;
  onChange?: (value: TimePickerValue) => void;
  id?: string;
}
export default (props: TimePickerProps) => {
  const [value, setValue] = useState<any>(moment(new Date(), 'HH:mm:ss'));

  useEffect(() => {
    if (props.value?.time) {
      if (moment.isMoment(props.value?.time)) {
        setValue(props.value?.time);
      } else {
        setValue(moment(props.value?.time, 'HH:mm:ss'));
      }
    }
  }, [props.value?.time]);

  return (
    <TimePicker
      id={props.id}
      style={{ width: '100%' }}
      format={'HH:mm:ss'}
      value={moment(value || new Date(), 'HH:mm:ss')}
      onChange={(_v, dateString) => {
        setValue(_v);
        if (props.onChange) {
          props.onChange({
            time: dateString,
          });
        }
      }}
    />
  );
};

import { TimePicker, DatePicker } from 'antd';
import type { TimePickerProps } from 'antd/lib/time-picker';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface DatePickerFormat extends Omit<TimePickerProps, 'onChange'> {
  onChange?: (dateString: string, date: moment.Moment | null) => void;
}
type Props = DatePickerFormat & {
  type?: string;
};

export default (props: Props) => {
  const [myValue, setMyValue] = useState<any>(props.value || undefined);

  useEffect(() => {
    setMyValue(props.value);
    console.log('moment', props.value);
  }, [props.value]);

  return (
    <div>
      {props.type === 'time' ? (
        <div>
          <TimePicker
            // {...props}
            // value={myValue}
            value={myValue ? moment(myValue, 'HH:mm:ss') : null}
            onChange={(value, timeString) => {
              setMyValue(value);
              props.onChange?.(timeString, value);
            }}
            // @ts-ignore
            getPopupContainer={(trigger) => {
              return trigger && trigger?.parentNode ? trigger.parentNode : document.body;
            }}
          />
        </div>
      ) : (
        <div>
          {/* @ts-ignore */}
          <DatePicker
            showTime
            // @ts-ignore
            getPopupContainer={(trigger) => {
              return trigger && trigger?.parentNode ? trigger.parentNode : document.body;
            }}
            // value={myValue}
            value={myValue ? moment(myValue, 'yyyy-MM-DD HH:mm:ss') : ''}
            onChange={(value, timeString) => {
              setMyValue(value);
              props.onChange?.(timeString, value);
            }}
          />
        </div>
      )}
    </div>
  );
};

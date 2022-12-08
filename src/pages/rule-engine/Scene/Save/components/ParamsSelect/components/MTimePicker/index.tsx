import { TimePicker, DatePicker } from 'antd';
import './index.less';
import type { TimePickerProps } from 'antd/lib/time-picker';
import { useEffect, useState } from 'react';

type Props = TimePickerProps & {
  onOpen?: (open: boolean) => void;
  type?: string;
};

export default (props: Props) => {
  const [myValue, setMyValue] = useState<any>(props.value || undefined);

  useEffect(() => {
    setMyValue(props.value);
    // console.log('moment',props.value)
  }, [props.value]);

  return (
    <div>
      {props.type === 'yyyy-MM-dd' ? (
        <div id={'manual-box'} className={'manual-box'}>
          <TimePicker
            {...props}
            value={myValue}
            onChange={(value, timeString) => {
              // console.log('MTime', value);
              setMyValue(value);
              props.onChange?.(value, timeString);
            }}
            className={'manual-time-picker'}
            popupClassName={'my-manual-time-picker'}
            open
            onOk={() => {
              if (props.onOpen) {
                props.onOpen(false);
              }
            }}
            // @ts-ignore
            getPopupContainer={(trigger) => {
              return trigger && trigger?.parentNode ? trigger.parentNode : document.body;
            }}
          />
        </div>
      ) : (
        <div id={'manual-box-date'} className={'manual-box-date'}>
          {/* @ts-ignore */}
          <DatePicker
            className={'manual-date-picker'}
            popupClassName={'my-manual-time-picker'}
            showTime
            open
            // @ts-ignore
            getPopupContainer={(trigger) => {
              return trigger && trigger?.parentNode ? trigger.parentNode : document.body;
            }}
            value={myValue}
            onChange={(value, timeString) => {
              setMyValue(value);
              props.onChange?.(value, timeString);
            }}
            onOk={() => {
              if (props.onOpen) {
                props.onOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

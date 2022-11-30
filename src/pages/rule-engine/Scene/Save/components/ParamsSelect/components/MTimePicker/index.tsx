import { TimePicker } from 'antd';
import './index.less';
import type { TimePickerProps } from 'antd/lib/time-picker';
import { useEffect, useState } from 'react';

export default (props: TimePickerProps) => {
  const [myValue, setMyValue] = useState<any>(props.value || undefined);

  useEffect(() => {
    setMyValue(props.value);
  }, [props.value]);

  return (
    <div id={'manual-box'} className={'manual-box'}>
      <TimePicker
        {...props}
        value={myValue}
        onChange={(value, timeString) => {
          console.log('MTime', value);
          setMyValue(value);
          props.onChange?.(value, timeString);
        }}
        className={'manual-time-picker'}
        popupClassName={'my-manual-time-picker'}
        open
        // @ts-ignore
        getPopupContainer={(trigger) => {
          return trigger && trigger?.parentNode ? trigger.parentNode : document.body;
        }}
      />
    </div>
  );
};

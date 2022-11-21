import { TimePicker } from 'antd';
import './index.less';
import { TimePickerProps } from 'antd/lib/time-picker';

export default (props: TimePickerProps) => {
  return (
    <div id={'manual-box'} className={'manual-box'}>
      <TimePicker
        {...props}
        value={props.value}
        onChange={props.onChange}
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

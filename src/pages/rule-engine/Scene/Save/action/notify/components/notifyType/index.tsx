import { useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.less';

interface NotifyTypeProps {
  value?: string;
  className?: string;
  onChange?: (type: string) => void;
  onSelect?: (type: string) => void;
  disabled?: boolean;
  options: any[];
}

const iconMap = new Map();
iconMap.set('dingTalk', require('/public/images/notice/dingtalk.png'));
iconMap.set('weixin', require('/public/images/notice/wechat.png'));
iconMap.set('email', require('/public/images/notice/email.png'));
iconMap.set('voice', require('/public/images/notice/voice.png'));
iconMap.set('sms', require('/public/images/notice/sms.png'));
iconMap.set('webhook', require('/public/images/notice/webhook.png'));

export default (props: NotifyTypeProps) => {
  const [type, setType] = useState(props.value || '');

  useEffect(() => {
    setType(props.value || '');
  }, [props.value]);

  const onSelect = (_type: string) => {
    if (!props.disabled) {
      setType(_type);

      if (props.onChange) {
        props.onChange(_type);
      }
    }
  };

  return (
    <div className={classNames('notify-type-warp', props.className, { disabled: props.disabled })}>
      {(props?.options || []).map((item) => (
        <div
          key={item.id}
          className={classNames('notify-type-item', {
            active: type === item.id,
          })}
          onClick={() => {
            onSelect(item.id);
          }}
        >
          <div className={'notify-type-item-image'}>
            <img width={'100%'} src={iconMap.get(item.id)} />
          </div>
          <div className={'notify-type-item-title'}>{item.name}</div>
        </div>
      ))}
    </div>
  );
};

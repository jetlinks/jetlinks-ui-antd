import { useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.less';

interface ActionsTypeProps {
  value?: string;
  className?: string;
  onChange?: (type: string) => void;
  onSelect?: (type: string) => void;
  disabled?: boolean;
}

export enum ActionsTypeEnum {
  manual = 'manual',
  timing = 'timer',
  device = 'device',
}

const TypeList = [
  {
    label: '设备输出',
    value: 'device',
    image: '',
    tip: '配置设备调用功能、读取属性、设置属性规则',
  },
  { label: '消息通知', value: 'notify', image: '', tip: '' },
  { label: '延迟执行', value: 'delay', image: '', tip: '' },
  { label: '触发告警', value: 'trigger', image: '', tip: '' },
  { label: '解除告警', value: 'relieve', image: '', tip: '' },
];

export default (props: ActionsTypeProps) => {
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
    <div className={classNames('trigger-way-warp', props.className, { disabled: props.disabled })}>
      {TypeList.map((item) => (
        <div
          className={classNames('trigger-way-item', {
            active: type === item.value,
          })}
          onClick={() => {
            onSelect(item.value);
          }}
        >
          <div className={'way-item-title'}>
            <p>{item.label}</p>
            <span>{item.tip}</span>
          </div>
          <div className={'way-item-image'}>
            <img width={48} src={item.image} />
          </div>
        </div>
      ))}
    </div>
  );
};

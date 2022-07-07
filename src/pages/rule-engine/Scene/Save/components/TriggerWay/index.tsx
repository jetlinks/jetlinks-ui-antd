import { useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.less';

interface TriggerWayProps {
  value?: string;
  className?: string;
  onChange?: (type: string) => void;
  onSelect?: (type: string) => void;
  disabled?: boolean;
}

export enum TriggerWayType {
  manual = 'manual',
  timing = 'timer',
  device = 'device',
}

export default (props: TriggerWayProps) => {
  const [type, setType] = useState(props.value || '');

  useEffect(() => {
    setType(props.value || '');
    if (props.onSelect) {
      props.onSelect(props.value || '');
    }
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
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.device,
        })}
        onClick={() => {
          onSelect(TriggerWayType.device);
        }}
      >
        <div className={'way-item-title'}>
          <p>设备触发</p>
          <span>DEVICE TRIGGER</span>
        </div>
        <img className={'way-item-image'} src={'/images/device-trigger.png'} />
      </div>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.manual,
        })}
        onClick={() => {
          onSelect(TriggerWayType.manual);
        }}
      >
        <div className={'way-item-title'}>
          <p>手动触发</p>
          <span>MANUAL TRIGGER</span>
        </div>
        <img className={'way-item-image'} src={'/images/manual-trigger.png'} />
      </div>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.timing,
        })}
        onClick={() => {
          onSelect(TriggerWayType.timing);
        }}
      >
        <div className={'way-item-title'}>
          <p>定时触发</p>
          <span>TIMING TRIGGER</span>
        </div>
        <img className={'way-item-image'} src={'/images/timing-trigger.png'} />
      </div>
    </div>
  );
};

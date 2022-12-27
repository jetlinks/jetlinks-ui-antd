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
    <div
      className={classNames('scene-trigger-way-warp', props.className, {
        disabled: props.disabled,
      })}
    >
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.device,
        })}
        style={{ width: 204 }}
        onClick={() => {
          onSelect(TriggerWayType.device);
        }}
      >
        <div className={'way-item-title'}>
          <p>设备触发</p>
          <span>适用于设备数据或行为满足触发条件时，执行指定的动作</span>
        </div>
        <div className={'way-item-image'}>
          <img width={48} src={'/images/device-trigger.png'} />
        </div>
      </div>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.manual,
        })}
        style={{ width: 204 }}
        onClick={() => {
          onSelect(TriggerWayType.manual);
        }}
      >
        <div className={'way-item-title'}>
          <p>手动触发</p>
          <span>适用于第三方平台向物联网平台下发指令控制设备.</span>
        </div>
        <div className={'way-item-image'}>
          <img width={48} src={'/images/manual-trigger.png'} />
        </div>
      </div>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.timing,
        })}
        style={{ width: 204 }}
        onClick={() => {
          onSelect(TriggerWayType.timing);
        }}
      >
        <div className={'way-item-title'}>
          <p>定时触发</p>
          <span>适用于定期执行固定任务.</span>
        </div>
        <div className={'way-item-image'}>
          <img width={48} src={'/images/timing-trigger.png'} />
        </div>
      </div>
    </div>
  );
};

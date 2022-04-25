import { useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.less';

interface TriggerWayProps {
  value?: string;
  onChange?: (type: string) => void;
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
  }, [props.value]);

  const onSelect = (_type: string) => {
    setType(_type);

    if (props.onChange) {
      props.onChange(_type);
    }
  };

  return (
    <div className={'trigger-way-warp'}>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.manual,
        })}
        onClick={() => {
          onSelect(TriggerWayType.manual);
        }}
      >
        手动触发
      </div>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.timing,
        })}
        onClick={() => {
          onSelect(TriggerWayType.timing);
        }}
      >
        定时触发
      </div>
      <div
        className={classNames('trigger-way-item', {
          active: type === TriggerWayType.device,
        })}
        onClick={() => {
          onSelect(TriggerWayType.device);
        }}
      >
        设备触发
      </div>
    </div>
  );
};

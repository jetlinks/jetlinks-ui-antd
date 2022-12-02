import { useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.less';

interface ActionsTypeProps {
  value?: string;
  className?: string;
  onChange?: (type: string) => void;
  onSelect?: (type: string) => void;
  disabled?: boolean;
  parallel: boolean; //并行true
}

const TypeList = [
  {
    label: '设备输出',
    value: 'device',
    image: require('/public/images/scene/device-type.png'),
    tip: '配置设备调用功能、读取属性、设置属性规则',
  },
  {
    label: '消息通知',
    value: 'notify',
    image: require('/public/images/scene/message-type.png'),
    tip: '配置向指定用户发邮件、钉钉、微信、短信等通知',
  },
  {
    label: '延迟执行',
    value: 'delay',
    image: require('/public/images/scene/delay-type.png'),
    tip: '等待一段时间后，再执行后续动作',
  },
  {
    label: '触发告警',
    value: 'trigger',
    image: require('/public/images/scene/trigger-type.png'),
    tip: '配置触发告警规则，需配合“告警配置”使用',
  },
  {
    label: '解除告警',
    value: 'relieve',
    image: require('/public/images/scene/cancel-type.png'),
    tip: '配置解除告警规则，需配合“告警配置”使用',
  },
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
      {TypeList.map((item) =>
        props.parallel && item.value === 'delay' ? null : (
          <div
            key={item.value}
            className={classNames('trigger-way-item', {
              active: type === item.value,
            })}
            style={{ width: 237 }}
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
        ),
      )}
    </div>
  );
};

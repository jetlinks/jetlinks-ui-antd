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
    <div className={classNames('trigger-way-warp', props.className, { disabled: props.disabled })}>
      {(props?.options || []).map((item) => (
        <div
          key={item.id}
          className={classNames('trigger-way-item', {
            active: type === item.id,
          })}
          onClick={() => {
            onSelect(item.id);
          }}
        >
          <div className={'way-item-title'}>
            <p>{item.name}</p>
          </div>
          <div className={'way-item-image'}>
            <img width={48} src={item.image} />
          </div>
        </div>
      ))}
    </div>
  );
};

import classNames from 'classnames';
import { useEffect, useState } from 'react';
import './index.less';

interface Props {
  typeList: any[];
  value?: string;
  className?: string;
  onChange?: (type: string) => void;
  onSelect?: (type: string) => void;
  disabled?: boolean;
  labelBottom?: boolean;
}

const TopCard = (props: Props) => {
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
      {props.typeList.map((item) => (
        <div
          key={item.value}
          className={classNames('trigger-way-item', {
            active: type === item.value,
            labelBottom: props.labelBottom,
          })}
          onClick={() => {
            onSelect(item.value);
          }}
        >
          <div className={'way-item-title'}>
            <p>{item.label}</p>
            {item.tip && <span>{item.tip}</span>}
          </div>
          <div className={'way-item-image'}>
            <img width={48} src={item.image} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default TopCard;

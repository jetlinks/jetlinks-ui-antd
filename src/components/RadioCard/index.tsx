import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isArray } from 'lodash';
import './index.less';
import { CheckOutlined } from '@ant-design/icons';

type RadioCardModelType = 'multiple' | 'singular';

interface RadioCardItem {
  label: string;
  value: string;
  imgUrl: string;
}

export interface RadioCardProps {
  value?: string | string[];
  model?: RadioCardModelType;
  options: RadioCardItem[];
  onChange?: (keys: string | string[]) => void;
  onSelect?: (key: string, selected: boolean, node: RadioCardItem[]) => void;
}

export default (props: RadioCardProps) => {
  const { value, model, options, onChange, onSelect } = props;
  const [keys, setKeys] = useState<string[]>([]);
  const isMultiple = useRef<boolean>(true);

  isMultiple.current = !(model && model === 'singular');

  useEffect(() => {
    // 初始化
    setKeys(value ? (isArray(value) ? value : [value]) : []);
  }, [props.value]);

  const getNode = (_keys: string[]) =>
    options.filter((item) => _keys.some((key) => key === item.value));

  const toggleOption = (key: string) => {
    const optionIndex = keys.indexOf(key);
    const newKeys = [...keys];
    if (optionIndex === -1) {
      if (isMultiple.current) {
        newKeys.push(key);
      } else {
        newKeys[0] = key;
      }
    } else {
      newKeys.splice(optionIndex, 1);
    }

    if (!('value' in props)) {
      setKeys(newKeys);
    }

    if (onChange) {
      onChange(isMultiple.current ? newKeys : newKeys[0]);
    }

    if (onSelect) {
      onSelect(key, optionIndex === -1, getNode(newKeys));
    }
  };

  return (
    <div className={'radio-card-items'}>
      {options.map((item) => {
        return (
          <div
            className={classNames('radio-card-item', {
              checked: keys?.includes(item.value),
            })}
            key={item.value}
            onClick={() => {
              toggleOption(item.value);
            }}
          >
            <img width={32} height={32} src={item.imgUrl} alt={''} />
            <span>{item.label}</span>
            <div className={'checked-icon'}>
              <div>
                <CheckOutlined />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

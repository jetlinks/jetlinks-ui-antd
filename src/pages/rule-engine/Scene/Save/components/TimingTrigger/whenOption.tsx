import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Styles from './index.less';

interface TimerWhenProps {
  value?: number[];
  onChange?: (value?: number[]) => void;
  type?: string;
}

export const numberToString = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日',
};

export default (props: TimerWhenProps) => {
  const [value, setValue] = useState<number[] | undefined>(undefined);

  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (props.type === 'month') {
      setOptions(
        new Array(31).fill(1).map((_, index) => ({ label: index + 1 + '号', value: index + 1 })),
      );
    } else {
      setOptions(
        new Array(7)
          .fill(1)
          .map((_, index) => ({ label: numberToString[index + 1], value: index + 1 })),
      );
    }
  }, [props.type]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className={Styles['timer-when-warp']}>
      <div
        className={classNames(Styles['when-item'], { [Styles.active]: value && !value.length })}
        onClick={() => {
          if (value && !value.length) {
            setValue(undefined);
            props.onChange?.(undefined);
          } else if (!value || (value && value.length)) {
            setValue([]);
            props.onChange?.([]);
          }
        }}
      >
        每天
      </div>
      {options.map((item) => {
        return (
          <div
            className={classNames(Styles['when-item'], {
              [Styles.active]: value && value.includes(item.value),
            })}
            key={item}
            onClick={() => {
              const _value = value ? [...value] : [];
              const indexOf = _value.findIndex((t) => t === item.value);
              if (indexOf === -1) {
                _value.push(item.value);
              } else {
                _value.splice(indexOf, 1);
              }

              setValue(_value.length ? [..._value] : undefined);
              props.onChange?.(_value.length ? _value.sort((a, b) => a - b) : undefined);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

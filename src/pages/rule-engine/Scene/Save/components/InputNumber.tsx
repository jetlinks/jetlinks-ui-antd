import { InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';

interface InputNumberProps {
  value?: { time: number; unit: string };
  onChange?: (value: { time: number; unit: string }) => void;
}

export default (props: InputNumberProps) => {
  const [time, setTime] = useState(props.value?.time || 0);
  const [unit, setUnit] = useState(props.value?.unit || 'second');

  useEffect(() => {
    setTime(props.value?.time || 0);
    setUnit(props.value?.unit || 'second');
  }, [props.value]);

  const TimeTypeAfter = (
    <Select
      value={unit}
      options={[
        { label: '秒', value: 'second' },
        { label: '分', value: 'minute' },
        { label: '小时', value: 'hour' },
      ]}
      onChange={(key) => {
        if (props.onChange) {
          props.onChange({
            time: time,
            unit: key,
          });
        }
      }}
    />
  );

  return (
    <InputNumber
      addonAfter={TimeTypeAfter}
      style={{ width: 150 }}
      min={0}
      max={9999}
      onChange={(value) => {
        if (props.onChange) {
          props.onChange({
            time: value,
            unit,
          });
        }
      }}
    />
  );
};

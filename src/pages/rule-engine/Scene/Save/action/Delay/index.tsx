import { Modal, Select, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { observer } from '@formily/react';

export enum TimeUnit {
  'seconds' = 'seconds',
  'minutes' = 'minutes',
  'hours' = 'hours',
}

export const timeUnitEnum = {
  seconds: '秒',
  minutes: '分',
  hours: '小时',
};

interface Props {
  value: {
    time?: number;
    unit?: string;
  };
  save: (
    notify: {
      time?: number;
      unit?: string;
    },
    options: any,
  ) => void;
  cancel: () => void;
}

export default observer((props: Props) => {
  const [value, setValue] = useState<number>(0);
  const [unit, setUnit] = useState('seconds');
  useEffect(() => {
    if (props.value) {
      setUnit(props.value.unit || 'seconds');
      setValue(props.value.time || 0);
    }
  }, []);

  const TimeTypeAfter = (
    <Select
      options={[
        { label: '秒', value: 'seconds' },
        { label: '分', value: 'minutes' },
        { label: '小时', value: 'hours' },
      ]}
      value={unit}
      onChange={setUnit}
    />
  );

  return (
    <Modal
      title={'执行动作'}
      open
      width={400}
      onCancel={() => {
        props.cancel();
      }}
      onOk={() => {
        props.save(
          {
            time: value,
            unit,
          },
          { name: `延迟 ${value} ${timeUnitEnum[unit]} 执行` },
        );
      }}
    >
      <InputNumber
        placeholder={'请输入时间'}
        addonAfter={TimeTypeAfter}
        style={{ maxWidth: 220 }}
        value={value}
        precision={3}
        onChange={(v) => setValue(v!)}
        min={0}
        max={6535}
      />
    </Modal>
  );
});

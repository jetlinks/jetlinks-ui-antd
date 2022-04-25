import { Select, Input, TimePicker, InputNumber } from 'antd';
import { TimeSelect } from '@/pages/rule-engine/Scene/Save/components';
import { useState } from 'react';

export default () => {
  const [type1, setType1] = useState(1);
  const [type2, setType2] = useState(1);

  const type1Select = async (key: number) => {
    setType1(key);
    if (key !== 3) {
      // TODO 请求后端返回天数
    }
  };

  const type2Select = (key: number) => {
    setType2(key);
  };

  const TimeTypeAfter = (
    <Select
      defaultValue={'second'}
      options={[
        { label: '秒', value: 'second' },
        { label: '分', value: 'minute' },
        { label: '小时', value: 'hour' },
      ]}
    />
  );

  const implementNode =
    type2 === 1 ? (
      <>
        <TimePicker.RangePicker />
        <span> 每 </span>
        <InputNumber addonAfter={TimeTypeAfter} style={{ width: 150 }} min={0} max={9999} />
        <span> 执行一次 </span>
      </>
    ) : (
      <>
        <TimePicker />
        <InputNumber addonAfter={TimeTypeAfter} style={{ width: 150 }} min={0} max={9999} />
        <span> 执行一次 </span>
      </>
    );

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Select
        options={[
          { label: '按周', value: 1 },
          { label: '按月', value: 2 },
          { label: 'cron表达式', value: 3 },
        ]}
        value={type1}
        onSelect={type1Select}
        style={{ width: 120 }}
      />
      {type1 !== 3 ? (
        <>
          <TimeSelect
            options={[
              { label: '周一', value: 1 },
              { label: '周二', value: 2 },
              { label: '周三', value: 3 },
              { label: '周四', value: 4 },
              { label: '周五', value: 5 },
              { label: '周六', value: 6 },
              { label: '周末', value: 7 },
            ]}
            style={{ width: 150 }}
          />
          <Select
            options={[
              { label: '周期执行', value: 1 },
              { label: '执行一次', value: 2 },
            ]}
            value={type2}
            style={{ width: 150 }}
            onSelect={type2Select}
          />
          {implementNode}
        </>
      ) : (
        <Input placeholder={'请输入cron表达式'} style={{ width: 400 }} />
      )}
    </div>
  );
};

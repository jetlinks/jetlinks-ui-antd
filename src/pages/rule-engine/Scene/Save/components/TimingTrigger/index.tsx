import { Input, InputNumber, Select, TimePicker } from 'antd';
import { TimeSelect } from '@/pages/rule-engine/Scene/Save/components';
import { useCallback, useEffect, useState } from 'react';
import { omit } from 'lodash';
import moment from 'moment';

type TimerType = {
  trigger: string;
  cron?: string;
  when?: number[];
  mod?: string;
  period?: {
    from?: string;
    to?: string;
    every?: number;
    unit?: string;
  };
  once?: {
    time?: string;
  };
};

interface TimingTrigger {
  value?: TimerType;
  onChange?: (value: TimerType) => void;
}

enum TriggerEnum {
  'week' = 'week',
  'month' = 'month',
  'cron' = 'cron',
}

enum PeriodModEnum {
  'period' = 'period',
  'once' = 'once',
}

const DefaultValue = {
  trigger: TriggerEnum.week,
  mod: PeriodModEnum.period,
  period: {},
};

export default (props: TimingTrigger) => {
  const [data, setData] = useState<TimerType>(DefaultValue);

  useEffect(() => {
    setData(props.value || DefaultValue);
  }, [props.value]);

  const onChange = (newData: TimerType) => {
    if (props.onChange) {
      props.onChange(newData);
    }
  };

  const type1Select = async (key: string) => {
    if (key !== TriggerEnum.cron) {
      onChange({
        trigger: key,
        mod: PeriodModEnum.period,
        when: [],
        period: {
          unit: 'second',
        },
      });
    } else {
      onChange({
        trigger: key,
        cron: undefined,
      });
    }
  };

  const type2Select = useCallback(
    (key: string) => {
      if (key === PeriodModEnum.period) {
        onChange({
          ...omit(data, 'once'),
          mod: key,
          period: {
            from: undefined,
            to: undefined,
            unit: 'second',
          },
        });
      } else {
        onChange({
          ...omit(data, 'period'),
          mod: key,
          once: {
            time: undefined,
          },
        });
      }
    },
    [data],
  );

  const TimeTypeAfter = (
    <Select
      value={data.period?.unit || 'second'}
      options={[
        { label: '秒', value: 'second' },
        { label: '分', value: 'minute' },
        { label: '小时', value: 'hour' },
      ]}
      onSelect={(key: string) => {
        onChange({
          ...data,
          period: {
            ...data.period,
            unit: key,
          },
        });
      }}
    />
  );

  const implementNode =
    data.mod === PeriodModEnum.period ? (
      <>
        <TimePicker.RangePicker
          format={'hh:mm:ss'}
          value={
            data.period?.from
              ? [moment(data.period?.from, 'hh:mm:ss'), moment(data.period?.to, 'hh:mm:ss')]
              : undefined
          }
          onChange={(_, dateString) => {
            onChange({
              ...data,
              period: {
                ...data.period,
                from: dateString[0],
                to: dateString[1],
              },
            });
          }}
        />
        <span> 每 </span>
        <InputNumber
          value={data.period?.every}
          addonAfter={TimeTypeAfter}
          style={{ width: 150 }}
          min={0}
          max={9999}
          onChange={(e) => {
            onChange({
              ...data,
              period: {
                ...data.period,
                every: e,
              },
            });
          }}
        />
        <span> 执行一次 </span>
      </>
    ) : (
      <>
        <TimePicker
          format={'hh:mm:ss'}
          value={data.once?.time ? moment(data.once?.time, 'hh:mm:ss') : undefined}
          onChange={(_, dateString) => {
            onChange({
              ...data,
              once: {
                time: dateString,
              },
            });
          }}
        />
        <span> 执行一次 </span>
      </>
    );

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Select
        options={[
          { label: '按周', value: TriggerEnum.week },
          { label: '按月', value: TriggerEnum.month },
          { label: 'cron表达式', value: TriggerEnum.cron },
        ]}
        value={data.trigger}
        onSelect={type1Select}
        style={{ width: 120 }}
      />
      {data.trigger !== TriggerEnum.cron ? (
        <>
          <TimeSelect
            value={data.when}
            options={
              data.trigger === TriggerEnum.week
                ? [
                    { label: '周一', value: 1 },
                    { label: '周二', value: 2 },
                    { label: '周三', value: 3 },
                    { label: '周四', value: 4 },
                    { label: '周五', value: 5 },
                    { label: '周六', value: 6 },
                    { label: '周末', value: 7 },
                  ]
                : new Array(31)
                    .fill(1)
                    .map((_, index) => ({ label: index + 1 + '号', value: index + 1 }))
            }
            style={{ width: 180 }}
            onChange={(keys) => {
              onChange({
                ...data,
                when: keys,
              });
            }}
          />
          <Select
            options={[
              { label: '周期执行', value: PeriodModEnum.period },
              { label: '执行一次', value: PeriodModEnum.once },
            ]}
            value={data.mod}
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

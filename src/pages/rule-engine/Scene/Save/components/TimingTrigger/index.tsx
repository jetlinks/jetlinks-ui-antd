import { Col, Input, InputNumber, Row, Select, TimePicker } from 'antd';
import { ItemGroup, TimeSelect } from '@/pages/rule-engine/Scene/Save/components';
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
  className?: string;
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
          unit: 'seconds',
          from: moment(new Date()).format('HH:mm:ss'),
          to: moment(new Date()).format('HH:mm:ss'),
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
            from: moment(new Date()).format('HH:mm:ss'),
            to: moment(new Date()).format('HH:mm:ss'),
            unit: 'seconds',
          },
        });
      } else {
        onChange({
          ...omit(data, 'period'),
          mod: key,
          once: {
            time: moment(new Date()).format('HH:mm:ss'),
          },
        });
      }
    },
    [data],
  );

  const TimeTypeAfter = (
    <Select
      value={data.period?.unit || 'seconds'}
      options={[
        { label: '秒', value: 'seconds' },
        { label: '分', value: 'minutes' },
        { label: '小时', value: 'hours' },
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

  return (
    <Row gutter={24} className={props.className}>
      <Col span={data.trigger !== TriggerEnum.cron ? 6 : 8}>
        <ItemGroup>
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
              style={{ width: '100%' }}
              onChange={(keys) => {
                onChange({
                  ...data,
                  when: keys,
                });
              }}
            />
          ) : (
            <Input
              value={props.value?.cron}
              placeholder={'请输入cron表达式'}
              style={{ width: 400 }}
              onChange={(e) => {
                onChange({
                  trigger: data.trigger,
                  cron: e.target.value,
                });
              }}
            />
          )}
        </ItemGroup>
      </Col>
      {data.trigger !== TriggerEnum.cron && (
        <>
          <Col span={12}>
            <ItemGroup>
              <Select
                options={[
                  { label: '周期执行', value: PeriodModEnum.period },
                  { label: '执行一次', value: PeriodModEnum.once },
                ]}
                value={data.mod}
                style={{ width: 120 }}
                onSelect={type2Select}
              />
              {data.mod === PeriodModEnum.period ? (
                <TimePicker.RangePicker
                  format={'HH:mm:ss'}
                  value={[
                    moment(data.period?.from, 'HH:mm:ss'),
                    moment(data.period?.to, 'hh:mm:ss'),
                  ]}
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
              ) : (
                <TimePicker
                  format={'HH:mm:ss'}
                  value={moment(data.once?.time, 'HH:mm:ss')}
                  onChange={(_, dateString) => {
                    onChange({
                      ...data,
                      once: {
                        time: dateString,
                      },
                    });
                  }}
                />
              )}
            </ItemGroup>
          </Col>
          <Col span={6}>
            <ItemGroup style={{ gap: 16 }}>
              {data.mod === PeriodModEnum.period ? (
                <>
                  <span> 每 </span>
                  <InputNumber
                    value={data.period?.every}
                    placeholder={'请输入时间'}
                    addonAfter={TimeTypeAfter}
                    style={{ flex: 1 }}
                    min={0}
                    max={59}
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
                </>
              ) : null}
              <span style={{ flex: 0, flexBasis: 64, lineHeight: '32px' }}> 执行一次 </span>
            </ItemGroup>
          </Col>
        </>
      )}
    </Row>
  );
};

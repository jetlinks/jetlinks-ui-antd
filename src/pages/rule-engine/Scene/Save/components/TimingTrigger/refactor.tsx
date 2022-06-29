import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { ItemGroup, TimeSelect } from '@/pages/rule-engine/Scene/Save/components';
import RangePicker from './RangePicker';
import TimePicker from './TimePicker';
import type { FormInstance } from 'antd';
import { useState, useCallback } from 'react';
import moment from 'moment';

enum TriggerEnum {
  'week' = 'week',
  'month' = 'month',
  'cron' = 'cron',
}

enum PeriodModEnum {
  'period' = 'period',
  'once' = 'once',
}

interface TimingTrigger {
  form: FormInstance;
  name: string[];
  className?: string;
}

const CronRegEx = new RegExp(
  '(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7])|([1-7])|(\\?)|(\\*)|(([1-7]L)|([1-7]\\#[1-4]))))|(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7] )|([1-7] )|(\\? )|(\\* )|(([1-7]L )|([1-7]\\#[1-4]) ))((19[789][0-9]|20[0-9][0-9])\\-(19[789][0-9]|20[0-9][0-9])))',
);

export default (props: TimingTrigger) => {
  const { name } = props;
  const [data, setData] = useState<any>({
    trigger: TriggerEnum.week,
    mod: PeriodModEnum.period,
  });

  const onChange = useCallback(() => {
    const formData = props.form.getFieldsValue();
    setData(formData?.trigger?.timer);
  }, [props.form]);

  const TimeTypeAfter = (
    <Select
      value={data?.period?.unit || 'seconds'}
      options={[
        { label: '秒', value: 'seconds' },
        { label: '分', value: 'minutes' },
        { label: '小时', value: 'hours' },
      ]}
      onSelect={(key: string) => {
        props.form.setFields([
          {
            name: [...name, 'timer', 'period', 'unit'],
            value: key,
          },
        ]);
        onChange();
      }}
    />
  );

  return (
    <Row gutter={24} className={props.className}>
      <Col span={data?.trigger !== TriggerEnum.cron ? 6 : 8}>
        <ItemGroup>
          <Form.Item
            name={[...name, 'timer', 'trigger']}
            initialValue={TriggerEnum.week}
            rules={[
              {
                required: true,
                message: '请选择时间',
              },
            ]}
          >
            <Select
              options={[
                { label: '按周', value: TriggerEnum.week },
                { label: '按月', value: TriggerEnum.month },
                { label: 'cron表达式', value: TriggerEnum.cron },
              ]}
              style={{ width: '120px' }}
              onChange={onChange}
            />
          </Form.Item>
          {data?.trigger !== TriggerEnum.cron ? (
            <Form.Item
              name={[...name, 'timer', 'when']}
              rules={[
                {
                  required: true,
                  message: '请选择时间',
                },
              ]}
            >
              <TimeSelect
                value={data?.when}
                options={
                  data?.trigger === TriggerEnum.week
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
                onChange={onChange}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name={[...name, 'timer', 'cron']}
              rules={[
                { max: 64, message: '最多可输入64个字符' },
                {
                  validator: async (_: any, value: any) => {
                    if (value && !CronRegEx.test(value)) {
                      return Promise.reject(new Error('请输入正确的cron表达式'));
                    }
                    return Promise.reject(new Error('请输入cron表达式'));
                  },
                },
              ]}
            >
              <Input placeholder={'请输入cron表达式'} style={{ width: 400 }} />
            </Form.Item>
          )}
        </ItemGroup>
      </Col>
      <Col span={12}>
        {data?.trigger !== TriggerEnum.cron && (
          <ItemGroup>
            <Form.Item
              name={[...name, 'timer', 'mod']}
              initialValue={PeriodModEnum.period}
              rules={[
                {
                  required: true,
                  message: '请选择执行频率',
                },
              ]}
            >
              <Select
                options={[
                  { label: '周期执行', value: PeriodModEnum.period },
                  { label: '执行一次', value: PeriodModEnum.once },
                ]}
                style={{ width: 120 }}
                onChange={onChange}
              />
            </Form.Item>
            {data?.mod === PeriodModEnum.period ? (
              <Form.Item
                name={[...name, 'timer', 'period']}
                initialValue={{
                  from: moment(new Date()).format('HH:mm:ss'),
                  to: moment(new Date()).format('HH:mm:ss'),
                }}
              >
                <RangePicker />
              </Form.Item>
            ) : (
              <Form.Item
                name={[...name, 'timer', 'once']}
                initialValue={{ time: moment(new Date()).format('HH:mm:ss') }}
              >
                <TimePicker />
              </Form.Item>
            )}
          </ItemGroup>
        )}
      </Col>
      <Col span={6}>
        {data?.trigger !== TriggerEnum.cron && (
          <ItemGroup style={{ gap: 16 }}>
            {data?.mod === PeriodModEnum.period ? (
              <>
                <div style={{ paddingBottom: 12 }}> 每 </div>
                <Form.Item
                  name={[...name, 'timer', 'period', 'every']}
                  rules={[{ required: true, message: '请输入时间' }]}
                >
                  <InputNumber
                    placeholder={'请输入时间'}
                    addonAfter={TimeTypeAfter}
                    style={{ flex: 1 }}
                    min={0}
                    max={59}
                  />
                </Form.Item>
                <Form.Item
                  name={[...name, 'timer', 'period', 'unit']}
                  initialValue={'seconds'}
                  hidden
                >
                  <Input />
                </Form.Item>
              </>
            ) : null}
            <div style={{ flex: 0, flexBasis: 64, paddingBottom: 12 }}> 执行一次 </div>
          </ItemGroup>
        )}
      </Col>
    </Row>
  );
};

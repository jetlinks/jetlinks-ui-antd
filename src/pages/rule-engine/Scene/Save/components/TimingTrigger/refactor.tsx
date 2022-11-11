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
  '^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$',
);

const getFormValueByName = (name: string[], values: any) => {
  return name.reduce((prev, next) => {
    return prev ? prev[next] : values[next];
  }, '');
};

export default (props: TimingTrigger) => {
  const { name } = props;
  const [data, setData] = useState<any>({
    trigger: TriggerEnum.week,
    mod: PeriodModEnum.period,
  });

  const onChange = useCallback(() => {
    const formData = props.form.getFieldsValue();
    let _data = formData;
    name.forEach((key) => {
      if (key in _data) {
        _data = _data[key];
      }
    });

    setData(_data.timer);
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
      <Col
        xxl={data.trigger !== TriggerEnum.cron ? 6 : 8}
        xl={data.trigger !== TriggerEnum.cron ? 10 : 12}
      >
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
              onChange={(key) => {
                props.form.setFields([
                  {
                    name: [...name, 'timer', 'when'],
                    value: undefined,
                  },
                  {
                    name: [...name, 'timer', 'mod'],
                    value: PeriodModEnum.period,
                  },
                ]);
                setData({
                  trigger: key,
                  mod: PeriodModEnum.period,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            noStyle
            dependencies={[...name, 'timer', 'trigger']}
            shouldUpdate={(prevValues, curValues) => {
              const pValue = getFormValueByName([...name, 'timer', 'trigger'], prevValues);
              const cValue = getFormValueByName([...name, 'timer', 'trigger'], curValues);
              return pValue !== cValue;
            }}
          >
            {({ getFieldValue }) => {
              const trigger = getFieldValue([...name, 'timer', 'trigger']);
              const when = getFieldValue([...name, 'timer', 'when']);
              return trigger !== TriggerEnum.cron ? (
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
                    value={when}
                    options={
                      trigger === TriggerEnum.week
                        ? [
                            { label: '星期一', value: 1 },
                            { label: '星期二', value: 2 },
                            { label: '星期三', value: 3 },
                            { label: '星期四', value: 4 },
                            { label: '星期五', value: 5 },
                            { label: '星期六', value: 6 },
                            { label: '星期日', value: 7 },
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
                        if (value) {
                          if (!CronRegEx.test(value)) {
                            return Promise.reject(new Error('请输入正确的cron表达式'));
                          }
                        } else {
                          return Promise.reject(new Error('请输入cron表达式'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder={'请输入cron表达式'} style={{ width: 400 }} />
                </Form.Item>
              );
            }}
          </Form.Item>
        </ItemGroup>
      </Col>
      <Col xxl={11} xl={14}>
        <Form.Item
          noStyle
          dependencies={[...name, 'timer', 'trigger']}
          shouldUpdate={(prevValues, curValues) => {
            const pValue = getFormValueByName([...name, 'timer', 'trigger'], prevValues);
            const cValue = getFormValueByName([...name, 'timer', 'trigger'], curValues);
            return pValue !== cValue;
          }}
        >
          {({ getFieldValue }) => {
            const trigger = getFieldValue([...name, 'timer', 'trigger']);
            return (
              trigger !== TriggerEnum.cron && (
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
                  <Form.Item
                    noStyle
                    dependencies={[...name, 'timer', 'mod']}
                    shouldUpdate={(prevValues, curValues) => {
                      const pValue = getFormValueByName([...name, 'timer', 'mod'], prevValues);
                      const cValue = getFormValueByName([...name, 'timer', 'mod'], curValues);
                      return pValue !== cValue;
                    }}
                  >
                    {({ getFieldValue: getFieldValue2 }) => {
                      const mod = getFieldValue2([...name, 'timer', 'mod']);
                      return mod === PeriodModEnum.period ? (
                        <Form.Item
                          name={[...name, 'timer', 'period']}
                          initialValue={{
                            from: moment(new Date()).format('HH:mm:ss'),
                            to: moment(new Date()).format('HH:mm:ss'),
                          }}
                        >
                          <RangePicker form={props.form} />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          name={[...name, 'timer', 'once']}
                          initialValue={{ time: moment(new Date()).format('HH:mm:ss') }}
                        >
                          <TimePicker />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </ItemGroup>
              )
            );
          }}
        </Form.Item>
      </Col>
      <Col xxl={7} xl={10}>
        <Form.Item
          noStyle
          dependencies={[...name, 'timer', 'trigger']}
          shouldUpdate={(prevValues, curValues) => {
            const pValue = getFormValueByName([...name, 'timer', 'trigger'], prevValues);
            const cValue = getFormValueByName([...name, 'timer', 'trigger'], curValues);
            return pValue !== cValue;
          }}
        >
          {({ getFieldValue }) => {
            const trigger = getFieldValue([...name, 'timer', 'trigger']);
            return (
              trigger !== TriggerEnum.cron && (
                <ItemGroup style={{ gap: 16 }}>
                  <Form.Item
                    noStyle
                    dependencies={[...name, 'timer', 'mod']}
                    shouldUpdate={(prevValues, curValues) => {
                      const pValue = getFormValueByName([...name, 'timer', 'mod'], prevValues);
                      const cValue = getFormValueByName([...name, 'timer', 'mod'], curValues);
                      return pValue !== cValue;
                    }}
                  >
                    {({ getFieldValue: getFieldValue2 }) => {
                      const mod = getFieldValue2([...name, 'timer', 'mod']);
                      return mod === PeriodModEnum.period ? (
                        <>
                          <div style={{ paddingBottom: 16 }}> 每 </div>
                          <Form.Item
                            name={[...name, 'timer', 'period', 'every']}
                            rules={[{ required: true, message: '请输入时间' }]}
                          >
                            <InputNumber
                              placeholder={'请输入时间'}
                              addonAfter={TimeTypeAfter}
                              style={{ maxWidth: 170 }}
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
                      ) : null;
                    }}
                  </Form.Item>
                  <div style={{ flex: 0, flexBasis: 64, paddingBottom: 16 }}> 执行一次 </div>
                </ItemGroup>
              )
            );
          }}
        </Form.Item>
      </Col>
    </Row>
  );
};

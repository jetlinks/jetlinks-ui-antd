import { Form, Input, Radio, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd';
import WhenOption from './whenOption';
import RangePicker from './RangePicker';
import TimePicker from './TimePicker';
import moment from 'moment';
import ItemGroup from '../ItemGroup';
interface TimmingTriggerProps {
  name: (string | number)[];
  form: FormInstance<any>;
}

const triggerOptions = [
  { label: '按周', value: 'week' },
  { label: '按月', value: 'month' },
  { label: 'cron表达式', value: 'cron' },
];
const modOptions = [
  { label: '周期执行', value: 'period' },
  { label: '执行一次', value: 'once' },
];

export const timeUnitEnum = {
  seconds: '秒',
  minutes: '分',
  hours: '小时',
};

const CronRegEx = new RegExp(
  '^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$',
);

export default (props: TimmingTriggerProps) => {
  const { name, form } = props;

  const trigger = Form.useWatch([...name, 'trigger'], form);
  const mod = Form.useWatch([...name, 'mod'], form);

  const TimeTypeAfter = (
    <Form.Item noStyle name={[...props.name, 'period', 'unit']} initialValue="seconds">
      <Select
        options={[
          { label: '秒', value: 'seconds' },
          { label: '分', value: 'minutes' },
          { label: '小时', value: 'hours' },
        ]}
      />
    </Form.Item>
  );

  return (
    <>
      <Form.Item name={[...name, 'trigger']} initialValue="week">
        <Radio.Group
          options={triggerOptions}
          optionType="button"
          buttonStyle="solid"
          onChange={() => {
            form.setFields([
              {
                name: [...name, 'when'],
                value: [],
              },
              {
                name: [...name, 'mod'],
                value: 'period',
              },
            ]);
          }}
        />
      </Form.Item>
      {trigger === 'cron' ? (
        <Form.Item
          initialValue={undefined}
          name={[...name, 'cron']}
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
          <Input placeholder="corn表达式" />
        </Form.Item>
      ) : (
        <>
          <Form.Item
            name={[...name, 'when']}
            rules={[
              {
                validator: async (_: any, value: any) => {
                  if (!value) {
                    return Promise.reject(new Error('请选择时间'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            initialValue={[]}
          >
            <WhenOption type={trigger} />
          </Form.Item>
          <Form.Item
            initialValue="period"
            name={[...name, 'mod']}
            rules={[
              {
                required: true,
                message: '请选择执行频率',
              },
            ]}
          >
            <Radio.Group options={modOptions} optionType="button" buttonStyle="solid" />
          </Form.Item>
        </>
      )}
      {trigger !== 'cron' && mod === 'once' ? (
        <ItemGroup style={{ gap: 16 }}>
          <Form.Item
            name={[...name, 'once']}
            // initialValue={{ time: moment(new Date()).format('HH:mm:ss') }}
          >
            <TimePicker />
          </Form.Item>
          <Form.Item> 执行一次 </Form.Item>
        </ItemGroup>
      ) : null}
      {trigger !== 'cron' && mod === 'period' ? (
        <>
          <ItemGroup style={{ gap: 16 }}>
            <Form.Item
              name={[...name, 'period']}
              initialValue={{
                from: moment(new Date()).format('HH:mm:ss'),
                to: moment(new Date()).format('HH:mm:ss'),
              }}
            >
              <RangePicker name={[...name, 'period']} form={form} />
            </Form.Item>
            <Form.Item> 每 </Form.Item>
            <Form.Item
              name={[...name, 'period', 'every']}
              rules={[{ required: true, message: '请输入时间' }]}
            >
              <InputNumber
                placeholder={'请输入时间'}
                addonAfter={TimeTypeAfter}
                style={{ maxWidth: 170 }}
                precision={0}
                min={1}
                max={59}
              />
            </Form.Item>
            <Form.Item> 执行一次 </Form.Item>
          </ItemGroup>
        </>
      ) : null}
    </>
  );
};

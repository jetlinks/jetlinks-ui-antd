import type { OperationTimer } from '@/pages/rule-engine/Scene/typings';
import { Modal, Form } from 'antd';
import TimingTrigger, {
  timeUnitEnum,
} from '@/pages/rule-engine/Scene/Save/components/TimingTrigger';
import { numberToString } from '@/pages/rule-engine/Scene/Save/components/TimingTrigger/whenOption';
import { useEffect } from 'react';
import { isArray } from 'lodash';

interface Props {
  close: () => void;
  data?: Partial<OperationTimer>;
  save: (data: OperationTimer, options: any) => void;
}

type continuousValueFn = (data: (string | number)[], type: string) => (number | string)[];

export const continuousValue: continuousValueFn = (data, type) => {
  let start = 0;
  const newArray: (number | string)[] = [];
  const isWeek = type === 'week';
  if (isArray(data)) {
    data.forEach((item, index) => {
      const _item = Number(item);
      const nextValue = data[index + 1];
      const previousValue = data[index - 1];
      const nextItemValue = _item + 1;
      const previousItemValue = _item - 1;
      if (nextItemValue === nextValue && previousItemValue !== previousValue) {
        start = _item;
      } else if (previousItemValue === previousValue && nextItemValue !== nextValue) {
        // 表示前start和item连续，并且item与nextValue不连续
        if (_item - start >= 2) {
          // 至少三位连续
          newArray.push(
            isWeek
              ? `${numberToString[start]} - ${numberToString[_item]}`
              : `${start} - ${_item}号`,
          );
        } else {
          newArray.push(isWeek ? numberToString[start] : `${start}号`);
          newArray.push(isWeek ? numberToString[_item] : `${_item}号`);
        }
      } else if (previousItemValue !== previousValue && nextItemValue !== nextValue) {
        newArray.push(isWeek ? numberToString[_item] : `${_item}号`);
      }
    });
  }
  return newArray;
};

export default (props: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.data && form) {
      form.setFieldsValue(props.data);
    }
  }, [props.data, form]);

  const handleOptions = (value: OperationTimer) => {
    const _options: any = {
      time: undefined,
      when: undefined,
      extraTime: undefined,
    };

    const _timer = value;
    if (_timer.trigger === 'cron') {
      _options.time = _timer.cron;
    } else {
      let whenStr = '每天';
      if (_timer.when!.length) {
        whenStr = _timer!.trigger === 'week' ? '每周' : '每月';
        const whenStrArr = continuousValue(_timer.when! || [], _timer!.trigger);
        const whenStrArr3 = whenStrArr.splice(0, 3);
        whenStr += whenStrArr3.join('、');
        whenStr += `等${_timer.when!.length}天`;
      }
      _options.when = whenStr;
      if (_timer.once) {
        _options.time = _timer.once.time + ' 执行1次';
      } else if (_timer.period) {
        _options.time = _timer.period.from + '-' + _timer.period.to;
        _options.extraTime = `每${_timer.period.every}${timeUnitEnum[_timer.period.unit]}执行1次`;
      }
    }
    return _options;
  };

  return (
    <Modal
      title={'触发规则'}
      maskClosable={false}
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        const values = await form.validateFields();
        console.log(values);

        if (values) {
          const _options = handleOptions(values);
          props.save(values, _options);
          props.close();
        }
      }}
      width={700}
    >
      <Form form={form} layout={'vertical'}>
        <TimingTrigger name={[]} form={form} />
      </Form>
    </Modal>
  );
};

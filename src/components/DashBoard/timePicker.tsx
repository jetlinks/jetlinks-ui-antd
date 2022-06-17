import type { DatePickerProps } from 'antd';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export enum TimeKey {
  'today' = 'today',
  'week' = 'week',
  'month' = 'month',
  'year' = 'year',
}

export type TimeType = keyof typeof TimeKey;

type ValueType = { start: number; end: number; type: TimeType };

interface ExtraTimePickerProps extends Omit<DatePickerProps, 'onChange' | 'value'> {
  onChange?: (data: ValueType) => void;
  value?: ValueType;
  defaultTime?: TimeType;
  pickerTimeChange?: () => void;
  showTime?: boolean;
  showTimeTool?: boolean;
}

export const getTimeByType = (type: TimeType) => {
  switch (type) {
    case TimeKey.week:
      return moment().subtract(6, 'days').valueOf();
    case TimeKey.month:
      return moment().subtract(29, 'days').valueOf();
    case TimeKey.year:
      return moment().subtract(365, 'days').valueOf();
    default:
      return moment().startOf('day').valueOf();
  }
};

export default forwardRef((props: ExtraTimePickerProps, ref) => {
  const [radioValue, setRadioValue] = useState<TimeType | undefined>(undefined);

  const { value, onChange, ...extraProps } = props;

  const change = (startTime: number, endTime: number, type: TimeType) => {
    if (onChange) {
      onChange({
        start: startTime,
        end: endTime,
        type,
      });
    }
  };

  const timeChange = (type: TimeType) => {
    const endTime = moment(new Date()).valueOf();
    const startTime: number = getTimeByType(type);
    setRadioValue(type);
    change(startTime, endTime, type);
  };

  useImperativeHandle(ref, () => ({
    timeChange,
  }));

  useEffect(() => {
    timeChange(props.defaultTime || TimeKey.today);
  }, []);

  return (
    <>
      {
        // @ts-ignore
        <DatePicker.RangePicker
          {...extraProps}
          showTime={props.showTime}
          value={
            value && [
              moment(value && value.start ? value.start : new Date()),
              moment(value && value.end ? value.end : new Date()),
            ]
          }
          onChange={(rangeValue) => {
            setRadioValue(undefined);
            if (rangeValue && rangeValue.length === 2) {
              change(rangeValue[0]!.valueOf(), rangeValue[1]!.valueOf(), radioValue!);
            }
            if (props.pickerTimeChange) {
              props.pickerTimeChange();
            }
          }}
          renderExtraFooter={
            props.showTimeTool !== true
              ? () => (
                  <div style={{ padding: '12px 0' }}>
                    <Radio.Group
                      defaultValue="day"
                      buttonStyle="solid"
                      value={radioValue}
                      onChange={(e) => {
                        timeChange(e.target.value);
                      }}
                    >
                      <Radio.Button value={TimeKey.today}>当天</Radio.Button>
                      <Radio.Button value={TimeKey.week}>近一周</Radio.Button>
                      <Radio.Button value={TimeKey.month}>近一月</Radio.Button>
                      <Radio.Button value={TimeKey.year}>近一年</Radio.Button>
                    </Radio.Group>
                  </div>
                )
              : undefined
          }
        />
      }
    </>
  );
});

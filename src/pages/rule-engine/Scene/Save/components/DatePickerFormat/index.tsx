import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';

interface DatePickerFormat extends Omit<DatePickerProps, 'onChange'> {
  onChange?: (dateString: string, date: moment.Moment | null) => void;
}

export default (props: DatePickerFormat) => {
  const { value, onChange, format, ...extraProps } = props;
  const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

  const handleFormat = (f: DatePickerProps['format']): string => {
    if (f === 'string') {
      return defaultFormat;
    }

    return f as string;
  };

  const handleValue = (
    v: DatePickerProps['value'],
    f: DatePickerProps['format'],
  ): moment.Moment => {
    if (f === 'string') {
      const _format = handleFormat(f);
      return moment(moment(v, defaultFormat), _format).utc();
    } else {
      const _format = handleFormat(f);
      return moment(moment(v, defaultFormat), _format);
    }
  };

  return (
    <>
      {
        // @ts-ignore
        <DatePicker
          {...extraProps}
          format={handleFormat(format)}
          value={value ? handleValue(value, format) : undefined}
          onChange={(date, dateString) => {
            if (onChange) {
              onChange(dateString, date);
            }
          }}
        />
      }
    </>
  );
};

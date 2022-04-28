import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';

interface DatePickerFormat extends Omit<DatePickerProps, 'onChange'> {
  onChange?: (dateString: string, date: moment.Moment | null) => void;
}

export default (props: DatePickerFormat) => {
  const { value, onChange, ...extraProps } = props;

  return (
    <>
      {
        // @ts-ignore
        <DatePicker
          {...extraProps}
          value={typeof value === 'string' ? moment(value) : value}
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

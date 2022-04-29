import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
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
          value={
            value
              ? moment(value, props.format ? (props.format as string) : 'YYYY-MM-DD HH:mm:ss')
              : undefined
          }
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

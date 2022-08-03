import { connect, mapProps } from '@formily/react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import moment from 'moment';

interface DatePickerFormatProps extends Omit<DatePickerProps, 'onChange'> {
  onChange?: (dateString: string, date: moment.Moment | null) => void;
}

const DatePickerFormat = (props: DatePickerFormatProps) => {
  const { value, onChange, ...extraProps } = props;
  return (
    <>
      {
        // @ts-ignore
        <DatePicker
          {...extraProps}
          onChange={(date, dateString) => {
            if (onChange && date) {
              onChange(dateString, date);
            }
          }}
        />
      }
    </>
  );
};

const FDatePicker = connect((props: DatePickerFormatProps) => {
  return <DatePickerFormat {...props} />;
}, mapProps());

export default FDatePicker;

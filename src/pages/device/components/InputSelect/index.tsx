import { Select } from 'antd';
import { connect, mapProps } from '@formily/react';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const InputSelect = connect(
  Select,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      const [value, setValue] = useState(props.value);
      return {
        ...props,
        value: value,
        onChange: (item: any) => {
          if (item.length > 1) {
            setValue(item.slice(item.length - 1));
          } else {
            setValue(item);
          }
        },
        suffixIcon:
          field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffixIcon,
      };
    },
  ),
  // mapReadPretty(PreviewText.Input),
);
export default InputSelect;

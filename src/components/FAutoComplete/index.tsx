import { connect, mapProps, mapReadPretty } from '@formily/react';
import { AutoComplete as AntdAutoComplete } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { PreviewText } from '@formily/antd';

const FAutoComplete = connect(
  AntdAutoComplete,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon:
          field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffixIcon,
      };
    },
  ),
  mapReadPretty(PreviewText.Input),
);
export default FAutoComplete;

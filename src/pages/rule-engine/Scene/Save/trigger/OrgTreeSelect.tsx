import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';

interface OrgTreeSelect extends Omit<TreeSelectProps, 'onChange' | 'value'> {
  onChange?: (value: any[]) => void;
  value?: any;
}

export default (props: OrgTreeSelect) => {
  const [myValue, setMyValue] = useState(props.value ? props.value[0].id : undefined);
  const { value, onChange, ...extraProps } = props;

  const onchange = (key: string, label: React.ReactNode[]) => {
    if (props.onChange) {
      props.onChange([{ id: key, name: label[0] }]);
    }
  };

  useEffect(() => {
    if (props.value) {
      setMyValue(props.value[0].id);
    } else {
      setMyValue(undefined);
    }
  }, [props.value]);

  return <TreeSelect<string> value={myValue} onChange={onchange} {...extraProps} />;
};

import { TreeSelect } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface TimeSelectProps {
  options?: any[];
  value?: any[];
  onChange?: (value: any[]) => void;
  style?: React.CSSProperties;
}

export default (props: TimeSelectProps) => {
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);

  const propsChange = (keys: number[]) => {
    if (props.onChange) {
      props.onChange(keys);
    }
  };

  const onChange = useCallback(
    (keys: any[], _, extra) => {
      if (extra.triggerValue === 'all') {
        propsChange(extra.checked ? props.options!.map((item: any) => item.value) : []);
      } else {
        const noAllKeys = keys.filter((key) => key !== 'all');
        propsChange(noAllKeys);
      }
    },
    [checkedKeys, props.options],
  );

  useEffect(() => {
    setCheckedKeys(props.value || []);
    if (props.value && props.options) {
      if (props.value.length >= props.options.length) {
        setCheckedKeys([...props.value, 'all']);
      } else {
        setCheckedKeys(props.value);
      }
    } else {
      setCheckedKeys([]);
    }
  }, [props.value, props.options]);

  return (
    <TreeSelect
      treeCheckable
      value={checkedKeys}
      onChange={onChange}
      style={props.style}
      maxTagCount={0}
      placeholder={'请选择时间'}
      maxTagPlaceholder={(values) => {
        return <span className={''}>{values.map((item) => item.label).toString()}</span>;
      }}
      treeData={
        props.options && props.options.length
          ? [{ label: '全部', value: 'all' }, ...props.options]
          : []
      }
    />
  );
};

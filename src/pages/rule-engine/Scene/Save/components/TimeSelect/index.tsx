import { TreeSelect } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

type OptionsItemType = {
  label: string;
  value: string | number;
};

interface TimeSelectProps {
  options?: OptionsItemType[];
  value?: number[];
  onChange?: (value: number[]) => void;
  style?: React.CSSProperties;
}

export default (props: TimeSelectProps) => {
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);

  const onChange = useCallback(
    (keys: string[], _, extra) => {
      if (extra.triggerValue === 'all') {
        const newKeys = extra.checked ? ['all', ...props.options!.map((item) => item.value)] : [];
        setCheckedKeys(newKeys);
      } else {
        const noAllKeys = keys.filter((key) => key !== 'all');
        const newKeys = noAllKeys.length === props.options!.length ? ['all', ...keys] : noAllKeys;

        setCheckedKeys(newKeys);
      }
    },
    [checkedKeys, props.options],
  );

  useEffect(() => {}, [checkedKeys]);

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

import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { queryTag } from '@/pages/rule-engine/Scene/Save/action/service';

interface TagSelectProps {
  configId?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export default (props: TagSelectProps) => {
  const [value, setValue] = useState<string | undefined>(props.value);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.configId) {
      queryTag(props.configId).then((res) => {
        if (res.status === 200) {
          setOptions(res.result);
        } else {
          setOptions([]);
        }
      });
    } else {
      setOptions([]);
    }
  }, [props.configId]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <Select
      id={props.id}
      value={value}
      placeholder={'请选择标签'}
      options={options}
      fieldNames={{
        label: 'name',
        value: 'id',
      }}
      style={{ width: '100%' }}
      onChange={(key) => {
        if (props.onChange) {
          props.onChange(key);
        }
      }}
    />
  );
};

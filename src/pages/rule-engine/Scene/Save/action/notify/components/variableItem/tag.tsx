import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { queryTag } from '@/pages/rule-engine/Scene/Save/action/service';
import { NotifyModel } from '../../index';

interface TagSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default (props: TagSelectProps) => {
  const [value, setValue] = useState<string | undefined>(props.value);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (NotifyModel.notify?.notifierId) {
      queryTag(NotifyModel.notify.notifierId).then((res) => {
        if (res.status === 200) {
          setOptions(res.result);
        } else {
          setOptions([]);
        }
      });
    } else {
      setOptions([]);
    }
  }, [NotifyModel.notify.notifierId]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <Select
      value={value}
      placeholder={'请选择标签'}
      options={options}
      fieldNames={{
        label: 'name',
        value: 'id',
      }}
      style={{ width: '100%' }}
      onChange={(key, option: any) => {
        if (props.onChange) {
          NotifyModel.notify.options = {
            ...NotifyModel.notify.options,
            tagName: option ? option?.label : '',
          };
          props.onChange(key);
        }
      }}
    />
  );
};

import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/components/Metadata';
import { Store } from 'jetlinks-store';

interface Props {
  value: any;
  onChange: (value: string) => void;
}

const InputSelect = (props: Props) => {
  const [options, setOptions] = useState<any>([]);

  useEffect(() => {
    service.getUnit().then((resp) => {
      const _data = resp.result.map((item: any) => ({
        label: item.description,
        value: item.id,
      }));
      // 缓存单位数据
      Store.set('units', _data);
      setOptions(_data);
    });
  }, []);

  return (
    <Select
      showSearch
      showArrow
      allowClear
      mode={'tags'}
      onChange={(value) => {
        if (value.length > 1) {
          props.onChange(value.slice(value.length - 1));
        } else {
          props.onChange(value);
        }
      }}
      value={props.value}
      options={options}
      filterOption={(input: string, option: any) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    />
  );
};
export default InputSelect;

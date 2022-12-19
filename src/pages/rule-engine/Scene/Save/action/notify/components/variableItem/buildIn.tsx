import { DatePicker, Input, InputNumber, Select, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { BuiltInParamsHandleTreeData } from '@/pages/rule-engine/Scene/Save/components/BuiltInParams';
import moment from 'moment';
import { FormModel } from '@/pages/rule-engine/Scene/Save';

type ChangeType = {
  source?: string;
  value?: string;
  upperKey?: string;
};

interface BuiltInProps {
  value?: ChangeType;
  data?: any;
  onChange?: (value: ChangeType) => void;
  name: number;
}

export default (props: BuiltInProps) => {
  const [source, setSource] = useState(props.value?.source || 'fixed');
  const [value, setValue] = useState(props.value?.value);
  const [upperKey, setUpperKey] = useState(props.value?.upperKey);

  const [builtInList, setBuiltInList] = useState<any[]>([]);

  const onChange = (_source: string = 'fixed', _value?: any, _upperKey?: string) => {
    const obj: ChangeType = {
      source: _source,
    };
    if (_value) {
      obj.value = _value;
    }
    if (_upperKey) {
      obj.upperKey = _upperKey;
    }
    if (props.onChange) {
      props.onChange(obj);
    }
  };

  const sourceChangeEvent = async () => {
    const params = props.name - 1 >= 0 ? { action: props.name - 1 } : undefined;
    queryBuiltInParams(FormModel.current, params).then((res: any) => {
      if (res.status === 200) {
        const _data = BuiltInParamsHandleTreeData(res.result);
        setBuiltInList(_data);
      }
    });
  };

  useEffect(() => {
    if (source === 'upper') {
      sourceChangeEvent();
    }
  }, [source]);

  useEffect(() => {
    setSource(props.value?.source || 'fixed');
    setValue(props.value?.value);
    setUpperKey(props.value?.upperKey);
  }, [props.value]);

  const itemOnChange = useCallback(
    (_value: any) => {
      onChange(source, _value);
    },
    [source],
  );

  const sourceComponents = () => {
    if (source === 'upper') {
      return (
        <TreeSelect
          value={upperKey}
          treeData={builtInList}
          onChange={(key) => {
            onChange(source, undefined, key);
          }}
          fieldNames={{ label: 'name', value: 'id' }}
          placeholder={'请选择参数'}
        />
      );
    } else {
      const type = props.data?.type;
      if (type === 'date') {
        return (
          // @ts-ignore
          <DatePicker
            value={value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : undefined}
            style={{ width: '100%' }}
            format={'YYYY-MM-DD HH:mm:ss'}
            onChange={(_: any, dateString) => {
              itemOnChange(dateString);
            }}
          />
        );
      } else if (type === 'number') {
        return (
          <InputNumber
            value={value}
            placeholder={`请输入${props.data.name}`}
            style={{ width: '100%' }}
            onChange={itemOnChange}
          />
        );
      } else {
        return (
          <Input
            value={props.value?.value}
            placeholder={`请输入${props.data.name}`}
            onChange={(e) => {
              onChange(source, e.target.value);
            }}
          />
        );
      }
    }
  };

  return (
    <ItemGroup compact>
      <Select
        value={source}
        options={[
          { label: '手动输入', value: 'fixed' },
          { label: '内置参数', value: 'upper' },
        ]}
        style={{ width: 120 }}
        onChange={(key) => {
          setSource(key);
          onChange(key, undefined, undefined);
        }}
      />
      {sourceComponents()}
    </ItemGroup>
  );
};

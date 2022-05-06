import { DatePicker, Input, InputNumber, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import moment from 'moment';
import { debounce } from 'lodash';

type ChangeType = {
  source?: string;
  value?: string;
  upperKey?: string;
};

interface BuiltInProps {
  value?: ChangeType;
  data?: any;
  type?: string;
  onChange?: (value: ChangeType) => void;
}

export default (props: BuiltInProps) => {
  const [source, setSource] = useState(props.value?.source);
  const [value, setValue] = useState(props.value?.value);
  const [upperKey, setUpperKey] = useState(props.value?.upperKey);

  const [builtInList, setBuiltInList] = useState([]);

  const { run: getBuiltInList } = useRequest(queryBuiltInParams, {
    manual: true,
    formatResult: (res) => res.result,
    onSuccess: (res) => {
      setBuiltInList(res);
    },
  });

  useEffect(() => {
    if (source === 'upper') {
      getBuiltInList({
        trigger: { type: props.type },
      });
    }
  }, [source, props.type]);

  useEffect(() => {
    setSource(props.value?.source);
    setValue(props.value?.value);
    setUpperKey(props.value?.upperKey);
  }, [props.value]);

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
    console.log(_source, _value);
    if (props.onChange) {
      props.onChange(obj);
    }
  };

  const itemOnChange = useCallback(
    (_value: any) => {
      onChange(source, _value);
    },
    [source],
  );

  const inputChange = (e: any) => {
    itemOnChange(e.target.value);
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
      ></Select>
      {source === 'upper' ? (
        <Select
          value={upperKey}
          options={builtInList}
          onChange={(key) => {
            onChange(source, undefined, key);
          }}
          fieldNames={{ label: 'name', value: 'id' }}
          placeholder={'请选择参数'}
        />
      ) : (
        <div>
          {
            // inputNodeByType(props.data)
            props.data.type === 'date' ? (
              // @ts-ignore
              <DatePicker
                value={value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : undefined}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD HH:mm:ss'}
                onChange={(_: any, dateString) => {
                  itemOnChange(dateString);
                }}
              />
            ) : props.data.type === 'number' ? (
              <InputNumber
                value={value}
                placeholder={`请输入${props.data.name}`}
                style={{ width: '100%' }}
                onChange={itemOnChange}
              />
            ) : (
              <Input
                value={value}
                placeholder={`请输入${props.data.name}`}
                onChange={debounce(inputChange, 300)}
              />
            )
          }
        </div>
      )}
    </ItemGroup>
  );
};

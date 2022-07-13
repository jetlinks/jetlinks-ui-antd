import { DatePicker, Input, InputNumber, Select, TreeSelect } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { BuiltInParamsHandleTreeData } from '@/pages/rule-engine/Scene/Save/components/BuiltInParams';

import moment from 'moment';

type ChangeType = {
  source?: string;
  value?: string;
  upperKey?: string;
};

interface BuiltInProps {
  value?: ChangeType;
  data?: any;
  type?: string;
  notifyType?: string;
  onChange?: (value: ChangeType) => void;
  trigger?: any;
  parallel?: boolean;
  form: FormInstance;
  name: number;
}

export default (props: BuiltInProps) => {
  const [source, setSource] = useState(props.value?.source);
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

  const sourceChangeEvent = () => {
    onChange(source, undefined);
    const data = props.form.getFieldsValue();
    const params = props.name - 1 >= 0 ? { action: props.name - 1 } : undefined;
    queryBuiltInParams(data, params).then((res: any) => {
      if (res.status === 200) {
        const actionParams = res.result.filter((item: any) => item.id === `action_${props.name}`);
        const _data = BuiltInParamsHandleTreeData(props.name === 0 ? res.result : actionParams);
        setBuiltInList(_data);
      }
    });
  };

  useEffect(() => {
    if (source === 'upper') {
      sourceChangeEvent();
    }
  }, [source, props.trigger, props.parallel, props.type]);

  useEffect(() => {
    if (props.trigger?.trigger?.device?.productId && source === 'upper') {
      sourceChangeEvent();
    }
  }, [props.trigger?.trigger?.device?.productId, source]);

  useEffect(() => {
    setSource(props.value?.source);
    setValue(props.value?.value);
    setUpperKey(props.value?.upperKey);
  }, [props.value]);

  const itemOnChange = useCallback(
    (_value: any) => {
      onChange(source, _value);
    },
    [source],
  );

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
        <TreeSelect
          value={upperKey}
          treeData={builtInList}
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
                value={props.value?.value}
                placeholder={`请输入${props.data.name}`}
                onChange={(e) => {
                  onChange(source, e.target.value);
                }}
              />
            )
          }
        </div>
      )}
    </ItemGroup>
  );
};

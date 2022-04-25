import { useCallback, useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, Select, TreeSelect } from 'antd';
import type { FormInstance } from 'antd';
import { InputFile, ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { TriggerWayType } from '@/pages/rule-engine/Scene/Save/components/TriggerWay';

type ChangeType = {
  source?: string;
  value?: string;
  upperKey?: string;
};

interface VariableItemProps {
  data?: any;
  value?: any;
  notifyType?: string;
  form: FormInstance;
  onChange?: (value: ChangeType) => void;
}

const BuiltInSelectOptions = {
  [TriggerWayType.timing]: [
    { label: '设备名称', value: 'device-name' },
    { label: '设备ID', value: 'device-id' },
    { label: '产品名称', value: 'product-name' },
    { label: '产品ID', value: 'product-id' },
    { label: '系统时间', value: 'device-name' },
    { label: '设备名称', value: 'device-name' },
  ],
  [TriggerWayType.manual]: [],
  [TriggerWayType.device]: [],
};

export default (props: VariableItemProps) => {
  const [value, setValue] = useState<ChangeType | undefined>(props.value);
  const [type, setType] = useState('');

  const [triggerType, setTriggerType] = useState('');

  const getTrigger = () => {
    const { trigger } = props.form.getFieldsValue([['trigger', 'type']]);
    if (trigger) {
      setTriggerType(trigger.type);
    }
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setType(props.data.expands ? props.data.expands.businessType : props.data.type);
  }, []);

  const itemOnChange = useCallback(
    (val: any) => {
      setValue({
        source: value?.source,
        value: val,
      });
      if (props.onChange) {
        props.onChange({
          source: value?.source,
          value: val,
        });
      }
    },
    [props.onChange, value],
  );

  const inputNodeByType = useCallback(
    (data: any) => {
      const _type = data.expands ? data.expands.businessType : data.type;
      switch (_type) {
        case 'enum':
          return (
            <Select
              placeholder={`请选择${data.name}`}
              style={{ width: '100%' }}
              onChange={itemOnChange}
            />
          );
        case 'date':
          return (
            // @ts-ignore
            <DatePicker
              style={{ width: '100%' }}
              format={data.format || 'YYYY-MM-DD HH:mm:ss'}
              onChange={(date) => {
                itemOnChange(date?.format(data.format || 'YYYY-MM-DD HH:mm:ss'));
              }}
            />
          );
        case 'number':
          return (
            <InputNumber
              placeholder={`请输入${data.name}`}
              style={{ width: '100%' }}
              onChange={itemOnChange}
            />
          );
        case 'file':
          return <InputFile onChange={itemOnChange} />;
        case 'org':
          return <TreeSelect onChange={itemOnChange} />;
        case 'user':
          return <Select onChange={itemOnChange} />;
        default:
          return (
            <Input
              placeholder={`请输入${data.name}`}
              onChange={(e) => itemOnChange(e.target.value)}
            />
          );
      }
    },
    [props.onChange],
  );

  const addonBefore = useCallback(
    (_type: string) => {
      switch (_type) {
        case 'org':
          return null;
        case 'user':
          const options = [
            { label: '平台用户', value: 'fixed' },
            { label: props.notifyType === 'dingTalk' ? '钉钉用户' : '微信用户', value: 'relation' },
          ];
          return <Select value={value && value.source} options={options} style={{ width: 120 }} />;
        default:
          return (
            <Select
              value={value && value.source}
              options={[
                { label: '手动输入', value: 'fixed' },
                { label: '内置参数', value: 'upper' },
              ]}
              style={{ width: 120 }}
              onChange={(key) => {
                if (key === 'upper') {
                  getTrigger();
                }
                if (props.onChange) {
                  props.onChange({ source: key, value: undefined });
                }
                setValue({ source: key, value: undefined });
              }}
            />
          );
      }
    },
    [props.onChange, value, props.notifyType],
  );

  return (
    <ItemGroup>
      {addonBefore(type)}
      {value && value.source === 'upper' ? (
        <Select
          value={value.upperKey}
          options={BuiltInSelectOptions[triggerType] || []}
          style={{ width: '100%' }}
          onChange={(key) => {
            if (props.onChange) {
              props.onChange({ source: value.source, value: undefined, upperKey: key });
            }
          }}
        />
      ) : (
        <div> {inputNodeByType(props.data)} </div>
      )}
    </ItemGroup>
  );
};

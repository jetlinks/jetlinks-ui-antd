import { Col, DatePicker, FormInstance, Input, InputNumber, Row, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from '@@/plugin-request/request';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import moment from 'moment';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';

interface WritePropertyProps {
  properties: any[];
  type: string;
  form: FormInstance;
  value?: any;
  onChange?: (value?: any) => void;
}

export default (props: WritePropertyProps) => {
  const [source, setSource] = useState('fixed');
  const [builtInList, setBuiltInList] = useState([]);
  const [propertiesKey, setPropertiesKey] = useState<string | undefined>(undefined);
  const [propertiesValue, setPropertiesValue] = useState(undefined);
  const [propertiesType, setPropertiesType] = useState('');

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
    console.log('writeProperty', props.value);
    if (props.value && props.properties && props.properties.length) {
      if (0 in props.value) {
        setPropertiesValue(props.value[0]);
      } else {
        Object.keys(props.value).forEach((key: string) => {
          setPropertiesKey(key);
          setPropertiesValue(props.value[key]);
          const propertiesItem = props.properties.find((item: any) => item.id === key);
          if (propertiesItem) {
            setPropertiesType(propertiesItem.valueType.type);
          }
        });
      }
    }
  }, [props.value, props.properties]);

  const onChange = (key?: string, value?: any) => {
    if (props.onChange) {
      props.onChange({
        [key || 0]: value,
      });
    }
  };

  const inputNodeByType = useCallback(
    (type: string) => {
      switch (type) {
        case 'boolean':
          return (
            <Select
              style={{ width: '100%', textAlign: 'left' }}
              value={propertiesValue}
              options={[
                { label: 'true', value: true },
                { label: 'false', value: false },
              ]}
              placeholder={'请选择'}
              onChange={(value) => {
                onChange(propertiesKey, value);
              }}
            />
          );
        case 'int':
        case 'long':
        case 'float':
        case 'double':
          return (
            <InputNumber
              style={{ width: '100%' }}
              value={propertiesValue}
              placeholder={'请输入'}
              onChange={(value) => {
                onChange(propertiesKey, value);
              }}
            />
          );
        case 'date':
          return (
            // @ts-ignore
            <DatePicker
              style={{ width: '100%' }}
              value={propertiesValue ? moment(propertiesValue, 'YYYY-MM-DD HH:mm:ss') : undefined}
              onChange={(date) => {
                onChange(propertiesKey, date ? date.format('YYYY-MM-DD HH:mm:ss') : undefined);
              }}
            />
          );
        default:
          return (
            <Input
              style={{ width: '100%' }}
              value={propertiesValue}
              placeholder={'请输入'}
              onChange={(e) => onChange(propertiesKey, e.target.value)}
            />
          );
      }
    },
    [propertiesKey, propertiesValue],
  );

  return (
    <Row gutter={24}>
      <Col span={4}>
        <Select
          value={propertiesKey}
          options={props.properties}
          fieldNames={{ label: 'name', value: 'id' }}
          style={{ width: '100%' }}
          onSelect={(key: any) => {
            onChange(key, undefined);
          }}
          placeholder={'请选择属性'}
        ></Select>
      </Col>
      <Col span={7}>
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
            }}
          />
          {source === 'upper' ? (
            <Select
              options={builtInList}
              fieldNames={{ label: 'name', value: 'id' }}
              placeholder={'请选择参数'}
            />
          ) : (
            <div>{inputNodeByType(propertiesType)}</div>
          )}
        </ItemGroup>
      </Col>
    </Row>
  );
};

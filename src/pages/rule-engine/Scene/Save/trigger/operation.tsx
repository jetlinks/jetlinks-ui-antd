import { Col, Row, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import FunctionCall from '@/pages/rule-engine/Scene/Save/action/device/functionCall';
import { debounce } from 'lodash';

interface OperatorProps {
  propertiesList?: any[];
  value?: any;
  onChange?: (value: any) => void;
  id?: string;
}

export default (props: OperatorProps) => {
  const [data, setData] = useState<any>({});
  const [key, setKey] = useState<string[] | undefined>(undefined);
  const [propertiesItem, setPropertiesItem] = useState<any[]>([]);

  const objToArray = (_data: any) => {
    return Object.keys(_data).map((item) => {
      return { id: item, value: _data[item] };
    });
  };

  const findProperties = useCallback(
    (_key: string[], value: any) => {
      if (props.propertiesList) {
        return _key.map((item) => {
          const proItem = props.propertiesList!.find((a: any) => a.id === item);
          if (proItem) {
            return {
              id: proItem.id,
              name: proItem.name,
              type: proItem.valueType ? proItem.valueType.type : '-',
              format: proItem.valueType ? proItem.valueType.format : undefined,
              options: proItem.valueType ? proItem.valueType.elements : undefined,
              value: value[item],
            };
          }
          return {
            id: item,
            name: item,
            type: '',
            format: undefined,
            options: undefined,
            value: value[item],
          };
        });
      }
      return [];
    },
    [props.propertiesList],
  );

  const functionDataChange = useCallback(
    (value: any[]) => {
      if (props.onChange) {
        const _value = { ...props.value };
        value.forEach((item: any) => {
          _value[item.name] = item.value;
        });
        props.onChange(_value);
      }
    },
    [props],
  );

  useEffect(() => {
    console.log(props.value, props.propertiesList);
    if (props.value && props.propertiesList?.length) {
      console.log(Object.keys(props.value));
      const _key = Object.keys(props.value);
      setKey(_key);
      setData(objToArray(props.value));
      setPropertiesItem(findProperties(_key, props.value));
    } else {
      setData({});
      setKey(undefined);
    }
  }, [props.value, props.propertiesList]);

  return (
    <Row gutter={24}>
      <Col span={6}>
        <Select
          mode="multiple"
          id={props.id}
          options={props.propertiesList || []}
          value={key}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
          maxTagCount={'responsive'}
          style={{ width: '100%' }}
          placeholder={'请选择属性'}
          onSelect={(id: any) => {
            if (props.onChange) {
              props.onChange({ [id]: undefined });
            }
          }}
          onDeselect={(id: any) => {
            const _value: any = { ...props.value };
            if (id in props.value) {
              delete _value[id];
            } else {
              _value[id] = undefined;
            }
            if (props.onChange) {
              props.onChange(_value!);
            }
          }}
        />
      </Col>
      <Col span={18}>
        <span style={{ lineHeight: '32px' }}>定时调用所选属性</span>
      </Col>
      {key && (
        <Col span={24}>
          <FunctionCall
            value={data}
            functionData={propertiesItem}
            onChange={debounce(functionDataChange, 300)}
          />
        </Col>
      )}
    </Row>
  );
};

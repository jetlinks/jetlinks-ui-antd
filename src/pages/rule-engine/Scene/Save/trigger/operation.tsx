import { Col, Row, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import FunctionCall from '@/pages/rule-engine/Scene/Save/action/device/functionCall';

interface OperatorProps {
  propertiesList?: any[];
  value?: any;
  onChange?: (value: any) => void;
}

export default (props: OperatorProps) => {
  const [data, setData] = useState<any>({});
  const [key, setKey] = useState<string | undefined>(undefined);
  const [propertiesItem, setPropertiesItem] = useState<any[]>([]);

  const objToArray = (_data: any) => {
    return Object.keys(_data).map((item) => {
      return { id: item, value: _data[item] };
    });
  };

  const findProperties = useCallback(
    (_key: string, value: any) => {
      if (props.propertiesList) {
        const proItem = props.propertiesList.find((item: any) => item.id === _key);
        if (proItem) {
          return [
            {
              id: proItem.id,
              name: proItem.name,
              type: proItem.valueType ? proItem.valueType.type : '-',
              format: proItem.valueType ? proItem.valueType.format : undefined,
              options: proItem.valueType ? proItem.valueType.elements : undefined,
              value: value,
            },
          ];
        }
        return [];
      }
      return [];
    },
    [props.propertiesList],
  );

  useEffect(() => {
    if (props.value && props.propertiesList?.length) {
      const _key = Object.keys(props.value)[0];
      setKey(_key);
      setData(objToArray(props.value));
      setPropertiesItem(findProperties(_key, props.value[_key]));
    } else {
      setData({});
      setKey(undefined);
    }
  }, [props.value, props.propertiesList]);

  return (
    <Row>
      <Col span={24}>
        <Select
          options={props.propertiesList || []}
          value={key}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
          style={{ width: 300 }}
          placeholder={'请选择属性'}
          onSelect={(id: any) => {
            // TODO 多选
            if (props.onChange) {
              props.onChange({ [id]: {} });
            }
          }}
        />
        <span style={{ margin: '0 12px', lineHeight: '32px' }}>
          定时调用所选属性，修改后的属性值用于条件配置
        </span>
      </Col>
      {key && (
        <Col span={24}>
          <FunctionCall
            value={data}
            functionData={propertiesItem}
            onChange={(value) => {
              if (props.onChange) {
                props.onChange({
                  [value[0].name]: value[0].value,
                });
              }
            }}
          />
        </Col>
      )}
    </Row>
  );
};

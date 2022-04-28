import { Col, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import FunctionCall from '@/pages/rule-engine/Scene/Save/action/device/functionCall';

interface OperatorProps {
  propertiesList?: any[];
  value?: any;
  onChange?: (value: any) => void;
}

export default (props: OperatorProps) => {
  const [data, setData] = useState<any>({});
  const [key, setKey] = useState('');
  const [propertiesItem, setPropertiesItem] = useState<any[]>([]);

  const objToArray = (_data: any) => {
    return Object.keys(_data).map((item) => {
      return { id: item, value: _data[item] };
    });
  };

  useEffect(() => {
    if (props.value) {
      const _key = Object.keys(props.value)[0];
      setKey(_key);
      setData(objToArray(props.value[_key]));
    } else {
      setData({});
      setKey('');
    }
  }, [props.value]);

  return (
    <Row>
      <Col span={24}>
        <Select
          options={props.propertiesList || []}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
          style={{ width: 300 }}
          placeholder={'请选择属性'}
          onSelect={(id: any, _data: any) => {
            setPropertiesItem([
              {
                id: _data.id,
                name: _data.name,
                type: _data.valueType ? _data.valueType.type : '-',
                format: _data.valueType ? _data.valueType.format : undefined,
                options: _data.valueType ? _data.valueType.elements : undefined,
                value: undefined,
              },
            ]);
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
            value={[{ id: key, value: data[key] }]}
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

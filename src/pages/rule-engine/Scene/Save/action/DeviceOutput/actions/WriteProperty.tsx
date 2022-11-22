import { Col, Form, Row, Select } from 'antd';
// import { useEffect, useState } from "react";

interface Props {
  properties: any[];
  value?: any;
  id?: string;
  onChange?: (value?: any) => void;
  propertiesChange?: (value?: string) => void;
}

export default (props: Props) => {
  // const [propertiesKey, setPropertiesKey] = useState<string | undefined>(undefined);
  // const [propertiesValue, setPropertiesValue] = useState(undefined);
  // const [propertiesType, setPropertiesType] = useState('');

  // useEffect(() => {
  //     console.log(props.value);
  //     if (props.value) {
  //         if (props.properties && props.properties.length) {
  //             if (0 in props.value) {
  //                 setPropertiesValue(props.value[0]);
  //             } else if ('undefined' in props.value) {
  //                 setPropertiesKey(undefined);
  //                 setPropertiesValue(undefined);
  //             } else {
  //                 Object.keys(props.value).forEach((key: string) => {
  //                     setPropertiesKey(key);
  //                     setPropertiesValue(props.value[key].value);
  //                     const propertiesItem = props.properties.find((item: any) => item.id === key);
  //                     if (propertiesItem) {
  //                         setPropertiesType(propertiesItem.valueType.type);
  //                     }
  //                 });
  //             }
  //         }
  //     } else {
  //         setPropertiesKey(undefined);
  //         setPropertiesValue(undefined);
  //     }
  // }, [props.value, props.properties]);
  return (
    <Row gutter={24}>
      <Col span={24}>
        <Form.Item
          name={['device', 'message', 'properties']}
          label="设置属性"
          rules={[{ required: true, message: '请选择属性' }]}
        >
          <Select
            id={props.id}
            value={props.value ? props.value[0] : undefined}
            options={props.properties.filter((item) => {
              if (item.expands && item.expands.type) {
                return item.expands.type.includes('write');
              }
              return false;
            })}
            fieldNames={{ label: 'name', value: 'id' }}
            style={{ width: '100%' }}
            placeholder={'请选择属性'}
          ></Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['device', 'message', 'properties']}
          label="设置属性"
          rules={[{ required: true, message: '请选择属性' }]}
        >
          <Select
            id={props.id}
            value={props.value ? props.value[0] : undefined}
            options={props.properties.filter((item) => {
              if (item.expands && item.expands.type) {
                return item.expands.type.includes('write');
              }
              return false;
            })}
            fieldNames={{ label: 'name', value: 'id' }}
            style={{ width: '100%' }}
            placeholder={'请选择属性'}
          ></Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

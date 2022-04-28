import { useCallback, useEffect, useState } from 'react';
import { Col, Form, Row, Select, Space, TreeSelect } from 'antd';
import type { FormInstance } from 'antd';
import { TimingTrigger } from '@/pages/rule-engine/Scene/Save/components';
import { getProductList } from '@/pages/rule-engine/Scene/Save/action/device/service';
import { queryOrgTree, querySelector } from '@/pages/rule-engine/Scene/Save/trigger/service';
import Device from '@/pages/rule-engine/Scene/Save/action/device/deviceModal';
import FunctionCall from '@/pages/rule-engine/Scene/Save/action/device/functionCall';
import Operation from './operation';

interface TriggerProps {
  value?: string;
  onChange?: (type: string) => void;
  form?: FormInstance;
}

enum OperatorEnum {
  'online' = 'online',
  'offline' = 'offline',
  'reportEvent' = 'reportEvent',
  'reportProperty' = 'reportProperty',
  'readProperty' = 'readProperty',
  'writeProperty' = 'writeProperty',
  'invokeFunction' = 'invokeFunction',
}

export default (props: TriggerProps) => {
  const [productList, setProductList] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  const [selector, setSelector] = useState('fixed');

  const [selectorOptions, setSelectorOptions] = useState<any[]>([]);
  const [operation, setOperation] = useState<string | undefined>(undefined);
  const [operatorOptions, setOperatorOptions] = useState<any[]>([]);

  const [properties, setProperties] = useState<any[]>([]); // 属性
  const [events, setEvents] = useState([]); // 事件
  const [functions, setFunctions] = useState([]); // 功能列表

  const [functionItem, setFunctionItem] = useState<any[]>([]); // 单个功能-属性列表
  const [orgTree, setOrgTree] = useState<any>([]);

  const getProducts = async () => {
    const resp = await getProductList({ paging: false });
    if (resp && resp.status === 200) {
      setProductList(resp.result);
    }
  };

  const getSelector = () => {
    querySelector().then((resp) => {
      if (resp && resp.status === 200) {
        setSelectorOptions(resp.result);
      }
    });
  };

  const getOrgTree = useCallback(() => {
    queryOrgTree(productId).then((resp) => {
      if (resp && resp.status === 200) {
        setOrgTree(resp.result);
      }
    });
  }, [queryOrgTree]);

  const handleMetadata = (metadata?: string) => {
    try {
      const metadataObj = JSON.parse(metadata || '{}');
      let newOperator: any[] = [
        { label: '设备上线', value: OperatorEnum.online },
        { label: '设备离线', value: OperatorEnum.offline },
      ];
      if (metadataObj.properties && metadataObj.properties.length) {
        newOperator = [
          ...newOperator,
          { label: '属性上报', value: OperatorEnum.reportProperty },
          { label: '属性读取', value: OperatorEnum.readProperty },
          { label: '修改属性', value: OperatorEnum.writeProperty },
        ];
        setProperties(metadataObj.properties);
      }
      if (metadataObj.events && metadataObj.events.length) {
        newOperator = [...newOperator, { label: '事件上报', value: OperatorEnum.reportEvent }];
        setEvents(metadataObj.events);
      }
      if (metadataObj.functions && metadataObj.functions.length) {
        newOperator = [...newOperator, { label: '功能调用', value: OperatorEnum.invokeFunction }];
        setFunctions(metadataObj.functions);
      }
      setOperatorOptions(newOperator);
    } catch (err) {
      console.warn('handleMetadata === ', err);
    }
  };

  useEffect(() => {
    getProducts();
    getSelector();
  }, []);

  return (
    <div>
      <Row>
        <Col span={24}>
          <Space>
            <Form.Item name={['trigger', 'device', 'productId']}>
              <Select
                options={productList}
                placeholder={'请选择产品'}
                style={{ width: 220 }}
                listHeight={220}
                onChange={(key: any, node: any) => {
                  props.form?.resetFields([['trigger', 'device', 'selector']]);
                  props.form?.resetFields([['trigger', 'device', 'selectorValues']]);
                  props.form?.resetFields([['trigger', 'device', 'operation', 'operator']]);
                  props.form?.resetFields([['trigger', 'device', 'operation', 'operator']]);
                  setOperation(undefined);
                  setProductId(key);
                  handleMetadata(node.metadata);
                  if (selector === 'org') {
                    getOrgTree();
                  }
                }}
                fieldNames={{ label: 'name', value: 'id' }}
              />
            </Form.Item>
            <Form.Item name={['trigger', 'device', 'selector']} initialValue={'fixed'}>
              <Select
                options={selectorOptions}
                fieldNames={{ label: 'name', value: 'id' }}
                onSelect={(key: string) => {
                  if (key === 'org') {
                    getOrgTree();
                  }
                  setSelector(key);
                }}
                style={{ width: 120 }}
              />
            </Form.Item>
            {selector === 'fixed' && (
              <Form.Item name={['trigger', 'device', 'selectorValues']}>
                <Device productId={productId} />
              </Form.Item>
            )}
            {selector === 'org' && (
              <Form.Item name={['trigger', 'device', 'selectorValues']}>
                <TreeSelect
                  treeData={orgTree}
                  fieldNames={{ label: 'name', value: 'id' }}
                  placeholder={'请选择部门'}
                  style={{ width: 300 }}
                />
              </Form.Item>
            )}
            {functions.length || events.length || properties.length ? (
              <Form.Item name={['trigger', 'device', 'operation', 'operator']}>
                <Select
                  placeholder={'请选择触发类型'}
                  options={operatorOptions}
                  style={{ width: 140 }}
                  onSelect={setOperation}
                />
              </Form.Item>
            ) : null}
          </Space>
        </Col>
        {operation === OperatorEnum.invokeFunction || operation === OperatorEnum.writeProperty ? (
          <Col>
            <Form.Item name={['trigger', 'device', 'operation', 'timer']}>
              <TimingTrigger />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      {operation === OperatorEnum.invokeFunction && (
        <>
          <Row>
            <Col span={12}>
              <Form.Item name={['trigger', 'device', 'operation', 'functionId']}>
                <Select
                  options={functions}
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                  }}
                  placeholder={'请选择功能'}
                  onSelect={(_: any, data: any) => {
                    const _properties = data.valueType ? data.valueType.properties : data.inputs;
                    const array = [];
                    for (const datum of _properties) {
                      array.push({
                        id: datum.id,
                        name: datum.name,
                        type: datum.valueType ? datum.valueType.type : '-',
                        format: datum.valueType ? datum.valueType.format : undefined,
                        options: datum.valueType ? datum.valueType.elements : undefined,
                        value: undefined,
                      });
                    }
                    setFunctionItem(array);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <span style={{ margin: '0 12px', lineHeight: '32px' }}>
                定时调用所选功能，功能返回值用于条件配置
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name={['trigger', 'device', 'operation', 'functionParameters']}>
                <FunctionCall functionData={functionItem} />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      {operation === OperatorEnum.writeProperty && (
        <Row>
          <Col span={24}>
            <Form.Item name={['trigger', 'device', 'operation', 'writeProperties']}>
              <Operation
                propertiesList={properties.filter((item) => {
                  if (item.expands) {
                    return item.expands.type ? item.expands.type.includes('write') : false;
                  }
                  return false;
                })}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      {operation === OperatorEnum.readProperty && (
        <Row>
          <Col>
            <Form.Item name={['trigger', 'device', 'operation', 'readProperties']} noStyle>
              <Select
                mode={'multiple'}
                options={properties.filter((item) => {
                  if (item.expands) {
                    return item.expands.type ? item.expands.type.includes('read') : false;
                  }
                  return false;
                })}
                maxTagCount={0}
                maxTagPlaceholder={(values) => {
                  return (
                    <div style={{ maxWidth: 'calc(100% - 8px)' }}>
                      {values.map((item) => item.label).toString()}
                    </div>
                  );
                }}
                style={{ width: 300 }}
                fieldNames={{ label: 'name', value: 'id' }}
              />
            </Form.Item>
            <span style={{ margin: '0 12px' }}>定时读取所选属性值，用于条件配置</span>
          </Col>
        </Row>
      )}
    </div>
  );
};

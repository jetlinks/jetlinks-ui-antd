// 已废弃
import { useCallback, useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Col, Form, Row, Select, TreeSelect } from 'antd';
import { ItemGroup, TimingTrigger } from '@/pages/rule-engine/Scene/Save/components';
import { getProductList } from '@/pages/rule-engine/Scene/Save/action/device/service';
import { queryOrgTree, querySelector } from '@/pages/rule-engine/Scene/Save/trigger/service';
import Device from '@/pages/rule-engine/Scene/Save/action/device/deviceModal';
import FunctionCall from '@/pages/rule-engine/Scene/Save/action/device/functionCall';
import Operation from './operation';
import classNames from 'classnames';
import { observer } from '@formily/reactive-react';
import { FormModel } from '../index';
import AllDevice from '@/pages/rule-engine/Scene/Save/action/device/AllDevice';

interface TriggerProps {
  value?: string;
  onChange?: (type: string) => void;
  triggerData?: any;
  form?: FormInstance;
  className?: string;
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

export default observer((props: TriggerProps) => {
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
  }, [queryOrgTree, productId]);

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

  const productIdChange = useCallback(
    (id: string, metadata: any) => {
      setProductId(id);
      handleMetadata(metadata);
      if (selector === 'org') {
        getOrgTree();
      }
    },
    [selector],
  );

  const getProducts = async () => {
    const resp = await getProductList({ paging: false });
    if (resp && resp.status === 200) {
      setProductList(resp.result);
      if (FormModel.trigger && FormModel.trigger.device) {
        const productItem = resp.result.find(
          (item: any) => item.id === FormModel.trigger!.device.productId,
        );

        if (productItem) {
          productIdChange(FormModel.trigger!.device.productId, productItem.metadata);
        }
      }
    }
  };

  useEffect(() => {
    getProducts();
    getSelector();
  }, []);

  useEffect(() => {
    const triggerData = props.triggerData;
    console.log('trigger', triggerData);
    if (triggerData && triggerData.device) {
      const _device = triggerData.device;

      if (_device.selector) {
        if (_device.selector === 'org') {
          getOrgTree();
        }
        setSelector(_device.selector);
      }

      if (_device.operation && 'operator' in _device.operation) {
        setOperation(_device.operation.operator);
      } else {
        setOperation(undefined);
      }
    }
  }, [props.triggerData]);

  return (
    <div className={classNames(props.className)}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            name={['trigger', 'device', 'productId']}
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select
              options={productList}
              placeholder={'请选择产品'}
              style={{ width: '100%' }}
              listHeight={220}
              onChange={(key: any, node: any) => {
                props.form?.resetFields([['trigger', 'device', 'selector']]);
                props.form?.resetFields([['trigger', 'device', 'selectorValues']]);
                props.form?.resetFields([['trigger', 'device', 'operation', 'operator']]);
                productIdChange(key, node.metadata);
              }}
              fieldNames={{ label: 'name', value: 'id' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item noStyle>
            <ItemGroup>
              <Form.Item
                name={['trigger', 'device', 'selector']}
                initialValue={
                  props.triggerData && props.triggerData.device && props.triggerData.device.selector
                    ? props.triggerData.device.selector
                    : 'fixed'
                }
              >
                <Select
                  options={selectorOptions}
                  fieldNames={{ label: 'name', value: 'id' }}
                  style={{ width: 120 }}
                />
              </Form.Item>
              {selector === 'all' && (
                <Form.Item name={['trigger', 'device', 'selectorValues']}>
                  <AllDevice productId={productId} />
                </Form.Item>
              )}
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
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              )}
            </ItemGroup>
          </Form.Item>
        </Col>
        <Col span={6}>
          {functions.length || events.length || properties.length ? (
            <Form.Item
              name={['trigger', 'device', 'operation', 'operator']}
              initialValue={undefined}
              rules={[{ required: true, message: '请选择触发类型' }]}
            >
              <Select
                placeholder={'请选择触发类型'}
                options={operatorOptions}
                style={{ width: '100%' }}
              />
            </Form.Item>
          ) : null}
        </Col>
      </Row>
      {operation === OperatorEnum.invokeFunction || operation === OperatorEnum.writeProperty ? (
        <Form.Item name={['trigger', 'device', 'operation', 'timer']}>
          <TimingTrigger />
        </Form.Item>
      ) : null}
      {operation === OperatorEnum.invokeFunction && (
        <>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name={['trigger', 'device', 'operation', 'functionId']}
                rules={[{ required: true, message: '请选择功能' }]}
              >
                <Select
                  showSearch
                  options={functions}
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                  }}
                  style={{ width: '100%' }}
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
                  filterOption={(input: string, option: any) =>
                    option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <span style={{ lineHeight: '32px' }}>定时调用所选功能，功能返回值用于条件配置</span>
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
            <Form.Item
              name={['trigger', 'device', 'operation', 'writeProperties']}
              rules={[{ required: true, message: '请输入修改值' }]}
            >
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
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              name={['trigger', 'device', 'operation', 'readProperties']}
              noStyle
              rules={[{ required: true, message: '请选择属性' }]}
            >
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
                placeholder={'请选择属性'}
                style={{ width: '100%' }}
                fieldNames={{ label: 'name', value: 'id' }}
              />
            </Form.Item>
          </Col>
          <Col span={18}>
            <span style={{ lineHeight: '32px' }}>定时读取所选属性值</span>
          </Col>
        </Row>
      )}
      {operation === OperatorEnum.reportEvent && (
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              name={['trigger', 'device', 'operation', 'eventId']}
              noStyle
              rules={[{ required: true, message: '请选择事件' }]}
            >
              <Select
                options={events}
                placeholder={'请选择事件'}
                style={{ width: '100%' }}
                fieldNames={{ label: 'name', value: 'id' }}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    </div>
  );
});

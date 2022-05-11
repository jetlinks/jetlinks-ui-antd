import { useCallback, useEffect, useState } from 'react';
import { Col, Form, Row, Select, TreeSelect } from 'antd';
import { ItemGroup, TimingTrigger } from '@/pages/rule-engine/Scene/Save/components';
import { getProductList } from '@/pages/rule-engine/Scene/Save/action/device/service';
import { queryOrgTree } from '@/pages/rule-engine/Scene/Save/trigger/service';
import Device from '@/pages/rule-engine/Scene/Save/action/device/deviceModal';
import FunctionCall from '@/pages/rule-engine/Scene/Save/action/device/functionCall';
import Operation from './operation';
import classNames from 'classnames';
import { FormModel } from '../index';
import AllDevice from '@/pages/rule-engine/Scene/Save/action/device/AllDevice';

interface DeviceData {
  productId?: string;
  source?: string;
  selector?: any;
  selectorValues?: any[];
  relation?: any;
  upperKey?: string;
  operation?: {
    operator?: string;
    timer?: any;
    eventId?: string;
    readProperties?: string[];
    writeProperties?: any;
    functionId?: string;
    functionParameters?: { name: string; value: any }[];
  };
}

interface TriggerProps {
  value?: DeviceData;
  onChange?: (value: DeviceData) => void;
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

export default (props: TriggerProps) => {
  const [productList, setProductList] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  // const [selector, setSelector] = useState('fixed');

  // const [selectorOptions, setSelectorOptions] = useState<any[]>([]);
  // const [operation, setOperation] = useState<string | undefined>(undefined);
  const [operatorOptions, setOperatorOptions] = useState<any[]>([]);

  const [properties, setProperties] = useState<any[]>([]); // 属性
  const [events, setEvents] = useState([]); // 事件
  const [functions, setFunctions] = useState([]); // 功能列表

  const [functionItem, setFunctionItem] = useState<any[]>([]); // 单个功能-属性列表
  const [orgTree, setOrgTree] = useState<any>([]);

  const onChange = (value: DeviceData) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  // const getSelector = () => {
  //   querySelector().then((resp) => {
  //     if (resp && resp.status === 200) {
  //       setSelectorOptions(resp.result);
  //     }
  //   });
  // };

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
    },
    [props.value],
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
    // getSelector();
  }, []);

  useEffect(() => {
    const triggerData: any = props.value;
    console.log('trigger', triggerData);
    if (triggerData) {
      if (triggerData.selector) {
        if (triggerData.selector === 'org') {
          queryOrgTree(triggerData.productId).then((resp) => {
            if (resp && resp.status === 200) {
              setOrgTree(resp.result);
            }
          });
        }
      }
    }
  }, [props.value]);

  return (
    <div className={classNames(props.className)}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            noStyle
            rules={[
              {
                validator: async (_: any, value: any) => {
                  console.log('productId', value);
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              showSearch
              value={props.value?.productId}
              options={productList}
              placeholder={'请选择产品'}
              style={{ width: '100%' }}
              listHeight={220}
              onChange={(key: any, node: any) => {
                productIdChange(key, node.metadata);
                onChange({
                  productId: key,
                  selectorValues: undefined,
                  selector: 'fixed',
                  operation: {
                    operator: undefined,
                  },
                });
              }}
              fieldNames={{ label: 'name', value: 'id' }}
              filterOption={(input: string, option: any) =>
                option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
        </Col>
        {props.value?.productId ? (
          <Col span={12}>
            <ItemGroup compact>
              <Select
                value={props.value?.selector}
                options={[
                  { label: '全部设备', value: 'all' },
                  { label: '固定设备', value: 'fixed' },
                  { label: '按部门', value: 'org' },
                ]}
                style={{ width: 120 }}
                onSelect={(value: string) => {
                  const _value = { ...props.value };
                  _value.selector = value;
                  _value.selectorValues = undefined;
                  onChange(_value);
                }}
              />
              {props.value?.selector === 'all' && (
                <AllDevice
                  value={props.value?.selectorValues}
                  productId={productId}
                  onChange={(value) => {
                    const _value = { ...props.value };
                    _value.selectorValues = value;
                    onChange(_value);
                  }}
                />
              )}
              {props.value?.selector === 'fixed' && (
                <Device
                  value={props.value?.selectorValues}
                  productId={productId}
                  onChange={(value) => {
                    const _value = { ...props.value };
                    _value.selectorValues = value;
                    onChange(_value);
                  }}
                />
              )}
              {props.value?.selector === 'org' && (
                <TreeSelect
                  value={
                    props.value?.selectorValues && props.value?.selectorValues.length
                      ? props.value?.selectorValues[0].id
                      : undefined
                  }
                  treeData={orgTree}
                  fieldNames={{ label: 'name', value: 'id' }}
                  placeholder={'请选择部门'}
                  style={{ width: '100%' }}
                  onChange={(value, label) => {
                    const _value = { ...props.value };
                    _value.selectorValues = [{ id: value, name: label[0] }];
                    onChange(_value);
                  }}
                />
              )}
            </ItemGroup>
          </Col>
        ) : null}
        <Col span={6}>
          {functions.length || events.length || properties.length ? (
            <Select
              value={props.value?.operation?.operator}
              placeholder={'请选择触发类型'}
              options={operatorOptions}
              style={{ width: '100%' }}
              onChange={(value) => {
                const _value = { ...props.value };
                _value.operation!.operator = value;
                onChange(_value);
              }}
            />
          ) : null}
        </Col>
      </Row>
      {props.value?.operation?.operator === OperatorEnum.invokeFunction ||
      props.value?.operation?.operator === OperatorEnum.readProperty ||
      props.value?.operation?.operator === OperatorEnum.writeProperty ? (
        <TimingTrigger
          value={props.value?.operation?.timer}
          onChange={(value) => {
            const _value = { ...props.value };
            _value.operation!.timer = value;
            onChange(_value);
          }}
        />
      ) : null}
      {props.value?.operation?.operator === OperatorEnum.invokeFunction && (
        <>
          <Row gutter={24}>
            <Col span={6}>
              <Select
                value={props.value?.operation?.functionId}
                options={functions}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                style={{ width: '100%' }}
                placeholder={'请选择功能'}
                onSelect={(key: any, data: any) => {
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
                  const _value = { ...props.value };
                  _value.operation!.functionId = key;
                  onChange(_value);
                }}
              />
            </Col>
            <Col span={18}>
              <span style={{ lineHeight: '32px' }}>定时调用所选功能</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FunctionCall
                value={props.value?.operation?.functionParameters}
                functionData={functionItem}
                onChange={(value) => {
                  const _value = { ...props.value };
                  _value.operation!.functionParameters = value;
                  onChange(_value);
                }}
              />
            </Col>
          </Row>
        </>
      )}
      {props.value?.operation?.operator === OperatorEnum.writeProperty && (
        <Row>
          <Col span={24}>
            <Operation
              value={props.value?.operation?.writeProperties}
              propertiesList={properties.filter((item) => {
                if (item.expands) {
                  return item.expands.type ? item.expands.type.includes('write') : false;
                }
                return false;
              })}
              onChange={(value) => {
                const _value = { ...props.value };
                _value.operation!.writeProperties = value;
                onChange(_value);
              }}
            />
          </Col>
        </Row>
      )}
      {props.value?.operation?.operator === OperatorEnum.readProperty && (
        <Row gutter={24}>
          <Col span={6}>
            <Select
              value={props.value?.operation?.readProperties}
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
              onChange={(value) => {
                if (props.value) {
                  const _value = { ...props.value };
                  _value!.operation!.readProperties = value;
                  onChange(_value);
                }
              }}
            />
          </Col>
          <Col span={18}>
            <span style={{ lineHeight: '32px' }}>定时读取所选属性值</span>
          </Col>
        </Row>
      )}
      {props.value?.operation?.operator === OperatorEnum.reportEvent && (
        <Row gutter={24}>
          <Col span={6}>
            <Select
              value={props.value?.operation?.eventId}
              options={events}
              placeholder={'请选择事件'}
              style={{ width: '100%' }}
              fieldNames={{ label: 'name', value: 'id' }}
              onChange={(value) => {
                if (props.value) {
                  const _value = { ...props.value };
                  _value!.operation!.eventId = value;
                  onChange(_value);
                }
              }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

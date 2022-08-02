import type { FormInstance } from 'antd';
import { Col, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getProductList } from '@/pages/rule-engine/Scene/Save/action/device/service';
import Device from './deviceModal';
import TagModal from './tagModal';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import RelationSelect from './relationSelect';
import encodeQuery from '@/utils/encodeQuery';

interface DeviceProps {
  name: number;
  triggerType: string;
  form?: FormInstance;
  value?: any;
  restField?: any;
  onProperties: (data: any) => void;
  onMessageTypeChange: (type: string) => void;
  onFunctionChange: (functionItem: any) => void;
  parallel?: boolean;
  onProductIdChange: (id: string) => void;
  isEdit?: boolean;
}

enum SourceEnum {
  'all' = 'all',
  'fixed' = 'fixed',
  'tag' = 'tag',
  'relation' = 'relation',
}

const DefaultSourceOptions = [{ label: '固定设备', value: SourceEnum.fixed }];

export enum MessageTypeEnum {
  'WRITE_PROPERTY' = 'WRITE_PROPERTY',
  'READ_PROPERTY' = 'READ_PROPERTY',
  'INVOKE_FUNCTION' = 'INVOKE_FUNCTION',
}

export default (props: DeviceProps) => {
  const { name } = props;

  const [productId, setProductId] = useState<string>('');
  const [sourceList, setSourceList] = useState(DefaultSourceOptions);
  const [productList, setProductList] = useState<any[]>([]);
  const [selector, setSelector] = useState(props.value ? props.value.selector : SourceEnum.fixed);
  const [messageType, setMessageType] = useState(MessageTypeEnum.WRITE_PROPERTY);
  const [functionId, setFunctionId] = useState('');
  const [functionList, setFunctionList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const handleMetadata = (metadata?: string) => {
    try {
      const metadataObj = JSON.parse(metadata || '{}');
      if (props.onProperties) {
        props.onProperties(metadataObj.properties || []);
      }
      if (!metadataObj.functions) {
        if (props.onFunctionChange) {
          props.onFunctionChange([]);
        }
      }
      setTagList(metadataObj.tags || []);
      setFunctionList(metadataObj.functions || []);
    } catch (err) {
      console.warn('handleMetadata === ', err);
    }
  };

  const getProducts = async () => {
    const params = encodeQuery({
      paging: false,
      sorts: { createTime: 'desc' },
    });
    const resp = await getProductList(params);
    if (resp && resp.status === 200) {
      setProductList(resp.result);
      if (props.value && props.value.productId) {
        const productItem = resp.result.find((item: any) => item.id === props.value.productId);
        if (productItem) {
          handleMetadata(productItem.metadata);
        }
      }
    }
  };

  useEffect(() => {
    if (props.triggerType === 'device') {
      setSourceList([
        ...DefaultSourceOptions,
        { label: '按关系', value: SourceEnum.relation },
        { label: '按标签', value: SourceEnum.tag },
      ]);
    } else {
      setSourceList(DefaultSourceOptions);
    }
    const actions = props.form?.getFieldValue('actions');

    if (actions[name] && actions[name].device && !props.isEdit) {
      if (actions[name].device.selector) {
        actions[name].device.selector = SourceEnum.fixed;
      }
      if (actions[name].device.selectorValues) {
        console.log('useEffect');
        actions[name].device.selectorValues = undefined;
      }
    }
    props.form?.setFieldsValue({
      actions,
    });
    setSelector(SourceEnum.fixed);
  }, [props.triggerType]);

  useEffect(() => {
    if (productId && productList.length) {
      const productItem = productList.find((item: any) => item.id === props.value.productId);
      if (productItem) {
        handleMetadata(productItem.metadata);
      }
    }
  }, [productId]);

  useEffect(() => {
    if (functionId && functionList.length) {
      const functionItem: any = functionList.find((item: any) => item.id === functionId);
      if (functionItem) {
        const properties = functionItem.valueType
          ? functionItem.valueType.properties
          : functionItem.inputs;
        if (props.onFunctionChange) {
          const array = [];
          for (const datum of properties) {
            array.push({
              id: datum.id,
              name: datum.name,
              type: datum.valueType ? datum.valueType.type : '-',
              format: datum.valueType ? datum.valueType.format : undefined,
              options: datum.valueType ? datum.valueType.elements : undefined,
              value: undefined,
            });
          }
          props.onFunctionChange(array);
        }
      }
    }
  }, [functionId, functionList]);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const deviceData = props.value;
    if (deviceData) {
      setProductId(deviceData.productId);

      setSelector(deviceData.selector || SourceEnum.fixed);

      if (deviceData.message) {
        if (deviceData.message.messageType) {
          if (props.onMessageTypeChange) {
            props.onMessageTypeChange(deviceData.message.messageType);
          }
          setMessageType(deviceData.message.messageType);
        }

        if (deviceData.message.functionId) {
          setFunctionId(deviceData.message.functionId);
        }
      }
    }
  }, [props.value]);

  return (
    <>
      <Col span={5}>
        <Form.Item
          name={[name, 'device', 'productId']}
          rules={[{ required: true, message: '请选择产品' }]}
        >
          <Select
            showSearch
            allowClear
            options={productList}
            placeholder={'请选择产品'}
            style={{ width: '100%' }}
            listHeight={220}
            onChange={(value) => {
              // setMessageType(MessageTypeEnum.WRITE_PROPERTY)
              props.form?.setFields([
                { name: ['actions', name, 'device', 'selector'], value: SourceEnum.fixed },
                { name: ['actions', name, 'device', 'selectorValues'], value: undefined },
                { name: ['actions', name, 'device', 'message', 'functionId'], value: undefined },
              ]);
              props.onProductIdChange(value);
            }}
            fieldNames={{ label: 'name', value: 'id' }}
            filterOption={(input: string, option: any) =>
              option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
      </Col>
      <Col span={7}>
        <ItemGroup compact>
          <Form.Item
            name={[name, 'device', 'selector']}
            initialValue={SourceEnum.fixed}
            {...props.restField}
          >
            <Select
              options={sourceList}
              style={{ width: 120 }}
              onSelect={(key: string) => {
                setSelector(key);
              }}
            />
          </Form.Item>
          {selector === SourceEnum.fixed && (
            <Form.Item
              name={[name, 'device', 'selectorValues']}
              {...props.restField}
              rules={[{ required: true, message: '请选择设备' }]}
            >
              <Device productId={productId} />
            </Form.Item>
          )}
          {selector === SourceEnum.tag && (
            <Form.Item
              name={[name, 'device', 'selectorValues']}
              {...props.restField}
              rules={[{ required: true, message: '请选择标签' }]}
            >
              <TagModal tagData={tagList} />
            </Form.Item>
          )}
          {selector === SourceEnum.relation && (
            <Form.Item
              name={[name, 'device', 'selectorValues']}
              {...props.restField}
              rules={[{ required: true, message: '请选择关系人' }]}
            >
              <RelationSelect />
            </Form.Item>
          )}
        </ItemGroup>
      </Col>
      <Col span={4}>
        <Form.Item
          name={[name, 'device', 'message', 'messageType']}
          initialValue={
            props.value && props.value.message && props.value.message.messageType
              ? props.value.message.messageType
              : MessageTypeEnum.WRITE_PROPERTY
          }
          {...props.restField}
        >
          <Select
            options={[
              { label: '功能调用', value: MessageTypeEnum.INVOKE_FUNCTION },
              { label: '读取属性', value: MessageTypeEnum.READ_PROPERTY },
              { label: '设置属性', value: MessageTypeEnum.WRITE_PROPERTY },
            ]}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        {messageType === MessageTypeEnum.INVOKE_FUNCTION ? (
          <Form.Item
            name={[name, 'device', 'message', 'functionId']}
            {...props.restField}
            rules={[{ required: true, message: '请选择功能' }]}
          >
            <Select
              showSearch
              allowClear
              options={functionList}
              fieldNames={{ label: 'name', value: 'id' }}
              style={{ width: '100%' }}
              placeholder={'请选择功能'}
              filterOption={(input: string, option: any) =>
                option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
        ) : null}
      </Col>
      {selector === SourceEnum.fixed || selector === SourceEnum.tag ? (
        <Form.Item name={[name, 'device', 'source']} initialValue={'fixed'} hidden>
          <Input />
        </Form.Item>
      ) : (
        <>
          <Form.Item name={[name, 'device', 'source']} initialValue={'upper'} hidden>
            <Input />
          </Form.Item>
          <Form.Item name={[name, 'device', 'upperKey']} initialValue={'deviceId'} hidden>
            <Input />
          </Form.Item>
        </>
      )}
    </>
  );
};

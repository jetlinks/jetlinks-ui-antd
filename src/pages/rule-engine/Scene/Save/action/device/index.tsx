import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { getProductList } from '@/pages/rule-engine/Scene/Save/action/device/service';
import Device from './deviceModal';
import TagModal from './tagModal';

interface DeviceProps {
  name: number;
  triggerType: string;
  form?: FormInstance;
  restField?: any;
  onProperties: (data: any) => void;
  onMessageTypeChange: (type: string) => void;
  onFunctionChange: (functionItem: any) => void;
}

enum SourceEnum {
  'fixed' = 'fixed',
  'tag' = 'tag',
  'relation' = '',
}

const DefaultSourceOptions = [
  { label: '固定设备', value: SourceEnum.fixed },
  { label: '按标签', value: SourceEnum.tag },
];

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
  const [selector, setSelector] = useState(SourceEnum.fixed);
  const [messageType, setMessageType] = useState(MessageTypeEnum.WRITE_PROPERTY);
  const [functionList, setFunctionList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const getProducts = async () => {
    const resp = await getProductList({ paging: false });
    if (resp && resp.status === 200) {
      setProductList(resp.result);
    }
  };
  useEffect(() => {
    props.form?.resetFields([['actions', name, 'device', 'selector']]);
    if (props.triggerType === 'device') {
      setSourceList([...DefaultSourceOptions, { label: '按关系', value: SourceEnum.relation }]);
    } else {
      setSourceList(DefaultSourceOptions);
    }
  }, [props.triggerType]);

  useEffect(() => {
    getProducts();
  }, []);

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

  return (
    <>
      <Form.Item name={[name, 'device', 'productId']}>
        <Select
          options={productList}
          placeholder={'请选择产品'}
          style={{ width: 220 }}
          listHeight={220}
          onChange={(key: any, node: any) => {
            props.form?.resetFields([['actions', name, 'device', 'selector']]);
            props.form?.resetFields([['actions', name, 'device', 'selectorValues']]);
            props.form?.resetFields([['actions', name, 'device', 'message', 'functionId']]);
            // setMessageType(MessageTypeEnum.WRITE_PROPERTY)
            setProductId(key);
            handleMetadata(node.metadata);
          }}
          fieldNames={{ label: 'name', value: 'id' }}
        />
      </Form.Item>
      <Form.Item
        name={[name, 'device', 'selector']}
        initialValue={SourceEnum.fixed}
        {...props.restField}
      >
        <Select
          options={sourceList}
          style={{ width: 120 }}
          onChange={(key) => {
            setSelector(key);
          }}
        />
      </Form.Item>
      {selector === SourceEnum.fixed && (
        <Form.Item name={[name, 'device', 'selectorValues']} {...props.restField}>
          <Device productId={productId} />
        </Form.Item>
      )}
      {selector === SourceEnum.tag && (
        <Form.Item name={[name, 'device', 'selectorValues']} {...props.restField}>
          <TagModal tagData={tagList} />
        </Form.Item>
      )}
      {selector === SourceEnum.relation && (
        <Form.Item name={[name, 'device', 'selectorValues']} {...props.restField}>
          <Select style={{ width: 300 }} />
        </Form.Item>
      )}
      <Form.Item
        name={[name, 'device', 'message', 'messageType']}
        initialValue={MessageTypeEnum.WRITE_PROPERTY}
        {...props.restField}
      >
        <Select
          options={[
            { label: '功能调用', value: MessageTypeEnum.INVOKE_FUNCTION },
            { label: '读取属性', value: MessageTypeEnum.READ_PROPERTY },
            { label: '设置属性', value: MessageTypeEnum.WRITE_PROPERTY },
          ]}
          onSelect={(key: any) => {
            if (props.onMessageTypeChange) {
              props.onMessageTypeChange(key);
            }
            setMessageType(key);
          }}
          style={{ width: 120 }}
        />
      </Form.Item>
      {messageType === MessageTypeEnum.INVOKE_FUNCTION ? (
        <Form.Item name={[name, 'device', 'message', 'functionId']}>
          <Select
            options={functionList}
            fieldNames={{ label: 'name', value: 'id' }}
            style={{ width: 120 }}
            placeholder={'请选择功能'}
            onSelect={(_: any, data: any) => {
              const properties = data.valueType ? data.valueType.properties : data.inputs;
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
            }}
          />
        </Form.Item>
      ) : null}
      <Form.Item name={[name, 'device', 'source']} hidden>
        <Input />
      </Form.Item>
    </>
  );
};

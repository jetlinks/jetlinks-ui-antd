import { observer } from '@formily/reactive-react';
import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import TopCard from '../device/TopCard';
import DeviceModel from '../model';
import FunctionCall from './functionCall';
import ReadProperty from './ReadProperty';
import WriteProperty from './WriteProperty';

interface Props {
  get: (data: any) => void;
  name: number;
  thenName: number;
  branchGroup?: number;
}

export default observer((props: Props) => {
  const [form] = Form.useForm();
  const [deviceMessageType, setDeviceMessageType] = useState('');
  const [properties, setProperties] = useState([]); // 物模型-属性
  const [functionList, setFunctionList] = useState<any>([]); // 物模型-功能
  const [functionId, setFunctionId] = useState('');
  const [functions, setFunctions] = useState([]);

  const TypeList = [
    {
      label: '功能调用',
      value: 'INVOKE_FUNCTION',
      image: require('/public/images/scene/invoke-function.png'),
      tip: '-',
    },
    {
      label: '读取属性',
      value: 'READ_PROPERTY',
      image: require('/public/images/scene/read-property.png'),
      tip: '-',
    },
    {
      label: '设置属性',
      value: 'WRITE_PROPERTY',
      image: require('/public/images/scene/write-property.png'),
      tip: '-',
    },
  ];

  useEffect(() => {
    if (DeviceModel.productDetail) {
      const metadata = JSON.parse(DeviceModel.productDetail?.metadata || '{}');
      setProperties(metadata.properties);
      setFunctions(metadata.functions);
    }
  }, [DeviceModel.productDetail]);

  useEffect(() => {
    if (functionId && functions.length !== 0) {
      const functionItem: any = functions.find((item: any) => item.id === functionId);
      if (functionItem) {
        const item = functionItem.valueType
          ? functionItem.valueType.properties
          : functionItem.inputs;
        const array = [];
        for (const datum of item) {
          array.push({
            id: datum.id,
            name: datum.name,
            type: datum.valueType ? datum.valueType.type : '-',
            format: datum.valueType ? datum.valueType.format : undefined,
            options: datum.valueType ? datum.valueType.elements : undefined,
            value: undefined,
          });
        }
        setFunctionList(array);
      }
    }
  }, [functions, functionId]);

  useEffect(() => {
    if (DeviceModel.message.messageType) {
      setDeviceMessageType(DeviceModel.message.messageType);
    }
    if (DeviceModel.message.functionId) {
      setFunctionId(DeviceModel.message.functionId);
    }
  }, [DeviceModel.message]);

  useEffect(() => {
    props.get(form);
  }, [form]);

  return (
    <div>
      <Form
        form={form}
        layout={'vertical'}
        initialValues={{
          message: DeviceModel.message,
        }}
      >
        <Form.Item
          name={['message', 'messageType']}
          label="动作类型"
          required
          rules={[{ required: true, message: '请选择动作类型' }]}
          // initialValue="WRITE_PROPERTY"
        >
          <TopCard
            typeList={TypeList}
            onChange={(value: string) => {
              setDeviceMessageType(value);
              console.log(value);
              form.setFieldsValue({
                message: {
                  properties: [],
                },
              });
            }}
          />
        </Form.Item>
        {deviceMessageType === 'INVOKE_FUNCTION' && (
          <>
            <Form.Item
              name={['message', 'functionId']}
              label="功能调用"
              rules={[{ required: true, message: '请选择功能' }]}
            >
              <Select
                showSearch
                allowClear
                options={functions}
                fieldNames={{ label: 'name', value: 'id' }}
                style={{ width: '100%' }}
                placeholder={'请选择功能'}
                filterOption={(input: string, option: any) =>
                  option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value, option) => {
                  setFunctionId(value);
                  // console.log(option.name)
                  DeviceModel.propertiesName = option.name;
                }}
              />
            </Form.Item>
            {functionId && (
              <Form.Item
                name={['message', 'inputs']}
                rules={[{ required: true, message: '请输入功能值' }]}
              >
                <FunctionCall functionData={functionList} name={props.name} />
              </Form.Item>
            )}
          </>
        )}
        {deviceMessageType === 'READ_PROPERTY' && (
          <Form.Item
            name={['message', 'properties']}
            label="读取属性"
            rules={[{ required: true, message: '请选择读取属性' }]}
          >
            <ReadProperty
              properties={properties}
              onChange={(_, text) => {
                console.log(text);
                DeviceModel.propertiesName = text;
              }}
            />
          </Form.Item>
        )}
        {deviceMessageType === 'WRITE_PROPERTY' && (
          <Form.Item
            name={['message', 'properties']}
            label="设置属性"
            rules={[
              // { required: true, message: '请选择属性' },
              () => ({
                validator(_, value) {
                  const isValue = Object.values(value)?.[0];
                  // console.log('-------',isValue,value)
                  if (isValue) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请选择属性'));
                },
              }),
            ]}
          >
            <WriteProperty
              properties={properties}
              name={props.name}
              branchGroup={props.branchGroup}
              thenName={props.thenName}
              onColumns={(col, text) => {
                DeviceModel.columns = [col];
                DeviceModel.actionName = text;
              }}
              onChange={(value, text, valueLable) => {
                const item = value[Object.keys(value)?.[0]]?.value;
                DeviceModel.propertiesName = text;
                if (valueLable) {
                  DeviceModel.propertiesValue = valueLable;
                } else {
                  DeviceModel.propertiesValue = `${item}`;
                }
              }}
              onRest={(value: any) => {
                form.setFieldValue(['message', 'properties'], {
                  [value]: undefined,
                });
              }}
            />
          </Form.Item>
        )}
      </Form>
    </div>
  );
});

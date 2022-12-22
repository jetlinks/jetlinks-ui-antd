import { Col, Form, Row, Select } from 'antd';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import TopCard from './TopCard';
import { TriggerDeviceModel } from './addModel';
import TimingTrigger from '../components/TimingTrigger';
import Operation from '../trigger/operation';
import FunctionCall from '../action/device/functionCall';
import type { DeviceModelProps } from './addModel';

export enum OperatorType {
  'online' = 'online',
  'offline' = 'offline',
  'reportEvent' = 'reportEvent',
  'reportProperty' = 'reportProperty',
  'readProperty' = 'readProperty',
  'writeProperty' = 'writeProperty',
  'invokeFunction' = 'invokeFunction',
}

export const TypeName = {
  online: '设备上线',
  offline: '设备离线',
  reportEvent: '事件上报',
  reportProperty: '属性上报',
  readProperty: '读取属性',
  writeProperty: '修改属性',
  invokeFunction: '功能调用',
};

const TypeEnum = {
  reportProperty: {
    label: '属性上报',
    value: OperatorType.reportProperty,
    image: require('/public/images/scene/reportProperty.png'),
  },
  reportEvent: {
    label: '事件上报',
    value: OperatorType.reportEvent,
    image: require('/public/images/scene/reportProperty.png'),
  },
  readProperty: {
    label: '读取属性',
    value: OperatorType.readProperty,
    image: require('/public/images/scene/readProperty.png'),
  },
  writeProperty: {
    label: '修改属性',
    value: OperatorType.writeProperty,
    image: require('/public/images/scene/writeProperty.png'),
  },
  invokeFunction: {
    label: '功能调用',
    value: OperatorType.invokeFunction,
    image: require('/public/images/scene/invokeFunction.png'),
  },
};

type OperatorTypeKeys = keyof typeof OperatorType;

interface Props {
  data: DeviceModelProps;
}

export default forwardRef((props: Props, ref) => {
  const [form] = Form.useForm();

  const operator: OperatorTypeKeys = Form.useWatch('operator', form);

  const [readProperty, setReadProperty] = useState<any[]>([]);
  const [writeProperty, setWriteProperty] = useState<any[]>([]);
  // const [reportProperty, setReportProperty] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [functions, setFunctions] = useState<any[]>([]);
  const [functionItem, setFunctionItem] = useState<any[]>([]);

  const [TypeList, setTypeList] = useState([
    {
      label: '设备上线',
      value: 'online',
      image: require('/public/images/scene/online.png'),
    },
    {
      label: '设备离线',
      value: 'offline',
      image: require('/public/images/scene/offline.png'),
    },
  ]);

  const TimeFilterArray: OperatorTypeKeys[] = [
    OperatorType.readProperty,
    OperatorType.writeProperty,
    OperatorType.invokeFunction,
  ];

  const handleFunction = (fcItem: any) => {
    if (fcItem) {
      const _properties = fcItem.valueType ? fcItem.valueType.properties : fcItem.inputs;
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
    }
  };

  const handleInit = (data: DeviceModelProps) => {
    form.setFieldsValue({
      ...data.operation,
    });

    const newTypeList = [...TypeList];
    console.log('handleInit', data);

    if (data.metadata.events?.length) {
      newTypeList.push(TypeEnum.reportEvent);
      setEvents(data.metadata.events);
    }

    if (data.metadata.properties?.length) {
      const _readProperty = data.metadata.properties.filter(
        (item) => !!item.expands.type?.includes('read'),
      );
      const _writeProperty = data.metadata.properties.filter(
        (item) => !!item.expands.type?.includes('write'),
      );

      const _reportProperty = data.metadata.properties.filter(
        (item) => !!item.expands.type?.includes('report'),
      );

      setReadProperty(_readProperty);
      setWriteProperty(_writeProperty);
      // setReportProperty(_reportProperty);

      if (_readProperty.length) {
        newTypeList.push(TypeEnum.readProperty);
      }
      if (_writeProperty.length) {
        newTypeList.push(TypeEnum.writeProperty);
      }
      if (_reportProperty.length) {
        newTypeList.push(TypeEnum.reportProperty);
      }
    }

    if (data.metadata.functions?.length) {
      newTypeList.push(TypeEnum.invokeFunction);
      setFunctions(data.metadata.functions);

      if (data.operation?.functionId) {
        const fcItem = data.metadata.functions.find(
          (item) => item.id === data.operation!.functionId,
        );
        handleFunction(fcItem);
      }
    }

    setTypeList(newTypeList);
  };

  useEffect(() => {
    if (props.data) {
      handleInit(props.data);
    }
  }, [props.data]);

  useImperativeHandle(ref, () => ({
    validateFields: form.validateFields,
  }));

  return (
    <div
      style={{
        maxHeight: 'calc(100vh - 350px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Form form={form} layout={'vertical'}>
        <Form.Item name="operator" label="触发类型" required initialValue={'online'}>
          <TopCard
            typeList={TypeList}
            labelBottom={true}
            onSelect={() => {
              if (TimeFilterArray.includes(operator)) {
                form.setFieldsValue({
                  timer: {
                    trigger: 'week',
                    mod: 'period',
                  },
                });
              }
            }}
          />
        </Form.Item>
        {TimeFilterArray.includes(operator) && <TimingTrigger name={['timer']} form={form} />}
        {operator === OperatorType.readProperty && (
          <Row>
            <Col span={8}>
              <Form.Item
                name={'readProperties'}
                rules={[{ required: true, message: '请选择属性' }]}
              >
                <Select
                  mode={'multiple'}
                  options={readProperty}
                  maxTagCount={'responsive'}
                  placeholder={'请选择属性'}
                  style={{ width: '100%' }}
                  fieldNames={{ label: 'name', value: 'id' }}
                  onSelect={(v: any, propertyItem: any) => {
                    TriggerDeviceModel.options.action = '读取' + propertyItem.name;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item>定时读取所选属性值</Form.Item>
            </Col>
          </Row>
        )}
        {operator === OperatorType.writeProperty && (
          <Form.Item name={'writeProperties'} rules={[{ required: true, message: '请输入修改值' }]}>
            <Operation
              propertiesList={writeProperty}
              onSelect={(a, item) => {
                TriggerDeviceModel.options.action = '修改' + item.name;
              }}
            />
          </Form.Item>
        )}
        {operator === OperatorType.reportEvent && (
          <Form.Item name={'eventId'} rules={[{ required: true, message: '请选择事件' }]}>
            <Select
              options={events}
              placeholder={'请选择事件'}
              style={{ width: '100%' }}
              fieldNames={{ label: 'name', value: 'id' }}
              onSelect={(v: any, evenItem: any) => {
                TriggerDeviceModel.options.action = evenItem.name + '上报';
              }}
            />
          </Form.Item>
        )}
        {operator === OperatorType.invokeFunction && (
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name={'functionId'} rules={[{ required: true, message: '请选择功能' }]}>
                <Select
                  showSearch
                  allowClear
                  options={functions}
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                  }}
                  style={{ width: '100%' }}
                  placeholder={'请选择功能'}
                  filterOption={(input: string, option: any) =>
                    option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={(v: any, fcItem: any) => {
                    TriggerDeviceModel.options.action = '执行' + fcItem.name;
                    handleFunction(fcItem);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item>定时调用所选功能</Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={'functionParameters'}>
                <FunctionCall functionData={functionItem} name={'functionForm'} />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
});

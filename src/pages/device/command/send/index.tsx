import { message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { createLinkageUtils } from '@/utils/textUtils';
import SchemaForm, { createFormActions, FormEffectHooks, FormPath } from '@formily/antd';
import { Select, Input, ArrayTable, DatePicker } from '@formily/antd-components';
import Service from '../service';
import CheckDevice from '@/components/check-device';
import style from '../index.less';

interface Props {
  close: Function;
}
const actions = createFormActions();

const Send = (props: Props) => {
  const service = new Service('device/message/task');

  const { onFieldValueChange$, onFieldChange$ } = FormEffectHooks;

  const [productList, setProductList] = useState<any>([]);
  const funcRef = useRef<any>({});
  const productRef = useRef<any>({});
  useEffect(() => {
    service.productList().subscribe(data => {
      productList.current = data;
      setProductList(data);
    });
  }, []);
  const effects = () => {
    const { setFieldState } = actions;
    const linkage = createLinkageUtils();

    onFieldValueChange$('message.messageType').subscribe(({ value }) => {
      setFieldState(`*(message.properties.$A_key,message.properties.$A_value)`, state => {
        state.visible = value === 'WRITE_PROPERTY';
      });
      setFieldState(`*(message.functionId,message.inputs)`, state => {
        state.visible = value === 'INVOKE_FUNCTION';
      });
      setFieldState(`*(message.properties.$A_read)`, state => {
        state.visible = value === 'READ_PROPERTY';
        state.props['x-component-props'] = {
          mode: 'multiple',
        };
      });
    });
    onFieldValueChange$('productId').subscribe(({ value }) => {
      const product = productList.current.find((item: any) => item.id === value);
      productRef.current = product;
      if (!product?.metadata) return;

      linkage.enum(
        'message.properties.$A_read',
        JSON.parse(product?.metadata).properties.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      );
      linkage.enum(
        'message.properties.$A_key',
        JSON.parse(product?.metadata).properties.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      );
      linkage.enum(
        'message.functionId',
        JSON.parse(product?.metadata).functions.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      );

      setFieldState('deviceId', state => {
        state.props['x-component-props'] = { productId: value };
        return state;
      });
    });

    onFieldValueChange$('message.functionId').subscribe(({ value }) => {
      const metadata = productRef.current?.metadata;
      const func =
        metadata && JSON.parse(metadata).functions.find((item: any) => item.id === value)?.inputs;

      funcRef.current = func;
      func &&
        linkage.value(
          'message.inputs',
          func.map((item: any) => ({
            name: item.id,
            key: `${item.name}(${item.id})`,
            value: null,
          })),
        );
    });

    onFieldChange$('message.inputs.*.key').subscribe(({ name, value }) => {
      if (!funcRef.current) return;
      const data = funcRef.current.find((item: any) => `${item.name}(${item.id})` === value);
      const type = data?.valueType?.type;

      setFieldState(
        FormPath.transform(name!, /\d/, $1 => `message.inputs.${$1}.value`),
        state => {
          if (type === 'enum') {
            state.props.enum = data.valueType.elements.map((i: any) => ({
              label: i.text,
              value: i.value,
            }));
          } else if (type === 'date') {
            state.props['x-component'] = 'DatePicker';
            state.props['x-component-props'] = { showTime: true };
            state.value = null;
          } else {
            state.props['x-component'] = 'input';
          }
          return state;
        },
      );
    });

    onFieldValueChange$('message.properties.$A_key').subscribe(({ value }) => {
      if (!productRef.current?.metadata) return;
      const properties = JSON.parse(productRef.current.metadata).properties;
      const property = properties.find((item: any) => item.id === value);
      if (!property) return;
      const type = property?.valueType?.type;
      setFieldState('message.properties.$A_value', state => {
        if (type === 'enum') {
          state.props.enum = property.valueType.elements.map((i: any) => ({
            label: i.text,
            value: i.value,
          }));
          state.props['x-component'] = 'Select';
        } else if (type === 'boolean') {
          const valueType = property?.valueType;
          const temp = [
            { label: valueType.trueText, value: valueType.trueValue },
            { label: valueType.falseText, value: valueType.falseValue },
          ];
          state.props.enum = temp;
          state.props['x-component'] = 'Select';
        }
        return state;
      });
    });
  };

  const sendCommand = (data: any) => {
    // properteis:{key:'xx',value:'xxx'}转换成properteis:{xx:'xxxx'}
    const property = data.message.properties;
    if (property) {
      data.message.properties[property.$A_key] = property.$A_value;
      delete data.message.properties.$A_key;
      delete data.message.properties.$A_value;
      if (property.$A_read) {
        data.message.properties = property.$A_read;
        delete data.message.properties.$A_read;
      }
    }
    service.sendCommand(data).subscribe(
      resp => {
        message.success('操作成功');
      },
      () => {},
      () => props.close(),
    );
  };
  return (
    <Modal
      width="60vw"
      visible
      title="下发指令"
      onCancel={() => props.close()}
      onOk={() => actions.submit()}
      className={style.box}
    >
      <SchemaForm
        effects={effects}
        onSubmit={data => sendCommand(data)}
        actions={actions}
        components={{
          Input,
          Select,
          TextArea: Input.TextArea,
          CheckDevice,
          ArrayTable,
          DatePicker,
        }}
        schema={{
          type: 'object',
          properties: {
            NO_NAME_FIELD_$0: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
                autoRow: true,
                responsive: {
                  lg: 4,
                  m: 2,
                  s: 1,
                },
              },
              properties: {
                productId: {
                  'x-mega-props': {
                    span: 2,
                    labelCol: 4,
                  },
                  title: '产品',
                  enum: productList.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  })),
                  'x-component': 'select',
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                deviceId: {
                  'x-mega-props': {
                    span: 2,
                    labelCol: 4,
                  },
                  title: '设备',
                  'x-component': 'CheckDevice',
                },
                'message.messageType': {
                  'x-mega-props': {
                    span: 2,
                    labelCol: 4,
                  },
                  title: '指令',
                  'x-component': 'select',
                  enum: [
                    { label: '读取属性', value: 'READ_PROPERTY' },
                    { label: '设置属性', value: 'WRITE_PROPERTY' },
                    { label: '调用功能', value: 'INVOKE_FUNCTION' },
                  ],
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                'message.properties.$A_read': {
                  visible: false,
                  'x-mega-props': {
                    span: 2,
                    labelCol: 4,
                  },
                  title: '属性',
                  'x-component': 'select',
                  enum: [],
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                'message.properties.$A_key': {
                  visible: false,
                  'x-mega-props': {
                    span: 2,
                    labelCol: 4,
                  },
                  title: '属性',
                  'x-component': 'select',
                  enum: [],
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                'message.properties.$A_value': {
                  visible: false,
                  'x-mega-props': {
                    span: 4,
                    labelCol: 2,
                  },
                  title: '属性值',
                  'x-component': 'input',
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                'message.functionId': {
                  visible: false,
                  'x-mega-props': {
                    span: 2,
                    labelCol: 4,
                  },
                  title: '功能',
                  'x-component': 'select',
                  enum: [],
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                'message.inputs': {
                  visible: false,
                  'x-mega-props': {
                    span: 4,
                    labelCol: 2,
                  },
                  title: '参数',
                  type: 'array',
                  'x-component': 'arraytable',
                  'x-component-props': {
                    renderAddition: () => null,
                    renderMoveDown: () => null,
                    renderMoveUp: () => null,
                  },
                  items: {
                    type: 'object',
                    properties: {
                      key: {
                        'x-component': 'input',
                        title: '参数',
                        'x-component-props': {
                          readOnly: true,
                        },
                      },
                      value: {
                        'x-component': 'select',
                        'x-component-props': {
                          width: '100%',
                        },
                        title: '值',
                      },
                    },
                  },
                },
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default Send;

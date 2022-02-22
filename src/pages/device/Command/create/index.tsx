import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, Input, FormItem, Select, Space, ArrayTable } from '@formily/antd';
import { action } from '@formily/reactive';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/device/Command';
import { message, Modal } from 'antd';
import FSelectDevices from '@/components/FSelectDevices';
import { useRef } from 'react';
import type { DeviceMetadata, ProductItem } from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  close: () => void;
  visible: boolean;
}

const Create = (props: Props) => {
  const intl = useIntl();
  const { close, visible } = props;
  const products = useRef<ProductItem[]>([]);

  const metadataRef = useRef<DeviceMetadata>();
  const form = createForm({
    validateFirst: true,
    initialValues: {},
    effects() {
      onFieldValueChange('productId', (field, f) => {
        const value = (field as Field).value;
        const product = products.current.find((item) => item.id === value);
        const deviceId = field.query('deviceId').take();
        deviceId.setComponentProps({
          productId: value,
        });

        const metadata = JSON.parse(product?.metadata as string) as DeviceMetadata;
        metadataRef.current = metadata;
        f.setFieldState(field.query('message.properties.key'), (state) => {
          state.dataSource = metadata?.properties.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        });
        f.setFieldState(field.query('message.functionId'), (state) => {
          state.dataSource = metadata?.functions.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        });
      });
      onFieldValueChange('message.functionId', (field, f1) => {
        const value = (field as Field).value;
        const func = metadataRef.current?.functions.find((item) => item.id === value)?.inputs;
        f1.setFieldState(field.query('message.inputs'), (state) => {
          state.value = func?.map((item) => ({
            key: `${item.name}(${item.id})`,
            value: null,
            name: item.id,
          }));
        });
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FSelectDevices,
      ArrayTable,
      Space,
    },
  });

  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((data: any) => {
        products.current = data.result;
        field.dataSource = data.result.map((item: any) => ({ label: item.name, value: item.id }));
        field.loading = false;
      }),
    );
  };

  const loadData = async () => service.queryProduct();

  const schema: ISchema = {
    type: 'object',
    properties: {
      productId: {
        title: intl.formatMessage({
          id: 'pages.device.command.product',
          defaultMessage: '产品',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
      },
      deviceId: {
        title: intl.formatMessage({
          id: 'pages.device.command.device',
          defaultMessage: '设备',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'FSelectDevices',
        'x-component-props': {
          type: 'multi',
        },
      },
      message: {
        type: 'object',
        properties: {
          messageType: {
            title: intl.formatMessage({
              id: 'pages.device.command.command',
              defaultMessage: '指令',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              {
                label: intl.formatMessage({
                  id: 'pages.device.command.type.readProperty',
                  defaultMessage: '读取属性',
                }),
                value: 'READ_PROPERTY',
              },
              {
                label: intl.formatMessage({
                  id: 'pages.device.command.type.writeProperty',
                  defaultMessage: '设置属性',
                }),
                value: 'WRITE_PROPERTY',
              },
              {
                label: intl.formatMessage({
                  id: 'pages.device.command.type.invokeFunction',
                  defaultMessage: '调用功能',
                }),
                value: 'INVOKE_FUNCTION',
              },
            ],
          },
          properties: {
            type: 'object',
            properties: {
              key: {
                title: intl.formatMessage({
                  id: 'pages.device.command.property',
                  defaultMessage: '属性',
                }),
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: [],
                'x-reactions': {
                  dependencies: ['..messageType'],
                  fulfill: {
                    state: {
                      visible: "{{['READ_PROPERTY','WRITE_PROPERTY'].includes($deps[0])}}",
                      componentProps: {
                        mode: "{{$deps[0]==='READ_PROPERTY'&&'multiple'}}",
                      },
                    },
                  },
                },
                'x-visible': false,
              },
              value: {
                title: intl.formatMessage({
                  id: 'pages.device.command.set.value',
                  defaultMessage: '设置值',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-reactions': {
                  dependencies: ['..messageType'],
                  fulfill: {
                    state: {
                      visible: "{{['WRITE_PROPERTY'].includes($deps[0])}}",
                    },
                  },
                },
                'x-visible': false,
              },
            },
          },
          functionId: {
            title: intl.formatMessage({
              id: 'pages.device.command.function',
              defaultMessage: '功能',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [],
            'x-reactions': {
              dependencies: ['.messageType'],
              fulfill: {
                state: {
                  visible: "{{['INVOKE_FUNCTION'].includes($deps[0])}}",
                },
              },
            },
            'x-visible': false,
          },
          inputs: {
            title: intl.formatMessage({
              id: 'pages.device.command.parameter',
              defaultMessage: '参数',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'ArrayTable',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                column1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: intl.formatMessage({
                      id: 'pages.device.command.key',
                      defaultMessage: '键',
                    }),
                  },
                  properties: {
                    key: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-read-only': true,
                    },
                  },
                },
                column2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: intl.formatMessage({
                      id: 'pages.device.command.value',
                      defaultMessage: '值',
                    }),
                  },
                  properties: {
                    value: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                  },
                },
              },
            },
            'x-reactions': {
              dependencies: ['.messageType'],
              fulfill: {
                state: {
                  visible: "{{['INVOKE_FUNCTION'].includes($deps[0])}}",
                },
              },
            },
            'x-visible': false,
          },
        },
      },
    },
  };

  const sendCommand = async () => {
    const values: Record<string, any> = await form.submit();
    const type = values.message?.messageType;
    switch (type) {
      case 'READ_PROPERTY':
        const property = values.message.properties.key;
        values.message.properties = property;
        break;
      case 'WRITE_PROPERTY':
        const key = values.message.properties.key;
        const value = values.message.properties.value;
        values.message.properties = { [key]: value };
        break;
      default:
        break;
    }
    const resp = await service.task(values);
    if (resp.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功！',
        }),
      );
    } else {
      message.error(
        intl.formatMessage({
          id: 'pages.data.option.error',
          defaultMessage: '操作失败',
        }),
      );
    }
    close();
  };
  return (
    <Modal
      onOk={sendCommand}
      onCancel={() => close()}
      width="50vw"
      visible={visible}
      title={intl.formatMessage({
        id: 'pages.device.command',
        defaultMessage: '下发指令',
      })}
    >
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} scope={{ useAsyncDataSource, loadData }} />
      </Form>
    </Modal>
  );
};
export default Create;

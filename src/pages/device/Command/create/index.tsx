import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, Input, FormItem, Select, Space, ArrayTable } from '@formily/antd';
import { action } from '@formily/reactive';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/device/Command';
import { Modal } from 'antd';
import FSelectDevices from '@/components/FSelectDevices';
import { useRef } from 'react';
import type { DeviceMetadata, ProductItem } from '@/pages/device/Product/typings';

const Create = () => {
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
        f.setFieldState(field.query('message.properties'), (state) => {
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

  const useAsyncDataSource =
    (services: (arg0: Field<any, any, any, any>) => Promise<any>) => (field: Field) => {
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
        title: '产品',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
      },
      deviceId: {
        title: '设备',
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
            title: '指令',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              { label: '读取属性', value: 'READ_PROPERTY' },
              { label: '设置属性', value: 'WRITE_PROPERTY' },
              { label: '调用功能', value: 'INVOKE_FUNCTION' },
            ],
          },
          properties: {
            title: '属性',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [],
            'x-reactions': {
              dependencies: ['.messageType'],
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
            title: '设置值',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-reactions': {
              dependencies: ['.messageType'],
              fulfill: {
                state: {
                  visible: "{{['WRITE_PROPERTY'].includes($deps[0])}}",
                },
              },
            },
            'x-visible': false,
          },
          functionId: {
            title: '功能',
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
            title: '参数',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayTable',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                column1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: '键' },
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
                  'x-component-props': { title: '值' },
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

  return (
    <Modal width="50vw" visible={true} title="下发指令">
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} scope={{ useAsyncDataSource, loadData }} />
      </Form>
    </Modal>
  );
};
export default Create;

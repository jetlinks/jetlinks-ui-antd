import {
  FormItem,
  Editable,
  Input,
  Select,
  Radio,
  DatePicker,
  ArrayItems,
  FormButtonGroup,
  Submit,
  Space,
  FormLayout,
  FormGrid,
  NumberPicker,
} from '@formily/antd';
import { createForm, onFieldReact, FieldDataSource, onFieldValueChange } from '@formily/core';
import type { Field } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { action } from '@formily/reactive';
import {
  queryMessageConfig,
  queryMessageTemplate,
  queryMessageType,
  queryProductList,
} from '@/pages/rule-engine/Scene/Save/action/service';
import { Card } from 'antd';
import { useMemo } from 'react';
import type { ISchema } from '@formily/json-schema';

export default () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Editable,
      DatePicker,
      Space,
      Radio,
      Input,
      Select,
      ArrayItems,
      FormLayout,
      FormGrid,
      NumberPicker,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          actions: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: '执行动作',
            items: {
              type: 'object',
              title: '执行动作',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    executor: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-component-props': {
                        style: {
                          width: 160,
                        },
                      },
                      enum: [
                        { label: '消息通知', value: 'message' },
                        { label: '设备输出', value: 'device' },
                        { label: '延迟执行', value: 'delay' },
                      ],
                    },
                    notify: {
                      type: 'object',
                      'x-decorator': 'FormItem',
                      'x-reactions': [
                        {
                          dependencies: ['.executor'],
                          fulfill: {
                            state: {
                              visible: "{{$deps[0] === 'message'}}",
                            },
                          },
                        },
                      ],
                      properties: {
                        grid: {
                          type: 'void',
                          'x-component': 'FormGrid',
                          'x-component-props': {
                            minColumns: [4, 6, 10],
                          },
                          properties: {
                            messageType: {
                              type: 'string',
                              'x-decorator': 'FormItem',
                              'x-component': 'Select',
                              'x-component-props': {
                                style: { width: 160 },
                                fieldNames: { label: 'name', value: 'id' },
                              },
                              'x-reactions': ['{{useAsyncDataSource(getMessageType)}}'],
                            },
                            notifierId: {
                              type: 'string',
                              'x-decorator': 'FormItem',
                              'x-component': 'Select',
                              'x-component-props': {
                                style: { width: 160 },
                                fieldNames: { label: 'name', value: 'id' },
                              },
                            },
                            templateId: {
                              type: 'string',
                              'x-decorator': 'FormItem',
                              'x-component': 'Select',
                              'x-component-props': {
                                style: { width: 160 },
                              },
                            },
                          },
                        },
                      },
                    },
                    variables: {
                      type: 'object',
                      'x-decorator': 'FormItem',
                      properties: {},
                      'x-reactions': [
                        {
                          dependencies: ['.executor'],
                          fulfill: {
                            state: {
                              visible: "{{$deps[0] === 'message'}}",
                            },
                          },
                        },
                      ],
                    },
                    device: {
                      type: 'object',
                      'x-decorator': 'FormItem',
                      'x-component': 'Space',
                      'x-reactions': [
                        {
                          dependencies: ['.executor'],
                          fulfill: {
                            state: {
                              visible: "{{$deps[0] === 'device'}}",
                            },
                          },
                        },
                      ],
                      properties: {
                        productId: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: { width: 200 },
                            fieldNames: { label: 'name', value: 'id' },
                          },
                          'x-reactions': ['{{useAsyncDataSource(getProductList)}}'],
                        },
                        selector: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: { width: 200 },
                          },
                          enum: [
                            { label: '固定设备', value: 'device' },
                            { label: '按标签', value: 'tag' },
                            { label: '按关系', value: 'relation' },
                          ],
                        },
                        'message.messageType': {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: { width: 160 },
                          },
                          enum: [
                            { label: '功能调用', value: 'INVOKE_FUNCTION' },
                            { label: '读取属性', value: 'READ_PROPERTY' },
                            { label: '设置属性', value: 'WRITE_PROPERTY' },
                          ],
                        },
                        value: {
                          type: 'object',
                          'x-decorator': 'FormItem',
                        },
                      },
                    },
                    delay: {
                      type: 'object',
                      'x-decorator': 'FormItem',
                      'x-reactions': [
                        {
                          dependencies: ['.executor'],
                          fulfill: {
                            state: {
                              visible: "{{$deps[0] === 'delay'}}",
                            },
                          },
                        },
                      ],
                      properties: {
                        time: {
                          type: 'number',
                          'x-decorator': 'FormItem',
                          'x-component': 'NumberPicker',
                          'x-component-props': {
                            style: {
                              width: 240,
                            },
                          },
                        },
                        unit: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: {
                              width: 160,
                            },
                          },
                          enum: [
                            { label: '秒', value: 'seconds' },
                            { label: '分', value: 'minutes' },
                            { label: '小时', value: 'hours' },
                          ],
                        },
                      },
                    },
                  },
                },
                remove: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.Remove',
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: '添加条目',
                'x-component': 'ArrayItems.Addition',
              },
            },
          },
        },
      },
    },
  };

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('actions.*.notify.notifierId', async (field, f) => {
            const key = field.query('.messageType').get('value');
            f.clearFormGraph('.variables');
            (field as Field).value = undefined;
            if (key) {
              (field as Field).loading = true;
              const resp = await queryMessageConfig({ terms: [{ column: 'type$IN', value: key }] });
              (field as Field).loading = false;
              if (resp.status === 200) {
                (field as Field).dataSource = resp.result;
              }
            }
          });
          onFieldReact('actions.*.notify.templateId', async (field) => {
            const key = field.query('.notifierId').get('value');
            (field as Field).value = undefined;
            if (key) {
              (field as Field).loading = true;
              const resp = await queryMessageTemplate({
                terms: [{ column: 'configId', value: key }],
              });
              (field as Field).loading = false;
              if (resp.status === 200) {
                (field as Field).dataSource = resp.result.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                  data: item,
                }));
              }
            }
          });
          onFieldValueChange('actions.*.notify.templateId', async (field) => {
            console.log(field);

            const templateData = field.dataSource.find((item) => item.value === field.value);
            if (templateData) {
              const data = templateData.data;
              if (data.variableDefinitions) {
                const obj = {};
                data.variableDefinitions.forEach((item: any) => {
                  obj[item.id] = {
                    title: item.name,
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                  };
                });
              }
            }
          });
        },
      }),
    [],
  );

  const getMessageType = async () => await queryMessageType();

  const getProductList = async () =>
    await queryProductList({ sorts: [{ name: 'createTime', order: 'desc' }] });

  const useAsyncDataSource =
    (services: (arg0: Field) => Promise<FieldDataSource>) => (field: Field) => {
      field.loading = true;
      services(field).then(
        action.bound!((resp: any) => {
          field.dataSource = resp.result;
          field.loading = false;
        }),
      );
    };

  return (
    <Card>
      <FormProvider form={form}>
        <SchemaField
          schema={schema}
          scope={{ useAsyncDataSource, getMessageType, getProductList }}
        />
        <FormButtonGroup>
          <Submit onSubmit={console.log}>提交</Submit>
        </FormButtonGroup>
      </FormProvider>
    </Card>
  );
};

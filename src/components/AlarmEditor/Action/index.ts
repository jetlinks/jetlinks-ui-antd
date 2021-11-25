import type { Field } from '@formily/core';
import { FormPath, onFieldReact } from '@formily/core';
import { service } from '@/pages/device/Product';
import encodeQuery from '@/utils/encodeQuery';
import type { Response } from '@/utils/typings';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import type { DeviceMetadata, FunctionMetadata } from '@/pages/device/Product/typings';

const Action = {
  schema: {
    actions: {
      type: 'array',
      'x-component': 'ArrayCollapse',
      'x-decorator': 'FormItem',
      'x-component-props': {
        ghost: true,
      },
      items: {
        type: 'object',
        'x-component': 'ArrayCollapse.CollapsePanel',
        'x-component-props': {
          header: '执行动作',
        },
        properties: {
          index: {
            type: 'void',
            'x-component': 'ArrayCollapse.Index',
          },
          executor: {
            type: 'string',
            'x-decorator': 'FormItem',
            title: '动作类型',
            required: true,
            'x-component': 'Select',
            enum: [
              { label: '消息通知', value: 'notifier' },
              { label: '设备输出', value: 'device-message-sender' },
            ],
          },
          configuration: {
            type: 'object',
            properties: {
              deviceMessage: {
                type: 'void',
                properties: {
                  '{id:deviceId,productId,name:deviceName}': {
                    type: 'object',
                    'x-decorator': 'FormItem',
                    title: '选择设备',
                    required: true,
                    'x-component': 'FSelectDevice',
                  },
                  message: {
                    type: 'object',
                    properties: {
                      messageType: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        title: '执行动作',
                        required: true,
                        'x-component': 'Select',
                        enum: [
                          { label: '设置属性', value: 'WRITE_PROPERTY' },
                          { label: '调用功能', value: 'INVOKE_FUNCTION' },
                        ],
                      },
                      properties: {
                        type: 'object',
                        'x-visible': false,
                        properties: {
                          key: {
                            title: '属性列表',
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Select',
                            required: true,
                          },
                          value: {
                            title: '属性值',
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            required: true,
                          },
                        },
                        'x-reactions': {
                          dependencies: ['.messageType'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0]==="WRITE_PROPERTY"}}',
                            },
                          },
                        },
                      },
                      functionId: {
                        title: '功能列表',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-visible': false,
                        required: true,
                        'x-reactions': {
                          dependencies: ['.messageType'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0]==="INVOKE_FUNCTION"}}',
                            },
                          },
                        },
                      },

                      inputs: {
                        type: 'array',
                        'x-component': 'ArrayItems',
                        'x-decorator': 'FormItem',
                        'x-visible': false,
                        'x-reactions': {
                          dependencies: ['.messageType'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0]==="INVOKE_FUNCTION"}}',
                            },
                          },
                        },
                        items: {
                          type: 'object',
                          properties: {
                            space: {
                              type: 'void',
                              'x-component': 'Space',
                              'x-component-props': {
                                align: 'center',
                              },
                              properties: {
                                name: {
                                  title: '参数名',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                  'x-disabled': true,
                                  type: 'string',
                                },
                                value: {
                                  title: '参数值',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                  type: 'string',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['..executor'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="device-message-sender"}}',
                    },
                  },
                },
              },
              notifier: {
                type: 'void',
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['..executor'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="notifier"}}',
                    },
                  },
                },
                properties: {
                  notifyType: {
                    title: '通知类型',
                    type: 'string',
                    'x-decorator': 'FormItem',
                    required: true,
                    'x-component': 'Select',
                    'x-reactions': ['{{useAsyncDataSource(loadNotifierType)}}'],
                  },
                  notifierId: {
                    title: '通知配置',
                    type: 'string',
                    'x-decorator': 'FormItem',
                    required: true,
                    'x-component': 'Select',
                  },
                  templateId: {
                    title: '通知模版',
                    type: 'string',
                    'x-decorator': 'FormItem',
                    required: true,
                    'x-component': 'Select',
                    enum: [],
                  },
                },
              },
            },
          },
          remove: {
            type: 'void',
            'x-component': 'ArrayCollapse.Remove',
          },
          moveUp: {
            type: 'void',
            'x-component': 'ArrayCollapse.MoveUp',
          },
          moveDown: {
            type: 'void',
            'x-component': 'ArrayCollapse.MoveDown',
          },
        },
      },
      properties: {
        addition: {
          type: 'void',
          title: '添加动作',
          'x-component': 'ArrayCollapse.Addition',
        },
      },
    },
  } as any,
  effects: () => {
    let targetDeviceFunction: Partial<FunctionMetadata>[] = [];
    onFieldReact('actions.*.configuration.notifyType', async (field, f) => {
      const type = (field as Field).value;
      if (!type) return;
      const data = await service.notifier.config(
        encodeQuery({
          paging: false,
          terms: { type },
        }),
      );
      const configPath = FormPath.transform(
        field.path,
        /\d+/,
        (index) => `actions.${parseInt(index)}.configuration.notifierId`,
      );
      f.setFieldState(configPath, (state) => {
        state.dataSource = data.result?.map((i: { name: string; provider: string }) => ({
          label: i.name,
          value: i.provider,
        }));
      });
    });
    onFieldReact('actions.*.configuration.notifierId', async (field, f) => {
      const provider = (field as Field).value;
      const templatePath = FormPath.transform(
        field.path,
        /\d+/,
        (index) => `actions.${parseInt(index)}.configuration.templateId`,
      );
      const type = field.query('.notifyType').get('value');
      if (!provider) return;
      const data = await service.notifier.template(
        encodeQuery({
          paging: false,
          terms: { type, provider },
        }),
      );
      f.setFieldState(templatePath, (state) => {
        state.dataSource = data.result?.map((i: { name: any; id: any }) => ({
          label: i.name,
          value: i.id,
        }));
      });
    });
    onFieldReact(
      'actions.*.configuration.{id:deviceId,productId,name:deviceName}',
      async (field, f) => {
        const device = (field as Field).value;
        console.log(device);
        if (!device || Object.keys(device).length === 0) return;
        const detail: Response<DeviceInstance> = await service.deviceDetail(device.id);

        const metadata = JSON.parse((detail.result as DeviceInstance).metadata) as DeviceMetadata;
        const propertyPath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `actions.${index}.configuration.message.properties.key`,
        );
        const functionPath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `actions.${index}.configuration.message.functionId`,
        );
        console.log(propertyPath, 'path', metadata);
        f.setFieldState(propertyPath, (state) => {
          state.dataSource = metadata.properties.map((i) => ({ label: i.name, value: i.id }));
        });
        f.setFieldState(functionPath, (state) => {
          targetDeviceFunction = metadata.functions;
          state.dataSource = metadata.functions.map((i) => ({ label: i.name, value: i.id }));
        });
      },
    );
    onFieldReact('actions.*.configuration.message.functionId', async (field, f) => {
      const func = (field as Field).value;
      const functionMetadata = targetDeviceFunction.find((i) => i.id === func);

      if (!functionMetadata) return;
      // console.log(func, functionMetadata, '配置信息', targetDeviceFunction)
      const inputsPath = FormPath.transform(
        field.path,
        /\d+/,
        (index) => `actions.${index}.configuration.message.inputs`,
      );
      const t = functionMetadata?.inputs?.map((i: any) => ({ ...i, key: i.id, label: i.name }));
      f.setFieldState(inputsPath, (state) => {
        state.visible = true;
        state.value = t;
      });
      const valuePath = FormPath.transform(
        field.path,
        /\d+/,
        (index) => `actions.${index}.configuration.message.inputs.*.value`,
      );

      t?.map((v: any, index: number) => {
        const value = valuePath.replace('*', index);
        f.setFieldState(value, (state) => {
          state.decoratorProps = {
            tooltip: `参数类型:${v.valueType.type}`,
          };
        });
      });
    });
  },
};
export default Action;

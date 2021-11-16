import { Drawer } from 'antd';
import type { Field } from '@formily/core';
import { createForm, FormPath, onFieldReact } from '@formily/core';
import {
  ArrayCollapse,
  ArrayItems,
  Editable,
  Form,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  Radio,
  Select,
  Space,
} from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { useIntl } from '@@/plugin-locale/localeExports';

import './index.less';
import DB from '@/db';
import FAutoComplete from '@/components/FAutoComplete';
import { action } from '@formily/reactive';
import { service } from '@/pages/device/Product';
import encodeQuery from '@/utils/encodeQuery';
import FSelectDevice from '@/components/FSelectDevice';

interface Props {
  visible: boolean;
  close: () => void;
}

const EditAlarm = (props: Props) => {
  const { visible, close } = props;

  const intl = useIntl();
  const form = createForm({
    initialValues: {},
    effects() {
      onFieldReact('triggers.*.item' || 'triggers.*.type', async (field, f) => {
        const triggerPath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `triggers.${parseInt(index)}.trigger`,
        );
        const typePath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `triggers.${parseInt(index)}.type`,
        );
        const keyPath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `triggers.${parseInt(index)}.filter.*.key`,
        );
        const functionConfigPath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `triggers.${parseInt(index)}.functionConfig`,
        );
        const trigger = (field.query(triggerPath).take() as Field)?.value as 'device' | 'timer';
        const functionValuePath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `triggers.${parseInt(index)}.functionConfig.*.value`,
        );
        const type = (field.query(typePath).take() as Field)?.value;
        const item = (field as Field)?.value;
        if (!type || type === 'online' || type === 'offline') return;
        const data = await DB.getDB().table(type).toArray();
        const temp = data.map((d) => ({ label: `${d.name}(${d.id})`, value: d.id }));

        f.setFieldState(field.query('.item'), (state) => {
          state.dataSource = temp;
        });
        if (trigger === 'timer' && type && item) {
          const list = await DB.getDB().table(type).where('id').equals(item).last();
          if (type === 'functions') {
            const t = list.inputs.map((i: any) => ({ ...i, key: i.id, label: i.name }));
            f.setFieldState(functionConfigPath, (state) => {
              state.visible = true;
              state.value = t;
            });
            t.map((v: any, index: number) => {
              const value = functionValuePath.replace('*', index);
              f.setFieldState(value, (state) => {
                state.decoratorProps = {
                  tooltip: `参数类型:${v.valueType.type}`,
                };
              });
            });
          }
          f.setFieldState(keyPath, (state) => {
            if (list.inputs.length > 0) {
              const output = list.output;
              switch (output.type) {
                case 'object':
                  const propertyList = output.properties;
                  state.dataSource = (
                    propertyList.length > 0
                      ? propertyList.map((i: { id: any; name: any }) => ({
                          value: i.id,
                          label: `${i.name}(${i.id})`,
                        }))
                      : []
                  ).concat({
                    label: 'this',
                    value: 'this',
                  });
                  break;
                case 'enum':
                  const elements = output.elements;
                  state.dataSource = (
                    elements.length > 0
                      ? elements.map((i: { text: any; value: any }) => ({
                          value: i.value,
                          label: `${i.text}(${i.value})`,
                        }))
                      : []
                  ).concat({
                    label: 'this',
                    value: 'this',
                  });
                  break;
                default:
                  state.dataSource = [
                    {
                      label: 'this',
                      value: 'this',
                    },
                  ];
                  break;
              }
            }
          });
        } else if (trigger === 'device') {
          f.setFieldState(keyPath, (state) => {
            state.dataSource = temp;
          });
        }
      });
      onFieldReact('actions.*.notifier.type', async (field, f) => {
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
          (index) => `actions.${parseInt(index)}.notifier.config`,
        );
        f.setFieldState(configPath, (state) => {
          state.dataSource = data.result?.map((i: { name: string; provider: string }) => ({
            label: i.name,
            value: i.provider,
          }));
        });
      });
      onFieldReact('actions.*.notifier.config', async (field, f) => {
        const provider = (field as Field).value;
        const templatePath = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `actions.${parseInt(index)}.notifier.template`,
        );
        const type = field.query('.type').get('value');
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
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Radio,
      Editable,
      ArrayItems,
      ArrayCollapse,
      Space,
      FormLayout,
      FormTab,
      FAutoComplete,
      FSelectDevice,
    },
  });

  const formTab = FormTab.createFormTab!();

  const loadNotifierType = async (field: Field) => {
    const ac = field.query('..action').get('value');
    if (!ac) return [];
    return service.notifier.types();
  };

  const useAsyncDataSource = (ser: (arg0: any) => Promise<any>) => (field: Field) => {
    field.loading = true;
    ser(field).then(
      action.bound?.((data) => {
        field.dataSource = (data.result || []).map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      collapse: {
        type: 'void',
        'x-component': 'FormTab',
        'x-component-props': {
          formTab: '{{formTab}}',
          tabPosition: 'right',
        },
        properties: {
          tab1: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '触发条件',
            },
            properties: {
              triggers: {
                type: 'array',
                // title: '触发条件',
                'x-component': 'ArrayCollapse',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  ghost: true,
                },
                items: {
                  type: 'object',
                  'x-component': 'ArrayCollapse.CollapsePanel',
                  'x-component-props': {
                    header: '告警规则',
                    layout: 'vertical',
                  },
                  properties: {
                    index: {
                      type: 'void',
                      'x-component': 'ArrayCollapse.Index',
                    },
                    layout: {
                      type: 'void',
                      'x-component': 'FormLayout',
                      'x-component-props': {
                        layout: 'vertical',
                      },
                      properties: {
                        trigger: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          title: '触发方式',
                          required: true,
                          'x-component': 'Select',
                          enum: [
                            { label: '定时触发', value: 'timer' },
                            { label: '设备触发', value: 'device' },
                          ],
                        },
                        cron: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          title: 'Cron表达式',
                          required: true,
                          'x-visible': false,
                          'x-component': 'Input',
                          'x-reactions': {
                            dependencies: ['.trigger'],
                            fulfill: {
                              state: {
                                visible: "{{$deps[0]==='timer'}}",
                              },
                            },
                          },
                        },
                        type: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          title: '类型',
                          required: true,
                          'x-component': 'Select',
                          'x-reactions': {
                            dependencies: ['.trigger'],
                            when: "{{$deps[0]!=='timer'}}",
                            fulfill: {
                              state: {
                                dataSource: [
                                  { label: '上线', value: 'online' },
                                  { label: '离线', value: 'offline' },
                                  { label: '属性', value: 'properties' },
                                  { label: '事件', value: 'events' },
                                ],
                              },
                            },
                            otherwise: {
                              state: {
                                dataSource: [
                                  { label: '属性', value: 'properties' },
                                  { label: '功能', value: 'functions' },
                                ],
                              },
                            },
                          },
                        },
                        item: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          title: '事件/属性',
                          required: true,
                          'x-component': 'Select',
                          'x-visible': false,
                          'x-reactions': {
                            dependencies: ['.trigger', '.type'],
                            when: "{{$deps[0]==='timer'&&($deps[1]==='properties'||$deps[1]==='events'||$deps[1]==='functions')}}",
                            fulfill: {
                              state: {
                                visible: true,
                              },
                            },
                            otherwise: {
                              state: {
                                visible: false,
                              },
                            },
                          },
                        },
                        functionConfig: {
                          type: 'array',
                          'x-component': 'ArrayItems',
                          'x-decorator': 'FormItem',
                          'x-visible': false,
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
                                  key: {
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
                        filter: {
                          title: '过滤条件',
                          type: 'array',
                          'x-component': 'ArrayItems',
                          'x-decorator': 'FormItem',
                          items: {
                            type: 'object',
                            properties: {
                              space: {
                                type: 'void',
                                'x-component': 'Space',
                                properties: {
                                  key: {
                                    type: 'string',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'FAutoComplete',
                                    'x-component-props': {
                                      placeholder: 'key',
                                      style: {
                                        width: '200px',
                                      },
                                    },
                                  },
                                  operator: {
                                    type: 'string',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Select',
                                    'x-component-props': {
                                      placeholder: '条件',
                                      style: {
                                        width: '110px',
                                      },
                                    },
                                    enum: [
                                      { label: '等于(=)', value: 'eq' },
                                      { label: '不等于(!=)', value: 'not' },
                                      { label: '大于(>)', value: 'gt' },
                                      { label: '小于(<)', value: 'lt' },
                                      { label: '大于等于(>=)', value: 'gte' },
                                      { label: '小于等于(<=)', value: 'lte' },
                                      { label: '模糊(%)', value: 'like' },
                                    ],
                                  },
                                  value: {
                                    type: 'string',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Input',
                                    'x-component-props': {
                                      placeholder: 'value',
                                    },
                                  },
                                  remove: {
                                    type: 'void',
                                    'x-decorator': 'FormItem',
                                    'x-component': 'ArrayItems.Remove',
                                  },
                                },
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
                    title: '添加规则',
                    'x-component': 'ArrayCollapse.Addition',
                  },
                },
              },
            },
          },
          tab2: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '转换配置',
            },
            properties: {
              convert: {
                // title: '转换',
                type: 'array',
                'x-component': 'ArrayItems',
                'x-decorator': 'FormItem',
                items: {
                  type: 'object',
                  properties: {
                    space: {
                      type: 'void',
                      'x-component': 'Space',
                      properties: {
                        sort: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.SortHandle',
                        },
                        property: {
                          type: 'string',
                          // title: '属性',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: '属性',
                          },
                        },
                        alias: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: '别名',
                          },
                        },
                        remove: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.Remove',
                        },
                        moveUp: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.MoveUp',
                        },
                        moveDown: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.MoveDown',
                        },
                      },
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
          tab3: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '执行动作',
            },
            properties: {
              actions: {
                // title: '执行动作',
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
                    action: {
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
                    notifier: {
                      type: 'object',
                      'x-visible': false,
                      properties: {
                        type: {
                          title: '通知类型',
                          type: 'string',
                          'x-decorator': 'FormItem',
                          required: true,
                          'x-component': 'Select',
                          'x-reactions': ['{{useAsyncDataSource(loadNotifierType)}}'],
                        },
                        config: {
                          title: '通知配置',
                          type: 'string',
                          'x-decorator': 'FormItem',
                          required: true,
                          'x-component': 'Select',
                        },
                        template: {
                          title: '通知模版',
                          type: 'string',
                          'x-decorator': 'FormItem',
                          required: true,
                          'x-component': 'Select',
                          enum: [],
                        },
                      },
                      'x-reactions': {
                        dependencies: ['..action'],
                        fulfill: {
                          state: {
                            visible: "{{$deps[0]==='notifier'}}",
                          },
                        },
                      },
                    },

                    device: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      title: '选择设备',
                      required: true,
                      'x-component': 'FSelectDevice',
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
            },
          },
        },
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-index': 1,
      },
    },
  };

  return (
    <Drawer title="编辑告警" visible={visible} onClose={() => close()} width="40vw">
      <Form form={form} layout="vertical" size="small">
        <SchemaField schema={schema} scope={{ formTab, useAsyncDataSource, loadNotifierType }} />
      </Form>
    </Drawer>
  );
};
export default EditAlarm;

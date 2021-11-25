import type { Field } from '@formily/core';
import { FormPath, onFieldReact } from '@formily/core';
import DB from '@/db';

const Trigger = {
  schema: {
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
                      value: undefined,
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
              modelId: {
                // key 改为modelID
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
              parameters: {
                // key改为parameters
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
  } as any,
  effects: () =>
    onFieldReact('triggers.*.modelId' || 'triggers.*.type', async (field, f) => {
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
        (index) => `triggers.${parseInt(index)}.parameters`,
      );
      const trigger = (field.query(triggerPath).take() as Field)?.value as 'device' | 'timer';
      const functionValuePath = FormPath.transform(
        field.path,
        /\d+/,
        (index) => `triggers.${parseInt(index)}.parameters.*.value`,
      );
      const type = (field.query(typePath).take() as Field)?.value;
      const item = (field as Field)?.value;
      if (!type || type === 'online' || type === 'offline') return;
      const data = await DB.getDB().table(type).toArray();
      const temp = data.map((d) => ({ label: `${d.name}(${d.id})`, value: d.id }));

      f.setFieldState(field.query('.modelId'), (state) => {
        state.dataSource = temp;
      });
      if (trigger === 'timer' && type && item) {
        const list = await DB.getDB().table(type).where('id').equals(item).last();
        if (type === 'functions') {
          const t = list.inputs?.map((i: any) => ({ ...i, key: i.id, label: i.name }));
          f.setFieldState(functionConfigPath, (state) => {
            state.visible = true;
            state.value = t;
          });

          t?.map((v: any, index: number) => {
            const value = functionValuePath.replace('*', index);
            f.setFieldState(value, (state) => {
              state.decoratorProps = {
                tooltip: `参数类型:${v.valueType.type}`,
              };
            });
          });
        }
        f.setFieldState(keyPath, (state) => {
          // if (list.output?.length > 0) {
          const output = list.output;
          switch (output?.type) {
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
          // }
        });
      } else if (trigger === 'device') {
        f.setFieldState(keyPath, (state) => {
          state.dataSource = temp;
        });
      }
    }),
};

export default Trigger;

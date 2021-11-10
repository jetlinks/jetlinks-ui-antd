import { Drawer } from 'antd';
import { createForm } from '@formily/core';
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

interface Props {
  visible: boolean;
  close: () => void;
}

const EditAlarm = (props: Props) => {
  const { visible, close } = props;

  const intl = useIntl();
  const form = createForm({
    initialValues: {},
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
    },
  });

  const formTab = FormTab.createFormTab!();
  const schema2: ISchema = {
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
                          title: '触发器类型',
                          required: true,
                          'x-component': 'Select',
                          enum: [
                            { label: '定时触发', value: 'timer' },
                            { label: '设备触发', value: 'device' },
                          ],
                        },
                        type: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          title: '类型',
                          required: true,
                          'x-component': 'Select',
                          enum: [
                            { label: '上线', value: 'online' },
                            { label: '离线', value: 'offline' },
                            { label: '属性', value: 'properties' },
                            { label: '事件', value: 'event' },
                          ],
                        },
                        item: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          title: '事件/属性',
                          required: true,
                          'x-component': 'Select',
                          enum: [],
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
                                    'x-component': 'Input',
                                    'x-component-props': {
                                      placeholder: 'key',
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
                    title: '添加条件',
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
                    input: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      title: 'Input',
                      required: true,
                      'x-component': 'Input',
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

  // 存在争议的方案、平铺直列不采用Tab区分层次
  // const schema: ISchema = {
  //   type: 'object',
  //   properties: {
  //     name: {
  //       title: intl.formatMessage({
  //         id: 'pages.table.name',
  //         defaultMessage: '名称',
  //       }),
  //       required: true,
  //       'x-decorator': 'FormItem',
  //       'x-component': 'Input',
  //       'x-index': 1,
  //     },
  //     triggers: {
  //       type: 'array',
  //       title: '触发条件',
  //       "x-component": 'ArrayCollapse',
  //       "x-decorator": 'FormItem',
  //       items: {
  //         type: 'object',
  //         'x-component': 'ArrayCollapse.CollapsePanel',
  //         'x-component-props': {
  //           header: '告警规则',
  //           layout: 'vertical'
  //         },
  //         properties: {
  //           index: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.Index',
  //           },
  //           layout: {
  //             type: 'void',
  //             'x-component': 'FormLayout',
  //             "x-component-props": {
  //               layout: 'vertical'
  //             },
  //             properties: {
  //               trigger: {
  //                 type: 'string',
  //                 'x-decorator': 'FormItem',
  //                 title: '触发器类型',
  //                 required: true,
  //                 'x-component': 'Select',
  //                 enum: [
  //                   {label: '定时触发', value: 'timer'},
  //                   {label: '设备触发', value: 'device'}
  //                 ]
  //               },
  //               type: {
  //                 type: 'string',
  //                 'x-decorator': 'FormItem',
  //                 title: '类型',
  //                 required: true,
  //                 'x-component': 'Select',
  //                 enum: [
  //                   {label: '上线', value: 'online'},
  //                   {label: '离线', value: 'offline'},
  //                   {label: '属性', value: 'properties'},
  //                   {label: '事件', value: 'event'},
  //                 ]
  //               },
  //               item: {
  //                 type: 'string',
  //                 'x-decorator': 'FormItem',
  //                 title: '事件/属性',
  //                 required: true,
  //                 'x-component': 'Select',
  //                 enum: []
  //               },
  //               filter: {
  //                 title: '过滤条件',
  //                 type: 'array',
  //                 'x-component': 'ArrayItems',
  //                 'x-decorator': 'FormItem',
  //                 items: {
  //                   type: 'object',
  //                   properties: {
  //                     space: {
  //                       type: 'void',
  //                       "x-component": 'Space',
  //                       properties: {
  //                         key: {
  //                           type: 'string',
  //                           'x-decorator': 'FormItem',
  //                           'x-component': 'Input',
  //                           "x-component-props": {
  //                             placeholder: 'key'
  //                           }
  //                         },
  //                         operator: {
  //                           type: 'string',
  //                           'x-decorator': 'FormItem',
  //                           'x-component': 'Select',
  //                           "x-component-props": {
  //                             placeholder: '条件',
  //                             style: {
  //                               width: '110px'
  //                             }
  //                           },
  //                           enum: [
  //                             {label: '等于(=)', value: 'eq'},
  //                             {label: '不等于(!=)', value: 'not'},
  //                             {label: '大于(>)', value: 'gt'},
  //                             {label: '小于(<)', value: 'lt'},
  //                             {label: '大于等于(>=)', value: 'gte'},
  //                             {label: '小于等于(<=)', value: 'lte'},
  //                             {label: '模糊(%)', value: 'like'},
  //                           ]
  //                         },
  //                         value: {
  //                           type: 'string',
  //                           'x-decorator': 'FormItem',
  //                           'x-component': 'Input',
  //                           "x-component-props": {
  //                             placeholder: 'value'
  //                           }
  //                         },
  //                         remove: {
  //                           type: 'void',
  //                           'x-decorator': 'FormItem',
  //                           'x-component': 'ArrayItems.Remove',
  //                         },
  //                       }
  //                     }
  //                   }
  //                 },
  //                 properties: {
  //                   add: {
  //                     type: 'void',
  //                     title: '添加条目',
  //                     'x-component': 'ArrayItems.Addition',
  //                   },
  //                 },
  //               },
  //             }
  //           },
  //           remove: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.Remove',
  //           },
  //           moveUp: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.MoveUp',
  //           },
  //           moveDown: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.MoveDown',
  //           },
  //         }
  //       },
  //       properties: {
  //         addition: {
  //           type: 'void',
  //           title: '添加条件',
  //           'x-component': 'ArrayCollapse.Addition',
  //         },
  //       },
  //     },
  //     convert: {
  //       title: '转换',
  //       type: 'array',
  //       'x-component': 'ArrayItems',
  //       'x-decorator': 'FormItem',
  //       items: {
  //         type: 'object',
  //         properties: {
  //           space: {
  //             type: 'void',
  //             "x-component": 'Space',
  //             properties: {
  //               sort: {
  //                 type: 'void',
  //                 'x-decorator': 'FormItem',
  //                 'x-component': 'ArrayItems.SortHandle',
  //               },
  //               property: {
  //                 type: 'string',
  //                 // title: '属性',
  //                 'x-decorator': 'FormItem',
  //                 'x-component': 'Input',
  //                 "x-component-props": {
  //                   placeholder: '属性'
  //                 }
  //               },
  //               alias: {
  //                 type: 'string',
  //                 'x-decorator': 'FormItem',
  //                 'x-component': 'Input',
  //                 "x-component-props": {
  //                   placeholder: '别名'
  //                 }
  //               },
  //               remove: {
  //                 type: 'void',
  //                 'x-decorator': 'FormItem',
  //                 'x-component': 'ArrayItems.Remove',
  //               },
  //             }
  //           }
  //         }
  //       },
  //       properties: {
  //         add: {
  //           type: 'void',
  //           title: '添加条目',
  //           'x-component': 'ArrayItems.Addition',
  //         },
  //       },
  //     },
  //     actions: {
  //       title: '执行动作',
  //       type: "array",
  //       "x-component": 'ArrayCollapse',
  //       "x-decorator": 'FormItem',
  //       'x-component-props': {
  //         defaultOpenPanelCount: 3,
  //       },
  //       items: {
  //         type: 'object',
  //         'x-component': 'ArrayCollapse.CollapsePanel',
  //         'x-component-props': {
  //           header: '执行动作',
  //         },
  //         properties: {
  //           index: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.Index',
  //           },
  //           input: {
  //             type: 'string',
  //             'x-decorator': 'FormItem',
  //             title: 'Input',
  //             required: true,
  //             'x-component': 'Input',
  //           },
  //           remove: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.Remove',
  //           },
  //           moveUp: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.MoveUp',
  //           },
  //           moveDown: {
  //             type: 'void',
  //             'x-component': 'ArrayCollapse.MoveDown',
  //           },
  //         }
  //       },
  //       properties: {
  //         addition: {
  //           type: 'void',
  //           title: '添加动作',
  //           'x-component': 'ArrayCollapse.Addition',
  //         },
  //       },
  //     }
  //   }
  // }

  return (
    <Drawer title="编辑告警" visible={visible} onClose={() => close()} width="40vw">
      <Form form={form} layout="vertical" size="small">
        <SchemaField schema={schema2} scope={{ formTab }} />
      </Form>
    </Drawer>
  );
};
export default EditAlarm;

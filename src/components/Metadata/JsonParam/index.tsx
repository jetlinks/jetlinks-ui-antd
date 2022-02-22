import {
  NumberPicker,
  FormLayout,
  Editable,
  ArrayItems,
  FormItem,
  Input,
  Select,
} from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { DataTypeList } from '@/pages/device/data';
import { Store } from 'jetlinks-store';
import { useIntl } from '@@/plugin-locale/localeExports';

// 不算是自定义组件。只是抽离了JSONSchema
interface Props {
  keys?: string;
}

const JsonParam = (props: Props) => {
  const intl = useIntl();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      JsonParam,
      ArrayItems,
      Editable,
      FormLayout,
      NumberPicker,
    },
  });
  const schema: ISchema = {
    type: 'object',
    properties: {
      [props?.keys || 'properties']: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        items: {
          type: 'object',
          'x-decorator': 'ArrayItems.Item',
          properties: {
            sort: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.SortHandle',
            },
            config: {
              type: 'void',
              title: intl.formatMessage({
                id: 'component.metadata.json.configParameter',
                defaultMessage: '配置参数',
              }),
              'x-decorator': 'Editable.Popover',
              'x-component': 'FormLayout',
              'x-component-props': {
                layout: 'vertical',
              },
              'x-decorator-props': {
                placement: 'left',
              },
              'x-reactions':
                '{{(field)=>field.title = field.query(".config.name").get("value") || field.title}}',
              properties: {
                id: {
                  title: intl.formatMessage({
                    id: 'component.metadata.json.id',
                    defaultMessage: '标识',
                  }),
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                name: {
                  title: intl.formatMessage({
                    id: 'component.metadata.json.name',
                    defaultMessage: '名称',
                  }),
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                valueType: {
                  type: 'object',
                  properties: {
                    type: {
                      title: intl.formatMessage({
                        id: 'component.metadata.json.dataType',
                        defaultMessage: '数据类型',
                      }),
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      enum: DataTypeList,
                    },
                    unit: {
                      title: intl.formatMessage({
                        id: 'component.metadata.unit',
                        defaultMessage: '单位',
                      }),
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-visible': false,
                      enum: Store.get('units'), // 理论上首层已经就缓存了单位数据，此处可直接获取
                      'x-reactions': {
                        dependencies: ['..valueType.type'],
                        fulfill: {
                          state: {
                            visible: "{{['int','float','long','double'].includes($deps[0])}}",
                          },
                        },
                      },
                    },
                    expands: {
                      type: 'object',
                      properties: {
                        maxLength: {
                          title: intl.formatMessage({
                            id: 'component.metadata.maxLength',
                            defaultMessage: '最大长度',
                          }),
                          'x-decorator': 'FormItem',
                          'x-component': 'NumberPicker',
                          'x-reactions': {
                            dependencies: ['..type'],
                            fulfill: {
                              state: {
                                visible: "{{['string'].includes($deps[0])}}",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                'valueType.scale': {
                  title: intl.formatMessage({
                    id: 'component.metadata.accuracy',
                    defaultMessage: '精度',
                  }),
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                  'x-visible': false,
                  'x-reactions': {
                    dependencies: ['..valueType.type'],
                    fulfill: {
                      state: {
                        visible: "{{['float','double'].includes($deps[0])}}",
                      },
                    },
                  },
                },

                json: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'component.metadata.json',
                    defaultMessage: 'JSON对象',
                  }),
                  'x-visible': false,
                  'x-decorator': 'FormItem',
                  'x-component': 'JsonParam',
                  'x-reactions': {
                    dependencies: ['.valueType.type'],
                    fulfill: {
                      state: {
                        visible: "{{['object'].includes($deps[0])}}",
                      },
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
            title: intl.formatMessage({
              id: 'component.metadata.json.add',
              defaultMessage: '添加参数',
            }),
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };
  return <SchemaField schema={schema} />;
};
export default JsonParam;

import { createSchemaField } from '@formily/react';
import { FormLayout, Editable, Select, FormItem, Input, NumberPicker } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import './index.less';
import { DataTypeList, DateTypeList, FileTypeList } from '@/pages/device/data';
import { Store } from 'jetlinks-store';
import JsonParam from '@/components/Metadata/JsonParam';
import EnumParam from '@/components/Metadata/EnumParam';
import BooleanEnum from '@/components/Metadata/BooleanParam';
import { useIntl } from '@@/plugin-locale/localeExports';

const ArrayParam = () => {
  const intl = useIntl();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Editable,
      FormLayout,
      NumberPicker,
      JsonParam,
      ArrayParam,
      EnumParam,
      BooleanEnum,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      config: {
        type: 'void',
        title: intl.formatMessage({
          id: 'component.metadata.array.element',
          defaultMessage: '配置元素',
        }),
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        'x-decorator': 'Editable.Popover',
        'x-decorator-props': {
          className: 'config-array',
          placement: 'left',
        },
        'x-reactions':
          "{{(field) => field.title = field.query('.void.date2').get('value') || field.title}}",
        properties: {
          type: {
            title: intl.formatMessage({
              id: 'component.metadata.array.elementType',
              defaultMessage: '元素类型',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: DataTypeList.filter((item) => item.value !== 'array'),
          },

          scale: {
            title: intl.formatMessage({
              id: 'component.metadata.accuracy',
              defaultMessage: '精度',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['float','double'].includes($deps[0])}}",
                },
              },
            },
          },
          unit: {
            title: intl.formatMessage({
              id: 'component.metadata.unit',
              defaultMessage: '单位',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-visible': false,
            enum: Store.get('units'),
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['int','float','long','double'].includes($deps[0])}}",
                },
              },
            },
          },
          format: {
            title: intl.formatMessage({
              id: 'component.metadata.array.dateFormat',
              defaultMessage: '时间格式',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: DateTypeList,
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['date'].includes($deps[0])}}",
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
                'x-decorator-props': {
                  tooltip: intl.formatMessage({
                    id: 'component.metadata.array.byte',
                    defaultMessage: '字节',
                  }),
                },
                'x-reactions': {
                  dependencies: ['..type'],
                  fulfill: {
                    state: {
                      visible: "{{['string','password'].includes($deps[0])}}",
                    },
                  },
                },
              },
            },
          },

          booleanConfig: {
            title: intl.formatMessage({
              id: 'component.metadata.array.boolean',
              defaultMessage: '布尔值',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'BooleanEnum',
            type: 'void',
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['boolean'].includes($deps[0])}}",
                },
              },
            },
          },
          enumConfig: {
            title: intl.formatMessage({
              id: 'component.metadata.array.enum',
              defaultMessage: '枚举项',
            }),
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'EnumParam',
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['enum'].includes($deps[0])}}",
                },
              },
            },
          },
          fileType: {
            title: intl.formatMessage({
              id: 'component.metadata.array.fileType',
              defaultMessage: '文件类型',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-visible': false,
            enum: FileTypeList,
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['file'].includes($deps[0])}}",
                },
              },
            },
          },
          jsonConfig: {
            title: intl.formatMessage({
              id: 'component.metadata.json',
              defaultMessage: 'JSON对象',
            }),
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'JsonParam',
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['object'].includes($deps[0])}}",
                },
              },
            },
          },

          description: {
            title: intl.formatMessage({
              id: 'component.metadata.array.describe',
              defaultMessage: '描述',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
          },
        },
      },
    },
  };
  return <SchemaField schema={schema} />;
};
export default ArrayParam;

import { createSchemaField } from '@formily/react';
import { Editable, FormItem, FormLayout, Input, NumberPicker, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import './index.less';
import { DataTypeList, DateTypeList, FileTypeList } from '@/pages/device/data';
import { Store } from 'jetlinks-store';
import JsonParam from '@/components/Metadata/JsonParam';
import EnumParam from '@/components/Metadata/EnumParam';
import BooleanEnum from '@/components/Metadata/BooleanParam';

const ArrayParam = () => {
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
        title: '配置元素',
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
            title: '元素类型',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: DataTypeList.filter((item) =>
              ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(item.value),
            ),
            'x-validator': [
              {
                required: true,
                message: '请选择元素类型',
              },
            ],
          },
          scale: {
            title: '精度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              min: 1,
            },
            default: 2,
            'x-validator': [
              {
                max: 2147483647,
                message: '请输入0-2147483647之间的正整数',
              },
              {
                min: 0,
                message: '请输入0-2147483647之间的正整数',
              },
            ],
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
            title: '单位',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-visible': false,
            'x-component-props': {
              showSearch: true,
              allowClear: true,
              showArrow: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
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
            title: '时间格式',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: DateTypeList,
            default: 'string',
            'x-validator': [
              {
                required: true,
                message: '请选择时间格式',
              },
            ],
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
                title: '最大长度',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  min: 1,
                },
                'x-decorator-props': {
                  tooltip: '字节',
                },
                'x-validator': [
                  {
                    max: 2147483647,
                    message: '请输入1-2147483647之间的正整数',
                  },
                  {
                    min: 1,
                    message: '请输入1-2147483647之间的正整数',
                  },
                ],
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
            title: '布尔值',
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
            title: '枚举项',
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
            title: '文件类型',
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
            title: 'JSON对象',
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
            title: '说明',
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

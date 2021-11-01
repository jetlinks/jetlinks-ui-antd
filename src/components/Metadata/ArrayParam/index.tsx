import { createSchemaField } from '@formily/react';
import { FormLayout, Editable, Select, FormItem, Input, NumberPicker } from '@formily/antd';
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
            enum: DataTypeList.filter((item) => item.value !== 'array'),
          },

          scale: {
            title: '精度',
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
          units: {
            title: '单位',
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
          maxLength: {
            title: '最大长度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-reactions': {
              dependencies: ['.type'],
              fulfill: {
                state: {
                  visible: "{{['string'].includes($deps[0])}}",
                },
              },
            },
          },
          booleanConfig: {
            title: '布尔值',
            'x-decorator': 'FormItem',
            'x-component': 'BooleanEnum',
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
          'valueType.elementType.fileType': {
            title: '文件类型',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-visible': false,
            enum: FileTypeList,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: "{{['file'].includes($deps[0])}}",
                },
              },
            },
          },
          jsonConfig: {
            title: 'JSON对象',
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
          'valueType.elementType.expands.maxLength': {
            title: '密码长度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-decorator-props': {
              tooltip: '字节',
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['....type'],
              fulfill: {
                state: {
                  visible: "{{['password'].includes($deps[0])}}",
                },
              },
            },
          },
          'valueType.elementType.format': {
            title: '时间格式',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: DateTypeList,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: "{{['date'].includes($deps[0])}}",
                },
              },
            },
          },
          description: {
            title: '描述',
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

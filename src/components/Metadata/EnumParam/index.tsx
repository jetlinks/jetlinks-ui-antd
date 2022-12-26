import { createSchemaField } from '@formily/react';
import { ArrayItems, FormItem, FormLayout, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import Editable from '../EditTable';

const EnumParam = () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      ArrayItems,
      Editable,
      FormLayout,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      elements: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        'x-validator': [
          {
            triggerType: 'onBlur',
            validator: (value: any[]) => {
              return new Promise((resolve) => {
                if (value.length === 0) resolve('请配置枚举项');
                const flag = value.every((item: any) => {
                  return item.value && item.text;
                });
                if (!!flag) {
                  resolve('');
                } else {
                  resolve('请配置枚举项');
                }
              });
            },
          },
        ],
        items: {
          type: 'void',
          'x-component': 'ArrayItems.Item',
          properties: {
            sort: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.SortHandle',
            },
            popover: {
              type: 'object',
              title: '枚举项配置',
              'x-decorator': 'Editable.Popover',
              'x-component': 'FormLayout',
              'x-component-props': {
                layout: 'vertical',
              },
              'x-reactions':
                '{{(field)=>field.title = field.value && (field.value.text) || field.title}}',
              properties: {
                value: {
                  type: 'string',
                  title: 'Value',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入标识',
                  },
                  'x-validator': [
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                    {
                      required: true,
                      message: '请输入Value',
                    },
                  ],
                },
                text: {
                  type: 'string',
                  title: 'Text',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '对该枚举项的描述',
                  },
                  'x-validator': [
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                    {
                      required: true,
                      message: '请输入Text',
                    },
                  ],
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
          addition: {
            type: 'void',
            title: '新增枚举项',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };
  return <SchemaField schema={schema} />;
};

export default EnumParam;

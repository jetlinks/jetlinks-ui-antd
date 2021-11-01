import { createSchemaField } from '@formily/react';
import { ArrayItems, Editable, FormItem, FormLayout, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';

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
                text: {
                  type: 'string',
                  title: 'Text',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '标识',
                  },
                },
                value: {
                  type: 'string',
                  title: 'Value',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '对该枚举项的描述',
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

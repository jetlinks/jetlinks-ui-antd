import { createSchemaField } from '@formily/react';
import { FormGrid, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';

const BooleanParam = () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      config: {
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 2,
        },
        type: 'void',
        properties: {
          trueText: {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: '是',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: 'trueText',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入trueText',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          trueValue: {
            title: '-',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: true,
            'x-decorator-props': {
              gridSpan: 1,
              colon: false,
            },
            'x-component-props': {
              placeholder: 'trueValue',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入trueValue',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          falseText: {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: '否',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: 'falseText',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入falseText',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          falseValue: {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: false,
            title: '-',
            'x-decorator-props': {
              gridSpan: 1,
              colon: false,
            },
            'x-component-props': {
              placeholder: 'falseValue',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入falseValue',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
        },
      },
    },
  };

  return <SchemaField schema={schema} />;
};
export default BooleanParam;

import { createSchemaField } from '@formily/react';
import { FormGrid, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { useIntl } from '@@/plugin-locale/localeExports';

const BooleanParam = () => {
  const intl = useIntl();
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
            default: intl.formatMessage({
              id: 'component.metadata.boolean.true',
              defaultMessage: '是',
            }),
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: 'trueText',
            },
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
          },
          falseText: {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: intl.formatMessage({
              id: 'component.metadata.boolean.false',
              defaultMessage: '否',
            }),
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: 'falseText',
            },
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
          },
        },
      },
    },
  };

  return <SchemaField schema={schema} />;
};
export default BooleanParam;

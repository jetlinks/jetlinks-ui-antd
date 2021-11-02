import { Editable, FormItem, FormLayout, Input, Select } from '@formily/antd';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';

interface Props {
  config: MetadataConfig[];
}

const ConfigParam = (props: Props) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Editable,
      FormLayout,
    },
  });

  const formatConfig = (config: MetadataConfig[]) => {
    if (!config) return {};
    return config.reduce((acc, t) => {
      const { properties } = t;
      const configSchema = properties.reduce((cur, i) => {
        return {
          ...cur,
          [i.property]: {
            title: i.name,
            'x-decorator': 'FormItem',
            // 判断type 类型
            'x-component': 'Select',
            enum: i.type.elements.map((e) => ({
              label: e.text,
              value: e.value,
            })),
          },
        };
      }, {});
      return {
        ...acc,
        [t.name]: {
          type: 'void',
          title: t.name,
          'x-component': 'FormLayout',
          'x-component-props': {
            layout: 'vertical',
          },
          'x-decorator': 'Editable.Popover',
          'x-decorator-props': {
            className: 'config-array',
            placement: 'left',
          },
          properties: configSchema,
        },
      };
    }, {});
  };

  const schema: ISchema = {
    type: 'object',
    properties: formatConfig(props.config),
  };
  return <SchemaField schema={schema} />;
};
export default ConfigParam;

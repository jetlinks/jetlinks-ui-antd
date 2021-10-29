import {
  NumberPicker,
  FormLayout,
  Editable,
  ArrayItems,
  FormItem,
  Form,
  Input,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { connect, createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { DataTypeList } from '@/pages/device/data';
import { Store } from 'jetlinks-store';

interface Props {
  value: Record<string, unknown>;
  onChange: () => void;
}

const MetadataParam = connect((props: Props) => {
  const form = createForm({
    initialValues: props.value,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      MetadataParam,
      ArrayItems,
      Editable,
      FormLayout,
      NumberPicker,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      json2: {
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
              type: 'object',
              title: '配置参数',
              'x-decorator': 'Editable.Popover',
              'x-component': 'FormLayout',
              'x-component-props': {
                layout: 'vertical',
              },
              'x-decorator-props': {
                placement: 'left',
              },
              'x-reactions':
                '{{(field)=>field.title = field.value && (field.value.name) || field.title}}',
              properties: {
                id: {
                  title: '标识',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                name: {
                  title: '名称',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                'valueType.type': {
                  title: '数据类型',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  enum: DataTypeList,
                },
                'valueType.unit': {
                  title: '单位',
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
                'valueType.scale': {
                  title: '精度',
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
                  title: 'JSON对象',
                  'x-visible': false,
                  'x-decorator': 'FormItem',
                  'x-component': 'MetadataParam',
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
            title: '添加参数',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };

  return (
    <Form form={form} layout={'vertical'} size={'small'}>
      <SchemaField schema={schema} />
    </Form>
  );
});
export default MetadataParam;

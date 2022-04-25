import { createSchemaField } from '@formily/react';
import {
  ArrayCards,
  ArrayItems,
  Form,
  FormGrid,
  FormItem,
  Input,
  Select,
  Space,
} from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { createForm } from '@formily/core';
import { useMemo } from 'react';
import FTermArrayCards from '@/components/FTermArrayCards';
import FTermTypeSelect from '@/components/FTermTypeSelect';
import styles from './index.less';

const TriggerTerm = () => {
  const form = useMemo(() => createForm({}), []);
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayCards,
      FTermArrayCards,
      ArrayItems,
      Space,
      FormGrid,
      FTermTypeSelect,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      trigger: {
        type: 'array',
        'x-component': 'FTermArrayCards',
        'x-decorator': 'FormItem',
        'x-component-props': {
          title: '分组',
        },
        items: {
          type: 'object',
          properties: {
            index: {
              type: 'void',
              'x-component': 'FTermArrayCards.Index',
            },
            terms: {
              type: 'array',
              'x-component': 'ArrayItems',
              'x-decorator': 'FormItem',
              items: {
                type: 'object',
                properties: {
                  termType: {
                    type: 'string',
                    // "x-decorator": 'FormItem',
                    'x-component': 'FTermTypeSelect',
                  },
                  layout: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 24,
                      minColumns: 24,
                    },
                    properties: {
                      params: {
                        type: 'string',
                        // title: '日期',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-decorator-props': {
                          gridSpan: 4,
                        },
                        'x-component-props': {
                          placeholder: '请选择参数',
                        },
                      },
                      operator: {
                        type: 'string',
                        // title: '输入框',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-decorator-props': {
                          gridSpan: 3,
                        },
                        'x-component-props': {
                          placeholder: '操作符',
                        },
                      },
                      type: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          { label: '手动输入', value: 'sd' },
                          { label: '指标', value: 'metrics' },
                        ],
                        'x-decorator-props': {
                          gridSpan: 3,
                        },
                      },
                      value: {
                        type: 'string',
                        enum: [
                          { label: '高高值', value: 1 },
                          { label: '低低值', value: 2 },
                          { label: '高值', value: 3 },
                          { label: '低值', value: 4 },
                        ],
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {},
                        'x-decorator-props': {
                          gridSpan: 3,
                        },
                      },
                      remove: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.Remove',
                        'x-decorator-props': {
                          gridSpan: 1,
                        },
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: 'void',
                  title: '添加条件',
                  'x-component': 'ArrayItems.Addition',
                },
              },
            },
            remove: {
              type: 'void',
              'x-component': 'FTermArrayCards.Remove',
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '添加分组',
            'x-component': 'FTermArrayCards.Addition',
          },
        },
      },
    },
  };
  return (
    <Form form={form} layout="vertical" className={styles.form}>
      <SchemaField schema={schema} />
    </Form>
  );
};
export default TriggerTerm;

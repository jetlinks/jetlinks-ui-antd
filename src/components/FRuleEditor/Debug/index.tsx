import styles from './index.less';
import { createSchemaField } from '@formily/react';
import { ArrayTable, Form, FormItem, Input, Select } from '@formily/antd';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import FAutoComplete from '@/components/FAutoComplete';

const Debug = () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayTable,
      FAutoComplete,
    },
  });
  const form = useMemo(() => createForm(), []);

  const schema: ISchema = {
    type: 'object',
    properties: {
      array: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: {
            pageSize: 9999,
          },
          style: {
            maxHeight: 260,
            overflowY: 'auto',
          },
          scroll: { y: 240 },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '属性ID',
              },
              properties: {
                id: {
                  'x-decorator': 'FormItem',
                  'x-component': 'FAutoComplete',
                  enum: [1, 2, 4],
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '当前值',
              },
              properties: {
                current: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '上一值',
              },
              properties: {
                last: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '',
                dataIndex: 'operations',
                width: 50,
                fixed: 'right',
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayTable.Remove',
                    },
                  },
                },
              },
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            'x-component': 'ArrayTable.Addition',
            title: '添加条目',
          },
        },
      },
    },
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>
              属性赋值
              <div className={styles.description}>请对上方规则使用的属性进行赋值</div>
            </div>
          </div>
        </div>
        <Form form={form}>
          <SchemaField schema={schema} />
        </Form>
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <div className={styles.title}>
            <div>运行结果</div>
          </div>

          <div className={styles.action}>
            <div>
              <a>开始运行</a>
              {/*<a>停止运行</a>*/}
            </div>
            <div>
              <a>清空</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;

import { Modal } from 'antd';
import styles from './index.less';
import { createSchemaField, FormProvider } from '@formily/react';
import { ArrayTable, FormItem, Input, Select } from '@formily/antd';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';

const Debug = () => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayTable,
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
          pagination: false,
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '字段1',
              },
              properties: {
                t1: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '字段2',
              },
              properties: {
                t2: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '字段3',
              },
              properties: {
                t2: {
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
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
    <Modal visible width="40vw" title="debug">
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
          <FormProvider form={form}>
            <SchemaField schema={schema} />
          </FormProvider>
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
    </Modal>
  );
};

export default Debug;

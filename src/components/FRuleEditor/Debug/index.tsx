import styles from './index.less';
import { createSchemaField, observer } from '@formily/react';
import { ArrayTable, Form, FormItem, Input, Select } from '@formily/antd';
import { useMemo } from 'react';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import FAutoComplete from '@/components/FAutoComplete';
import { Descriptions, Tooltip } from 'antd';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import type { WebsocketPayload } from '@/hooks/websocket/typings';
import { State } from '@/components/FRuleEditor';
import moment from 'moment';
import DB from '@/db';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { action } from '@formily/reactive';

const Debug = observer(() => {
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
  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((data: PropertyMetadata[]) => {
        field.dataSource = data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const getProperty = async () => DB.getDB().table('properties').toArray();

  const schema: ISchema = {
    type: 'object',
    properties: {
      properties: {
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
                  'x-reactions': '{{useAsyncDataSource(getProperty)}}',
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

  const [subscribeTopic] = useSendWebsocketMessage();

  const runScript = async () => {
    subscribeTopic?.(
      `virtual-property-debug-${State.property}-${new Date().getTime()}`,
      '/virtual-property-debug',
      {
        virtualId: `${new Date().getTime()}-virtual-id`,
        property: State.property,
        virtualRule: {
          type: 'script',
          script: State.code,
        },
        properties: form.values.properties || [],
      },
    )?.subscribe((data: WebsocketPayload) => {
      State.log.push({ time: new Date().getTime(), content: JSON.stringify(data.payload) });
    });
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
          <SchemaField schema={schema} scope={{ useAsyncDataSource, getProperty }} />
        </Form>
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <div className={styles.title}>
            <div>运行结果</div>
          </div>

          <div className={styles.action}>
            <div>
              <a onClick={runScript}>开始运行</a>
            </div>
            <div>
              <a
                onClick={() => {
                  State.log = [];
                }}
              >
                清空
              </a>
            </div>
          </div>
        </div>
        <div className={styles.log}>
          <Descriptions>
            {State.log.map((item) => (
              <Descriptions.Item
                label={moment(item.time).format('HH:mm:ss')}
                key={item.time}
                span={3}
              >
                <Tooltip placement="top" title={item.content}>
                  {item.content}
                </Tooltip>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </div>
    </div>
  );
});

export default Debug;

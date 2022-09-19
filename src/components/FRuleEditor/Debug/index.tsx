import styles from './index.less';
import { createSchemaField, observer } from '@formily/react';
import { ArrayTable, Form, FormItem, Input, Select } from '@formily/antd';
import { useEffect, useMemo, useRef, useState } from 'react';
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

interface Props {
  virtualRule?: any;
}

const Debug = observer((props: Props) => {
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
  const virtualIdRef = useRef(new Date().getTime());
  const ws = useRef<any>();
  const wsAgain = useRef<any>();
  const [isBeginning, setIsBeginning] = useState<any>(true);

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
    const propertiesList = await DB.getDB().table('properties').toArray();
    const _properties = form.values?.properties.map((item: any) => {
      const _item = propertiesList.find((i) => i.id === item.id);
      return { ...item, type: _item?.valueType?.type };
    });
    if (ws.current) {
      ws.current.unsubscribe();
    }
    ws.current = subscribeTopic?.(
      `virtual-property-debug-${State.property}-${new Date().getTime()}`,
      '/virtual-property-debug',
      {
        virtualId: `${virtualIdRef.current}-virtual-id`,
        property: State.property,
        virtualRule: {
          ...props.virtualRule,
        },
        properties: _properties || [],
      },
    )?.subscribe(
      (data: WebsocketPayload) => {
        State.log.push({ time: new Date().getTime(), content: JSON.stringify(data.payload) });
      },
      // () => { },
      // () => {
      //   setIsBeginning(true);
      // }
    );
  };
  const runScriptAgain = async () => {
    if (wsAgain.current) {
      wsAgain.current.unsubscribe();
    }
    const propertiesList = await DB.getDB().table('properties').toArray();
    const _properties = form.values?.properties.map((item: any) => {
      const _item = propertiesList.find((i) => i.id === item.id);
      return { ...item, type: _item?.valueType?.type };
    });
    wsAgain.current = subscribeTopic?.(
      `virtual-property-debug-${State.property}-${new Date().getTime()}`,
      '/virtual-property-debug',
      {
        virtualId: `${virtualIdRef.current}-virtual-id`,
        property: State.property,
        virtualRule: {
          ...props.virtualRule,
        },
        properties: _properties || [],
      },
    )?.subscribe(() => {
      // setIsBeginning(true);
    });
  };
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.unsubscribe();
      }
      if (wsAgain.current) {
        wsAgain.current.unsubscribe();
      }
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>
              属性赋值
              <div className={styles.description}>请对上方规则使用的属性进行赋值</div>
            </div>
            {!isBeginning && props.virtualRule?.type === 'window' && (
              <div
                className={styles.action}
                onClick={() => {
                  runScriptAgain();
                }}
              >
                <a style={{ marginLeft: 75 }}>发送数据</a>
              </div>
            )}
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
              {isBeginning ? (
                <a
                  onClick={() => {
                    setIsBeginning(false);
                    runScript();
                  }}
                >
                  开始运行
                </a>
              ) : (
                <a
                  onClick={() => {
                    setIsBeginning(true);
                    if (ws.current) {
                      ws.current.unsubscribe();
                    }
                  }}
                >
                  停止运行
                </a>
              )}
            </div>
            <div>
              <a
                onClick={() => {
                  // console.log(props.virtualRule, 222222222222)
                  // console.log(virtualIdRef.current)
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

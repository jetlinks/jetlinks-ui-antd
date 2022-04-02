import { Alert, Button, Card, Form, Input, Steps } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import {
  ArrayCollapse,
  Form as AForm,
  FormButtonGroup,
  FormCollapse,
  FormGrid,
  FormItem,
  Input as AInput,
  Radio,
  Select,
} from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { createForm } from '@formily/core';

interface Props {
  change: () => void;
  data: any;
}

const Media = (props: Props) => {
  const [current, setCurrent] = useState<number>(0);

  const steps = [
    {
      title: '信令配置',
    },
    {
      title: '完成',
    },
  ];

  const BasicRender = () => {
    const SchemaField = createSchemaField({
      components: {
        FormItem,
        AInput,
        Select,
        Radio,
        FormGrid,
        FormCollapse,
        ArrayCollapse,
      },
    });

    const aform = createForm({});

    const clusterConfig: ISchema = {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 1,
        columnGap: 48,
      },
      properties: {
        serverId: {
          title: '节点名称',
          'x-component': 'AInput',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 1,
            labelAlign: 'left',
            layout: 'vertical',
          },
        },
        host: {
          title: 'SIP 地址',
          'x-decorator': 'FormItem',
          'x-component': 'AInput',
          'x-decorator-props': {
            gridSpan: 1,
            labelAlign: 'left',
            layout: 'vertical',
            tooltip: '绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0',
          },
          required: true,
          'x-validator': ['ipv4'],
        },
        publicHost: {
          title: '公网 Host',
          'x-decorator-props': {
            gridSpan: 1,
            labelAlign: 'left',
            tooltip: '监听指定端口的请求',
            layout: 'vertical',
          },
          required: true,
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'AInput',
          'x-validator': [
            {
              max: 65535,
              message: '请输入1-65535之间的整整数',
            },
            {
              min: 1,
              message: '请输入1-65535之间的整整数',
            },
          ],
        },
      },
    };

    const schema: ISchema = {
      type: 'object',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            maxColumns: 2,
            minColumns: 1,
            columnGap: 48,
          },
          properties: {
            name: {
              title: '名称',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'AInput',
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-validator': [
                {
                  max: 64,
                  message: '最多可输入64个字符',
                },
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            },
            domain: {
              title: 'SIP 域',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'AInput',
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-validator': [
                {
                  required: true,
                  message: '请输入SIP域',
                },
              ],
            },
            sipId: {
              title: 'SIP ID',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'AInput',
              'x-decorator-props': {
                gridSpan: 2,
              },
              'x-validator': [
                {
                  required: true,
                  message: 'SIP ID',
                },
              ],
            },
            shareCluster: {
              title: '集群',
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              required: true,
              default: true,
              enum: [
                { label: '共享配置', value: true },
                { label: '独立配置', value: false },
              ],
              'x-decorator-props': {
                gridSpan: 2,
                tooltip:
                  '共享配置:集群下所有节点共用同一配置\r\n' + '独立配置:集群下不同节点使用不同配置',
              },
            },
            hostPort: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-reactions': [
                {
                  dependencies: ['.shareCluster'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]===true}}',
                    },
                  },
                },
              ],
              'x-decorator-props': {
                gridSpan: 2,
              },
              properties: {
                grid: {
                  type: 'void',
                  'x-component': 'FormGrid',
                  'x-component-props': {
                    maxColumns: 2,
                    minColumns: 1,
                    columnGap: 48,
                  },
                  properties: {
                    host: {
                      title: 'SIP 地址',
                      'x-component': 'AInput',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        gridSpan: 1,
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                    },
                    publicHost: {
                      title: '公网 Host',
                      'x-component': 'AInput',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        gridSpan: 1,
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                    },
                  },
                },
              },
            },
            cluster: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-reactions': {
                dependencies: ['.shareCluster'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]===false}}',
                  },
                },
              },
              'x-visible': false,
              properties: {
                cluster: {
                  type: 'array',
                  'x-component': 'ArrayCollapse',
                  'x-decorator': 'FormItem',
                  items: {
                    type: 'void',
                    'x-component': 'ArrayCollapse.CollapsePanel',
                    'x-component-props': {
                      header: '节点',
                    },
                    properties: {
                      index: {
                        type: 'void',
                        'x-component': 'ArrayCollapse.Index',
                      },
                      layout2: clusterConfig,
                      remove: {
                        type: 'void',
                        'x-component': 'ArrayCollapse.Remove',
                      },
                    },
                  },
                  properties: {
                    addition: {
                      type: 'void',
                      title: '新增',
                      'x-component': 'ArrayCollapse.Addition',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    return (
      <div>
        <Alert message="配置设备信令参数" type="warning" showIcon />
        <AForm form={aform} layout="vertical" style={{ padding: 30 }}>
          <SchemaField schema={schema} />
          <FormButtonGroup.Sticky>
            <FormButtonGroup.FormItem>
              <Button
                onClick={() => {
                  setCurrent(1);
                }}
              >
                下一步
              </Button>
            </FormButtonGroup.FormItem>
          </FormButtonGroup.Sticky>
        </AForm>
      </div>
    );
  };

  const FinishRender = () => {
    const [form] = Form.useForm();
    return (
      <div className={styles.view}>
        <div className={styles.info}>
          <div className={styles.title}>基本信息</div>
          <Form name="basic" layout="vertical" form={form}>
            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="说明">
              <Input.TextArea showCount maxLength={200} />
            </Form.Item>
          </Form>
          <div className={styles.action}>
            {props.data.id !== 'fixed-media' && (
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  setCurrent(0);
                }}
              >
                上一步
              </Button>
            )}
            <Button type="primary" onClick={() => {}}>
              保存
            </Button>
          </div>
        </div>
        <div className={styles.config}>
          <div className={styles.title}>接入方式</div>
          <div>这里是接入方式说明</div>
          <div className={styles.title}>消息协议</div>
          <div>这里是接入方式说明</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log(props.data);
  }, []);

  return (
    <Card>
      {props.data?.id && (
        <Button
          type="link"
          onClick={() => {
            props.change();
          }}
        >
          返回
        </Button>
      )}
      {props.data.id === 'fixed-media' ? (
        FinishRender()
      ) : (
        <div className={styles.box}>
          <div className={styles.steps}>
            <Steps size="small" current={current}>
              {steps.map((item) => (
                <Steps.Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
          <div className={styles.content}>{current === 0 ? BasicRender() : FinishRender()}</div>
        </div>
      )}
    </Card>
  );
};

export default Media;

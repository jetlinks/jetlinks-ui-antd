import { Button, Card, Col, Form, Input, message, Row, Steps } from 'antd';
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
import { createForm, registerValidateRules } from '@formily/core';
import { service } from '@/pages/link/AccessConfig';
import { useLocation } from 'umi';
import SipComponent from '@/components/SipComponent';
import TitleComponent from '@/components/TitleComponent';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { testIP } from '@/utils/util';

type LocationType = {
  id?: string;
};
interface Props {
  change: () => void;
  data: any;
  provider: any;
}

const Media = (props: Props) => {
  const [current, setCurrent] = useState<number>(0);
  const [form] = Form.useForm();
  const [configuration, setConfiguration] = useState<any>({});
  const [clusters, setClusters] = useState<any[]>([]);

  const location = useLocation<LocationType>();

  const params = new URLSearchParams(location.search);

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
        SipComponent,
        FormGrid,
        FormCollapse,
        ArrayCollapse,
      },
    });

    const aform = createForm({
      validateFirst: true,
      initialValues: {
        configuration: configuration,
      },
    });

    registerValidateRules({
      checkSIP(value: { host: string; port: number }) {
        if (Number(value.port) < 1 || Number(value.port) > 65535) {
          return {
            type: 'error',
            message: '端口请输入1~65535之间的正整数',
          };
        } else if (!testIP(value.host)) {
          return {
            type: 'error',
            message: '请输入正确的IP地址',
          };
        }
        return true;
      },
    });

    const clusterConfig: ISchema = {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 1,
        columnGap: 48,
      },
      properties: {
        clusterNodeId: {
          title: '节点名称',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 1,
            labelAlign: 'left',
            layout: 'vertical',
          },
          enum: [...clusters],
        },
        sip: {
          title: 'SIP 地址',
          'x-decorator': 'FormItem',
          'x-component': 'SipComponent',
          'x-decorator-props': {
            gridSpan: 1,
            labelAlign: 'left',
            layout: 'vertical',
            tooltip: '绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0',
          },
          required: true,
          'x-validator': {
            checkSIP: true,
          },
        },
        public: {
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
          'x-component': 'SipComponent',
          'x-validator': {
            checkSIP: true,
          },
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
            'configuration.domain': {
              title: 'SIP 域',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'AInput',
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-component-props': {
                placeholder: '请输入SIP 域',
              },
              'x-validator': [
                {
                  required: true,
                  message: '请输入SIP域',
                },
              ],
            },
            'configuration.sipId': {
              title: 'SIP ID',
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'AInput',
              'x-component-props': {
                placeholder: '请输入SIP ID',
              },
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-validator': [
                {
                  required: true,
                  message: 'SIP ID',
                },
              ],
            },
            'configuration.shareCluster': {
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
            'configuration.hostPort': {
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
                    style: {
                      background: '#f6f6f6',
                      padding: 10,
                    },
                  },
                  properties: {
                    sip: {
                      title: 'SIP 地址',
                      'x-component': 'SipComponent',
                      'x-decorator': 'FormItem',
                      required: true,
                      'x-decorator-props': {
                        gridSpan: 1,
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                      'x-validator': {
                        checkSIP: true,
                      },
                    },
                    public: {
                      title: '公网 Host',
                      'x-component': 'SipComponent',
                      'x-decorator': 'FormItem',
                      required: true,
                      'x-decorator-props': {
                        gridSpan: 1,
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                      'x-validator': {
                        checkSIP: true,
                      },
                    },
                  },
                },
              },
            },
            'configuration.cluster': {
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
        <div className={styles.alert}>
          <ExclamationCircleFilled style={{ marginRight: 10 }} />
          配置设备信令参数
        </div>
        <AForm form={aform} layout="vertical" style={{ padding: 30 }}>
          <SchemaField schema={schema} />
          <FormButtonGroup.Sticky>
            <FormButtonGroup.FormItem>
              <Button
                onClick={async () => {
                  const value = await aform.submit<any>();
                  let param: any = {};
                  if (value.configuration.shareCluster) {
                    const hostPort = { ...value.configuration.hostPort };
                    param = {
                      ...value.configuration,
                      hostPort: {
                        host: hostPort.sip.host,
                        port: hostPort.sip.port,
                        publicHost: hostPort.public.host,
                        publicPort: hostPort.public.port,
                      },
                    };
                  } else {
                    const cluster: any[] = [];
                    value.configuration.cluster.forEach((item: any) => {
                      cluster.push({
                        clusterNodeId: item?.clusterNodeId || '',
                        host: item?.sip?.host,
                        port: item?.sip?.port,
                        publicHost: item.public?.host,
                        publicPort: item.public?.port,
                        enabled: true,
                      });
                    });
                    param = {
                      ...value.configuration,
                      cluster: cluster,
                    };
                  }
                  setConfiguration(param);
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
    return (
      <Row gutter={24}>
        <Col span={12}>
          <div className={styles.info}>
            <TitleComponent data={'基本信息'} />
            <Form name="basic" layout="vertical" form={form}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="说明">
                <Input.TextArea showCount maxLength={200} />
              </Form.Item>
            </Form>
            <div className={styles.action}>
              {props?.provider?.id !== 'fixed-media' && (
                <Button
                  style={{ margin: '0 8px' }}
                  onClick={() => {
                    setCurrent(0);
                  }}
                >
                  上一步
                </Button>
              )}
              <Button
                type="primary"
                onClick={async () => {
                  const values = await form.validateFields();
                  const param: any = {
                    name: values.name,
                    description: values.description,
                  };
                  if (props?.provider?.id === 'fixed-media') {
                    param.provider = 'fixed-media';
                    param.transport = 'URL';
                    param.channel = 'fixed-media';
                  } else {
                    param.provider = 'gb28181-2016';
                    param.transport = 'SIP';
                    param.channel = 'gb28181';
                    param.configuration = configuration;
                  }
                  let resp = undefined;
                  if (!!params.get('id')) {
                    resp = await service.update({ ...param, id: params.get('id') || '' });
                  } else {
                    resp = await service.save({ ...param });
                  }
                  if (resp.status === 200) {
                    message.success('操作成功！');
                    history.back();
                  }
                }}
              >
                保存
              </Button>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.config}>
            <div className={styles.title}>接入方式</div>
            <div>{props.provider?.name}</div>
            <div>{props.provider?.description}</div>
            <div className={styles.title}>消息协议</div>
            <div>{props.provider?.id === 'fixed-media' ? 'URL' : 'SIP'}</div>
            <div>这里是消息协议说明</div>
          </div>
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    if (props.data) {
      form.setFieldsValue({
        name: props.data?.name,
        description: props.data?.description,
      });
      if (props?.provider?.id !== 'fixed-media') {
        if (props.data?.configuration?.shareCluster) {
          const hostPort = { ...props.data?.configuration?.hostPort };
          setConfiguration({
            ...props.data?.configuration,
            hostPort: {
              sip: {
                port: hostPort.port,
                host: hostPort.host,
              },
              public: {
                port: hostPort.publicPort,
                host: hostPort.publicHost,
              },
            },
          });
        } else {
          const cluster: any[] = [];
          (props.data?.configuration?.cluster || []).forEach((item: any) => {
            cluster.push({
              clusterNodeId: item?.clusterNodeId || '',
              enabled: true,
              sip: {
                port: item?.port,
                host: item?.host,
              },
              public: {
                port: item?.publicPort,
                host: item?.publicHost,
              },
            });
          });
          setConfiguration({ ...props.data?.configuration, cluster });
        }
      }
    }
  }, [props.data]);

  useEffect(() => {
    if (props?.provider?.id !== 'fixed-media') {
      service.getClusters().then((resp: any) => {
        if (resp.status === 200) {
          const list = (resp?.result || []).map((item: any) => {
            return {
              label: item.id,
              value: item.name,
            };
          });
          setClusters(list);
        }
      });
      setCurrent(0);
    } else {
      setCurrent(1);
    }
  }, [props?.provider?.id]);

  return (
    <Card>
      {!props.data?.id && (
        <Button
          type="link"
          onClick={() => {
            props.change();
          }}
        >
          返回
        </Button>
      )}
      {props?.provider?.id === 'fixed-media' ? (
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

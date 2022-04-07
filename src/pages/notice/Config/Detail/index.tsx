import { PageContainer } from '@ant-design/pro-layout';
import { createForm, onFieldValueChange } from '@formily/core';
import { Card, Col, Input, Row } from 'antd';
import { ISchema } from '@formily/json-schema';
import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import {
  FormButtonGroup,
  FormItem,
  Select,
  Submit,
  Switch,
  Form,
  Radio,
  ArrayTable,
  Editable,
  PreviewText,
  Space,
  NumberPicker,
  Checkbox,
} from '@formily/antd';
import styles from './index.less';
import { service } from '@/pages/notice/Config';
import { useAsyncDataSource } from '@/utils/util';
import { useParams } from 'umi';
import { typeList } from '@/pages/notice';
import FUpload from '@/components/Upload';

const Detail = () => {
  const { id } = useParams<{ id: string }>();

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldValueChange('type', async (field, f) => {
            const type = field.value;
            if (!type) return;
            f.setFieldState('provider', (state) => {
              state.value = undefined;
              // state.dataSource = providerRef.current
              //   .find((item) => type === item.id)
              //   ?.providerInfos.map((i) => ({ label: i.name, value: i.id }));
            });
          });
          onFieldValueChange('provider', async () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            // currentType = field.value;
            // await createSchema();
          });
        },
      }),
    [id],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Switch,
      Radio,
      ArrayTable,
      Editable,
      PreviewText,
      Space,
      FUpload,
      Checkbox,
      NumberPicker,
    },
  });

  const getTypes = async () =>
    service.getTypes().then((resp) => {
      return resp.result.map((item: NetworkType) => ({
        label: item.name,
        value: item.id,
      }));
    });

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      type: {
        title: '分类',
        'x-component': 'Input',
        'x-value': id,
        'x-hidden': true,
      },
      provider: {
        title: '类型',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {
          optionType: 'button',
        },
        required: true,
        'x-visible': typeList[id]?.length > 0,
        'x-hidden': id === 'email',
        enum: typeList[id] || [],
      },
      configuration: {
        type: 'object',
        properties: {
          weixin: {
            type: 'void',
            properties: {
              corpId: {
                title: 'corpID',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 企业消息
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="corpMessage"}}',
                    },
                  },
                },
              },
              corpSecret: {
                title: 'corpSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="corpMessage"}}',
                    },
                  },
                },
              },
              AppId: {
                title: 'appId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="officialMessage"}}',
                    },
                  },
                },
              },
              AppSecret: {
                title: 'appSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="officialMessage"}}',
                    },
                  },
                },
              },
            },
            'x-visible': id === 'weixin',
          },
          dingTalk: {
            type: 'void',
            'x-visible': id === 'dingTalk',
            properties: {
              AppKey: {
                title: 'AppKey',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 钉钉消息通知
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkMessage"}}',
                    },
                  },
                },
              },
              AppSecret: {
                title: 'AppSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 钉钉消息通知
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkMessage"}}',
                    },
                  },
                },
              },
              Webhook: {
                title: 'webHook',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 群机器人
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkRobotWebHook"}}',
                    },
                  },
                },
              },
            },
          },
          // 阿里云语音/短信
          voiceOrSms: {
            type: 'void',
            'x-visible': id === 'voice' || id === 'sms',
            properties: {
              RegionId: {
                title: 'regionId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              AccessKeyId: {
                title: 'accessKeyId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              Secret: {
                title: 'secret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          },
          email: {
            type: 'void',
            'x-visible': id === 'email',
            properties: {
              space: {
                title: '服务器地址',
                type: 'void',
                'x-component': 'Space',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  asterisk: true,
                  feedbackLayout: 'none',
                },
                properties: {
                  host: {
                    // title: '服务器地址',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                  },
                  port: {
                    // title: '端口',
                    'x-component': 'NumberPicker',
                    'x-decorator': 'FormItem',
                  },
                  enableSSL: {
                    // title: '开启SSL',
                    type: 'boolean',
                    'x-component': 'Checkbox.Group',
                    'x-decorator': 'FormItem',
                    enum: [{ label: '开启SSL', value: true }],
                  },
                },
              },
              sender: {
                title: '发件人',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              username: {
                title: '用户名',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              password: {
                title: '密码',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          },
        },
      },
      description: {
        title: '说明',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 4,
        },
      },
    },
  };

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={10}>
            <Form className={styles.form} form={form} layout={'vertical'}>
              <SchemaField scope={{ useAsyncDataSource, getTypes }} schema={schema} />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <Submit>保存</Submit>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} push={2}>
            结果
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Detail;

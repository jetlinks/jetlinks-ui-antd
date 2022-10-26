import { PageContainer } from '@ant-design/pro-layout';
import { createForm, onFieldValueChange } from '@formily/core';
import { Card, Col, Input, Row } from 'antd';
import { ISchema } from '@formily/json-schema';
import { useEffect, useMemo, useState } from 'react';
import { createSchemaField, observer } from '@formily/react';
import {
  ArrayTable,
  Checkbox,
  Editable,
  Form,
  FormButtonGroup,
  FormItem,
  NumberPicker,
  PreviewText,
  Radio,
  Select,
  Space,
  Switch,
} from '@formily/antd';
import styles from './index.less';
import { service, state } from '@/pages/notice/Config';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import { useParams } from 'umi';
import { typeList } from '@/pages/notice';
import FUpload from '@/components/Upload';
import WeixinCorp from '@/pages/notice/Config/Detail/doc/WeixinCorp';
import WeixinApp from '@/pages/notice/Config/Detail/doc/WeixinApp';
import DingTalk from '@/pages/notice/Config/Detail/doc/DingTalk';
import DingTalkRebot from '@/pages/notice/Config/Detail/doc/DingTalkRebot';
import AliyunSms from '@/pages/notice/Config/Detail/doc/AliyunSms';
import AliyunVoice from '@/pages/notice/Config/Detail/doc/AliyunVoice';
import Email from '@/pages/notice/Config/Detail/doc/Email';
import { PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';
import FAutoComplete from '@/components/FAutoComplete';
import Webhook from './doc/Webhook';
import { useModel } from '@@/plugin-model/useModel';

export const docMap = {
  weixin: {
    corpMessage: <WeixinCorp />,
    officialMessage: <WeixinApp />,
  },
  dingTalk: {
    dingTalkMessage: <DingTalk />,
    dingTalkRobotWebHook: <DingTalkRebot />,
  },
  voice: {
    aliyun: <AliyunVoice />,
  },
  sms: {
    aliyunSms: <AliyunSms />,
  },
  email: {
    embedded: <Email />,
  },
  webhook: {
    http: <Webhook />,
  },
};

const Detail = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { initialState } = useModel('@@initialState');
  const [provider, setProvider] = useState<string>('embedded');
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldValueChange('type', async (field) => {
            const type = field.value;
            if (!type) return;
            // f.setFieldState('provider', (state1) => {
            // state1.value = undefined;
            // state.dataSource = providerRef.current
            //   .find((item) => type === item.id)
            //   ?.providerInfos.map((i) => ({ label: i.name, value: i.id }));
            // });
          });
          onFieldValueChange('provider', async (field) => {
            if (id === 'email') {
              setProvider('embedded');
            } else {
              setProvider(field.value);
            }
          });
        },
      }),
    [id],
  );

  useEffect(() => {
    setTimeout(() => {
      if (initialState?.settings?.title) {
        document.title = `通知配置 - ${initialState?.settings?.title}`;
      } else {
        document.title = '通知配置';
      }
    }, 0);
    if (id === 'webhook') {
      setProvider('http');
    }
    if (state.current) {
      form.setValues(state.current);
    }
  }, []);

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
      FAutoComplete,
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
        required: true,
        'x-component': 'Input',
        'x-decorator': 'FormItem',
        'x-component-props': {
          placeholder: '请输入名称',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
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
        'x-hidden': id === 'email' || id === 'webhook',
        'x-value': typeList[id]?.[0]?.value,
        enum: typeList[id] || [],
      },
      configuration: {
        type: 'object',
        properties: {
          weixin: {
            type: 'void',
            properties: {
              corpId: {
                title: 'corpId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                required: true,
                // 企业消息
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="corpMessage"}}',
                    },
                  },
                },
                'x-component-props': {
                  placeholder: '请输入corpId',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              corpSecret: {
                title: 'corpSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                required: true,
                'x-component-props': {
                  placeholder: '请输入corpSecret',
                },
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="corpMessage"}}',
                    },
                  },
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              appId: {
                title: 'appID',
                'x-component': 'Input',
                required: true,
                'x-decorator': 'FormItem',
                'x-component-props': {
                  placeholder: '请输入appId',
                },
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="officialMessage"}}',
                    },
                  },
                },
              },
              secret: {
                title: 'AppSecret',
                'x-component': 'Input',
                required: true,
                'x-decorator': 'FormItem',
                'x-component-props': {
                  placeholder: '请输入secret',
                },
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
              appKey: {
                title: 'AppKey',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                required: true,
                'x-component-props': {
                  placeholder: '请输入AppKey',
                },
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkMessage"}}',
                    },
                  },
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              appSecret: {
                title: 'AppSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                required: true,
                'x-component-props': {
                  placeholder: '请输入AppSecret',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkMessage"}}',
                    },
                  },
                },
              },
              url: {
                title: 'webHook',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                required: true,
                'x-component-props': {
                  placeholder: '请输入webhook',
                },

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
              regionId: {
                title: 'RegionId',
                required: true,
                'x-component-props': {
                  placeholder: '请输入regionId',
                },
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              accessKeyId: {
                title: 'AccessKeyId',
                required: true,
                'x-component-props': {
                  placeholder: '请输入accessKeyId',
                },
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              secret: {
                title: 'Secret',
                required: true,
                'x-component-props': {
                  placeholder: '请输入secret',
                },
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
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
                    required: true,
                    'x-component-props': {
                      placeholder: '请输入服务器地址',
                      style: {
                        width: '180px',
                      },
                    },
                    'x-component': 'FAutoComplete',
                    'x-decorator': 'FormItem',
                    enum: [
                      { label: 'smtp.163.com', value: 'smtp.163.com' },
                      { label: 'pop.163.com', value: 'pop.163.com' },
                      { label: 'smtp.exmail.qq.com', value: 'smtp.exmail.qq.com' },
                      { label: 'pop.exmail.qq.com', value: 'pop.exmail.qq.com' },
                      { label: 'smtp.qq.com', value: 'smtp.qq.com' },
                      { label: 'pop.qq.com', value: 'pop.qq.com' },
                      { label: 'smtpdm.aliyun.com', value: 'smtpdm.aliyun.com' },
                      { label: 'smtp.126.com', value: 'smtp.126.com' },
                      { label: 'pop.126.com', value: 'pop.126.com' },
                    ],
                  },
                  port: {
                    // title: '端口',
                    required: true,
                    'x-component-props': {
                      placeholder: '请输入端口',
                    },
                    default: 25,
                    'x-validator': [
                      {
                        min: 1,
                        max: 65535,
                        message: '请输入1～65535之间的正整数',
                      },
                    ],
                    'x-component': 'NumberPicker',
                    'x-decorator': 'FormItem',
                    'x-reactions': {
                      dependencies: ['.ssl'],
                      when: '{{$deps[0]}}',
                      fulfill: {
                        state: {
                          value: 465,
                        },
                      },
                      otherwise: {
                        state: {
                          value: 25,
                        },
                      },
                    },
                  },
                  ssl: {
                    // title: '开启SSL',
                    type: 'boolean',
                    'x-component': 'Checkbox',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      children: '开启SSL',
                      style: {
                        width: '100px',
                      },
                    },
                    // enum: [{label: '开启SSL', value: true}],
                  },
                },
              },
              sender: {
                title: '发件人',
                required: true,
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  placeholder: '请输入发件人',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              username: {
                title: '用户名',
                required: true,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入用户名',
                },
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              password: {
                title: '密码',
                required: true,
                'x-component-props': {
                  placeholder: '请输入密码',
                },
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
            },
          },
          webhook: {
            'x-visible': id === 'webhook',
            type: 'void',
            properties: {
              url: {
                title: 'Webhook',
                required: true,
                'x-component-props': {
                  placeholder: '请输入Webhook',
                },
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 'x-validator': [
                //   {
                //     max: 64,
                //     message: '最多可输入64个字符',
                //   },
                // ],
              },
              headers: {
                title: '请求头',
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {
                  pagination: { pageSize: 9999 },
                  // scroll: {x: '100%'},
                },
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 200, title: 'KEY' },
                      properties: {
                        key: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          required: true,
                          'x-validator': [
                            {
                              max: 64,
                              message: '最多可输入64个字符',
                            },
                          ],
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 200, title: 'VALUE' },
                      properties: {
                        value: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          required: true,
                          'x-validator': [
                            {
                              max: 64,
                              message: '最多可输入64个字符',
                            },
                          ],
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '操作',
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
                    title: '添加',
                  },
                },
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
        'x-validator': [
          {
            max: 200,
            message: '最多可输入200个字符',
          },
        ],
      },
    },
  };

  const handleSave = async () => {
    const data: ConfigItem = await form.submit();
    let response;
    if (data.id) {
      response = await service.update(data);
    } else {
      response = await service.save(data);
    }

    if (response?.status === 200) {
      onlyMessage('保存成功');
      history.back();
    }
  };

  const { getOtherPermission } = usePermissions('notice');

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={10}>
            <Form className={styles.form} form={form} layout={'vertical'}>
              <SchemaField scope={{ useAsyncDataSource, getTypes }} schema={schema} />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <PermissionButton
                    type="primary"
                    onClick={handleSave}
                    isPermission={getOtherPermission(['add', 'update'])}
                  >
                    保存
                  </PermissionButton>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} push={2}>
            {docMap?.[id]?.[provider]}
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
});

export default Detail;

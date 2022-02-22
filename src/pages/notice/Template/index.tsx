import { PageContainer } from '@ant-design/pro-layout';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import BaseCrud from '@/components/BaseCrud';
import { ArrowDownOutlined, BugOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import Service from '@/pages/notice/Template/service';
import { useAsyncDataSource } from '@/utils/util';
import type { Field } from '@formily/core';
import { onFieldValueChange } from '@formily/core';

export const service = new Service('notifier/template');
const Template = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TemplateItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      title: intl.formatMessage({
        id: 'pages.notice.config.type',
        defaultMessage: '通知类型',
      }),
    },
    {
      dataIndex: 'provider',
      title: intl.formatMessage({
        id: 'pages.table.provider',
        defaultMessage: '服务商',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a key="edit" onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="delete">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined />
          </Tooltip>
        </a>,
        <a key="download">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a key="debug">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
            <BugOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  const providerRef = useRef<NetworkType[]>([]);

  const getTypes = async () =>
    service.getTypes().then((resp) => {
      providerRef.current = resp.result;
      return resp.result.map((item: NetworkType) => ({
        label: item.name,
        value: item.id,
      }));
    });

  const formEvent = () => {
    onFieldValueChange('type', async (field, f) => {
      const type = field.value;
      if (!type) return;
      f.setFieldState('provider', (state) => {
        state.value = undefined;
        state.dataSource = providerRef.current
          .find((item) => type === item.id)
          ?.providerInfos.map((i) => ({ label: i.name, value: i.id }));
      });
    });
  };

  const handleNetwork = (field: Field) => {
    const provider = field.query('...provider').get('value');
    const defaultMessage = {
      MQTT_CLIENT:
        'qos1 /device/${#deviceId}\n' +
        '\n' +
        '${T(com.alibaba.fastjson.JSON).toJSONString(#this)}',
      HTTP_CLIENT:
        'POST http://[host]:[port]/api\n' +
        'Content-Type: application/json\n' +
        '\n' +
        '${T(com.alibaba.fastjson.JSON).toJSONString(#this)}',
    };
    field.value = defaultMessage[provider];
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.notice.config.schema.name',
          defaultMessage: '名称',
        }),
        required: true,
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-decorator': 'FormItem',
        properties: {
          type: {
            type: 'string',
            title: intl.formatMessage({
              id: 'pages.notice.config.type',
              defaultMessage: '通知类型',
            }),
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              labelCol: 8,
              wrapperCol: 12,
            },
            'x-reactions': ['{{useAsyncDataSource(getTypes)}}'],
          },
          provider: {
            type: 'string',
            title: intl.formatMessage({
              id: 'pages.notice.config.schema.service.provider',
              defaultMessage: '服务商',
            }),
            'x-component': 'Select',
            'x-decorator-props': {
              labelCol: 4,
              wrapperCol: 16,
            },
            'x-decorator': 'FormItem',
          },
        },
      },
      template: {
        type: 'object',
        properties: {
          voice: {
            type: 'void',
            properties: {
              ttsCode: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.id',
                  defaultMessage: '模版ID',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              calledShowNumbers: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.calledShowNumbers',
                  defaultMessage: '被叫显号',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              CalledNumber: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.calledNumber',
                  defaultMessage: '被叫号码',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              PlayTimes: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.play.times',
                  defaultMessage: '播放次数',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="voice"}}',
                },
              },
            },
          },
          sms: {
            type: 'void',
            properties: {
              test: {
                type: 'void',
                properties: {
                  text: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.app.id',
                      defaultMessage: '应用ID',
                    }),
                    'x-component': 'Input.TextArea',
                    'x-decorator': 'FormItem',
                  },
                  sendTo: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.recipient',
                      defaultMessage: '收件人',
                    }),
                    'x-component': 'Input.TextArea',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'pages.notice.template.recipients.split',
                        defaultMessage: '多个收件人以 , 分割',
                      }),
                    },
                  },
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['...provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="test"}}',
                    },
                  },
                },
              },
              aliyunSms: {
                type: 'void',
                properties: {
                  code: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.sms.templateCode',
                      defaultMessage: '模版编码',
                    }),
                    'x-component': 'Input.TextArea',
                    'x-decorator': 'FormItem',
                    required: true,
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'pages.notice.template.sms.Aliyun.templateCode',
                        defaultMessage: '阿里云短信模版编码',
                      }),
                    },
                  },
                  signName: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.sms.signature',
                      defaultMessage: '签名',
                    }),
                    'x-component': 'Input.TextArea',
                    'x-decorator': 'FormItem',
                    required: true,
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'pages.notice.template.sms.Aliyun.templateSignature',
                        defaultMessage: '阿里云短信模版签名',
                      }),
                    },
                  },
                  phoneNumber: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.recipient',
                      defaultMessage: '收件人',
                    }),
                    'x-component': 'Input.TextArea',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'pages.notice.template.sms.recipient.single',
                        defaultMessage: '短信接收者,暂只支持单个联系人',
                      }),
                    },
                  },
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['...provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="aliyunSms"}}',
                    },
                  },
                },
              },
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="sms"}}',
                },
              },
            },
          },
          email: {
            type: 'void',
            properties: {
              subject: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.title',
                  defaultMessage: '标题',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              sendTo: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.recipient',
                  defaultMessage: '收件人',
                }),
                'x-component': 'Input.TextArea',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'pages.notice.template.recipients.split',
                    defaultMessage: '多个收件人以  ,  分隔',
                  }),
                },
              },
              attachments: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.email.attachments',
                  defaultMessage: '附件',
                }),
                'x-component': 'FUpload',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  type: 'multi',
                },
              },
              emailEditor: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.email.text',
                  defaultMessage: '正文',
                }),
                'x-component': 'FBraftEditor',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  style: {
                    height: '300px',
                  },
                  contentStyle: {
                    height: '200px',
                    // overflowY: 'auto',
                  },
                },
              },
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="email"}}',
                },
              },
            },
          },
          weixin: {
            type: 'void',
            properties: {
              agentId: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.app.id',
                  defaultMessage: '应用ID',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              toUser: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.recipient.id',
                  defaultMessage: '收信人ID',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              toParty: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.recipient.department.id',
                  defaultMessage: '收信部门ID',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              toTag: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.weixin.push.tag',
                  defaultMessage: '按标签推送',
                }),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              message: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.content',
                  defaultMessage: '内容',
                }),
                'x-component': 'Input.TextArea',
                'x-decorator': 'FormItem',
              },
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="weixin"}}',
                },
              },
            },
          },
          dingTalk: {
            type: 'void',
            properties: {
              dingTalkRobotWebHook: {
                type: 'void',
                properties: {
                  messageType: {
                    title: intl.formatMessage({
                      id: 'pages.notice.template.dingTalk.messageType',
                      defaultMessage: '消息类型',
                    }),
                    type: 'string',
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    enum: ['text', 'markdown', 'link'],
                  },
                  text: {
                    type: 'object',
                    properties: {
                      content: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.dingTalk.notificationContent',
                          defaultMessage: '通知内容',
                        }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                      },
                    },
                    'x-visible': false,
                    'x-reactions': {
                      dependencies: ['.messageType'],
                      fulfill: {
                        state: {
                          visible: '{{$deps[0]==="text"}}',
                        },
                      },
                    },
                  },
                  markdown: {
                    type: 'object',
                    properties: {
                      title: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.title',
                          defaultMessage: '标题',
                        }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                      text: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.content',
                          defaultMessage: '内容',
                        }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                      },
                    },
                    'x-visible': false,
                    'x-reactions': {
                      dependencies: ['.messageType'],
                      fulfill: {
                        state: {
                          visible: '{{$deps[0]==="markdown"}}',
                        },
                      },
                    },
                  },
                  link: {
                    type: 'object',
                    properties: {
                      title: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.title',
                          defaultMessage: '标题',
                        }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                      },
                      text: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.content',
                          defaultMessage: '内容',
                        }),
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                      },
                      picUrl: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.picUrl',
                          defaultMessage: '图片连接',
                        }),
                        'x-decorator': 'FormItem',
                        'x-component': 'FUpload',
                      },
                      messageUrl: {
                        title: intl.formatMessage({
                          id: 'pages.notice.template.messageUrl',
                          defaultMessage: '内容连接',
                        }),
                        'x-decorator': 'FormItem',
                        'x-component': 'Input.TextArea',
                      },
                    },
                    'x-visible': false,
                    'x-reactions': {
                      dependencies: ['.messageType'],
                      fulfill: {
                        state: {
                          visible: '{{$deps[0]==="link"}}',
                        },
                      },
                    },
                  },
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['...provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkRobotWebHook"}}',
                    },
                  },
                },
              },
              dingTalkMessage: {
                type: 'void',
                properties: {
                  agentId: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.app.id',
                      defaultMessage: '应用ID',
                    }),
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                  },
                  userIdList: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.recipient.id',
                      defaultMessage: '收信人ID',
                    }),
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                  },
                  departmentIdList: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.recipient.department.id',
                      defaultMessage: '收信部门ID',
                    }),
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                  },
                  toAllUser: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.dingTalkMessage.allUser',
                      defaultMessage: '全部用户',
                    }),
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    enum: [
                      {
                        label: intl.formatMessage({
                          id: 'pages.notice.template.dingTalkMessage.yes',
                          defaultMessage: '是',
                        }),
                        value: true,
                      },
                      {
                        label: intl.formatMessage({
                          id: 'pages.notice.template.dingTalkMessage.no',
                          defaultMessage: '否',
                        }),
                        value: false,
                      },
                    ],
                  },
                  message: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'pages.notice.template.content',
                      defaultMessage: '内容',
                    }),
                    'x-component': 'Input.TextArea',
                    'x-decorator': 'FormItem',
                  },
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['...provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkMessage"}}',
                    },
                  },
                },
              },
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="dingTalk"}}',
                },
              },
            },
          },
          network: {
            type: 'void',
            properties: {
              text: {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.notice.template.network.message',
                  defaultMessage: '消息',
                }),
                'x-component': 'Input.TextArea',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  rows: 5,
                },
                'x-reactions': '{{handleNetwork}}',
              },
            },
            'x-visible': false,
            'x-reactions': {
              dependencies: ['...type'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="network"}}',
                },
              },
            },
          },
        },
      },
    },
  };
  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.notice.template',
          defaultMessage: '通知模版',
        })}
        modelConfig={{
          width: '50vw',
        }}
        formEffect={formEvent}
        schema={schema}
        schemaConfig={{ scope: { useAsyncDataSource, getTypes, handleNetwork } }}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Template;

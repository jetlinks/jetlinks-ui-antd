import {
  ArrayTable,
  Editable,
  Form,
  FormButtonGroup,
  FormItem,
  Input,
  NumberPicker,
  PreviewText,
  Radio,
  Select,
  Space,
  Submit,
  Switch,
} from '@formily/antd';
import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import styles from './index.less';
import { useEffect, useMemo } from 'react';
import FUpload from '@/components/Upload';
import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, message, Row } from 'antd';
import { typeList } from '@/pages/notice';
import { service, state } from '@/pages/notice/Template';

const Detail = observer(() => {
  const { id } = useParams<{ id: string }>();

  // 正则提取${}里面的值
  const pattern = /(?<=\$\{).*?(?=\})/g;
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldValueChange('template.message', (field, form1) => {
            const value = (field as Field).value;
            const idList = value
              .match(pattern)
              ?.filter((i: string) => i)
              .map((item: string) => ({ id: item }));
            if (form1.modified) {
              form1.setValuesIn('variableDefinitions', idList);
            }
          });
          onFieldValueChange('variableDefinitions.*.type', () => {
            // const value = (field as Field).value;
            // console.log(value, 'value');
            // const format = field.query('.format').take() as DataField;
            // console.log(field.query('.format'), field.query('.format').take(), 'values')
            // switch (format.value) {
            //   case 'date':
            //     break;
            //   case 'string':
            //     format.setComponent(Input);
            //     format.setDataSource([])
            //     break;
            //   case 'number':
            //     format.setComponent(Input);
            //     // format.setValue('%.xf');
            //     break;
            //   case 'file':
            //     format.setComponent(Select);
            //     format.setDataSource([
            //       {label: '视频', value: 'video'},
            //       {label: '图片', value: 'img'},
            //       {label: '全部', value: 'any'},
            //       {label: '', value: ''},
            //     ])
            //
            //     break;
            // }
          });
        },
      }),
    [id],
  );

  useEffect(() => {
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
      NumberPicker,
    },
  });

  const handleSave = async () => {
    const data: TemplateItem = await form.submit();

    // dingTalkRobotWebHook

    // 提交的时候处理内容
    // 钉钉机器人-->dingTalkRobotWebHook
    // r如果是text 的话。template.message=>template.text.content
    // 如果是markdown 的话。 template.message=>template.markdown.text
    // 如果是link的话。 template.message =>template.markdown.text
    if (data.provider === 'dingTalkRobotWebHook') {
      const type = data.template.messageType;
      // emplate.messageType
      switch (type) {
        case 'text':
          data.template.text = {
            content: data.template.message,
          };
          // data.template.text.content = data.template.message;
          break;
        case 'markdown':
          data.template.markdown.text = data.template.message;
          break;
        case 'link':
          data.template.link.text = data.template.message;
      }
    }

    const response: any = await service.save(data);

    if (response?.status === 200) {
      message.success('保存成功');
      history.back();
    }
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'name',
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
      type: {
        title: '类型',
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
        enum: typeList[id] || [],
      },
      configId: {
        title: '绑定配置',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: '测试配置1', value: 'test1' },
          { label: '测试配置2', value: 'test2' },
          { label: '测试配置3', value: 'test3' },
        ],
      },
      template: {
        type: 'object',
        properties: {
          weixin: {
            type: 'void',
            'x-visible': id === 'weixin',
            properties: {
              agentId: {
                title: 'AgentId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '请输入AgentID',
                },
                'x-component-props': {
                  placeholder: '请输入AgentID',
                },
              },
              toUser: {
                title: '收信人ID',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '请输入收信人ID',
                },
                'x-component-props': {
                  placeholder: '请输入收信人ID',
                },
              },
              toParty: {
                title: '收信部门ID',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '请输入收信部门ID',
                },
                'x-component-props': {
                  placeholder: '请输入收信部门ID',
                },
              },
              toTag: {
                title: '标签推送',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '标签推送',
                },
                'x-component-props': {
                  placeholder: '请输入标签推送，多个标签用,号分隔',
                },
              },
            },
          },
          dingTalk: {
            type: 'void',
            'x-visible': id === 'dingTalk',
            properties: {
              dingTalkMessage: {
                type: 'void',
                properties: {
                  agentId: {
                    title: 'AgentID',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入AgentID',
                    },
                    'x-component-props': {
                      placeholder: '请输入AgentID',
                    },
                  },
                  toAllUser: {
                    title: '通知全部用户',
                    type: 'boolean',
                    'x-component': 'Radio.Group',
                    'x-decorator': 'FormItem',
                    enum: [
                      { label: '是', value: true },
                      { label: '否', value: false },
                    ],
                  },
                  userIdList: {
                    title: '收信人ID',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入收信人ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入收信人ID',
                    },
                  },
                  departmentIdList: {
                    title: '收信部门ID',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入收信部门ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入AgentID',
                    },
                  },
                },
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="dingTalkMessage"}}',
                    },
                  },
                },
              },
              dingTalkRobotWebHook: {
                type: 'void',
                properties: {
                  messageType: {
                    title: '消息类型',
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    enum: [
                      { label: 'markdown', value: 'markdown' },
                      { label: 'text', value: 'text' },
                      { label: 'link', value: 'link' },
                    ],
                  },
                  markdown: {
                    type: 'object',
                    properties: {
                      title: {
                        title: '标题',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                      },
                    },
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
                        title: '标题',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                      },
                      '{url:picUrl}': {
                        title: '图片链接',
                        'x-component': 'FUpload',
                        'x-decorator': 'FormItem',
                        'x-component-props': {
                          type: 'file',
                        },
                      },
                      messageUrl: {
                        title: '内容链接',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                      },
                    },
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

            //           钉钉群机器人配置参数名	类型	说明
            //           messageType	String	钉钉-消息类型 markdown、text、link
            // ${messageType}	String	钉钉-内容
          },
          aliyun: {
            type: 'void',
            properties: {
              voice: {
                'x-visible': id === 'voice',
                type: 'void',
                properties: {
                  // ttsCode	String	语音-模版ID
                  // calledShowNumbers	String	语音-被叫显号
                  // CalledNumber	String	语音-被叫号码
                  // PlayTimes	String	语音-播放次数
                  ttsCode: {
                    title: '模版ID',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入模版ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入模版ID',
                    },
                  },
                  calledShowNumbers: {
                    title: '被叫号码',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入calledShowNumbers',
                    },
                    'x-component-props': {
                      placeholder: '请输入calledShowNumbers',
                    },
                  },
                  calledNumber: {
                    title: '被叫显号',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入CalledNumber',
                    },
                    'x-component-props': {
                      placeholder: '请输入CalledNumber',
                    },
                  },
                  PlayTimes: {
                    title: '播放次数',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入PlayTimes',
                    },
                    'x-component-props': {
                      placeholder: '请输入PlayTimes',
                    },
                  },
                },
              },
              sms: {
                'x-visible': id === 'sms',
                type: 'void',
                properties: {
                  code: {
                    title: '模版ID',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入模版ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入模版ID',
                    },
                  },
                  phoneNumber: {
                    title: '收信人',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入收信人',
                    },
                    'x-component-props': {
                      placeholder: '请输入收信人',
                    },
                  },
                  signName: {
                    title: '签名',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入签名',
                    },
                    'x-component-props': {
                      placeholder: '请输入签名',
                    },
                  },
                  // code	String	短信-模板ID
                  // signName	String	短信-签名
                  // phoneNumber	String	短信-收信人
                },
              },
            },
            // ttsCode	String	语音-模版ID
            // calledShowNumbers	String	语音-被叫显号
            // CalledNumber	String	语音-被叫号码
            // PlayTimes	String	语音-播放次数
          },
          email: {
            type: 'object',
            'x-visible': id === 'email',
            properties: {
              // subject	String	邮件-模板ID
              // sendTo	Array	邮件-收件人
              // sendTo	String	邮件-内容
              // attachments	String	邮件-附件信息

              subject: {
                title: '模版ID',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
        },
      },
      'template.message': {
        title: '模版内容',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          tooltip: '请输入模版内容',
        },
        'x-component-props': {
          rows: 5,
          placeholder: '变量格式:${name};\n 示例:尊敬的${name},${time}有设备触发告警,请注意处理',
        },
      },
      variableDefinitions: {
        type: 'array',
        title: '变量列表',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 9999 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '变量', width: '120px' },
              properties: {
                id: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'PreviewText.Input',
                  'x-disabled': true,
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '名称' },
              properties: {
                name: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '类型', width: '120px' },
              properties: {
                type: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  enum: [
                    { label: '时间', value: 'date' },
                    { label: '数字', value: 'number' },
                    { label: '字符串', value: 'string' },
                    { label: '文件', value: 'file' },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '格式' },
              properties: {
                format: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  enum: [
                    { label: 'String类型的UTC时间戳 (毫秒)', value: 'string' },
                    { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
                    { label: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
                    { label: 'yyyy-MM-dd HH:mm:ss EE', value: 'yyyy-MM-dd HH:mm:ss EE' },
                    { label: 'yyyy-MM-dd HH:mm:ss zzz', value: 'yyyy-MM-dd HH:mm:ss zzz' },
                  ],
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
      },
    },
  };
  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={10}>
            <Form className={styles.form} form={form} layout={'vertical'}>
              <SchemaField schema={schema} />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <Submit onSubmit={handleSave}>保存</Submit>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} push={2}>
            这里是放描述信息的
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
});
export default Detail;

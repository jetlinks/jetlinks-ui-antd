import {
  ArrayItems,
  ArrayTable,
  Editable,
  Form,
  FormButtonGroup,
  FormGrid,
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
import { createForm, onFieldInit, onFieldValueChange } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import styles from './index.less';
import { useEffect, useMemo, useState } from 'react';
import FUpload from '@/components/Upload';
import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, message, Row } from 'antd';
import { typeList } from '@/pages/notice';
import { configService, service, state } from '@/pages/notice/Template';
import FBraftEditor from '@/components/FBraftEditor';
import { useAsyncDataSource } from '@/utils/util';
import WeixinCorp from '@/pages/notice/Template/Detail/doc/WeixinCorp';
import WeixinApp from '@/pages/notice/Template/Detail/doc/WeixinApp';
import DingTalk from '@/pages/notice/Template/Detail/doc/DingTalk';
import DingTalkRebot from '@/pages/notice/Template/Detail/doc/DingTalkRebot';
import AliyunVoice from '@/pages/notice/Template/Detail/doc/AliyunVoice';
import AliyunSms from '@/pages/notice/Template/Detail/doc/AliyunSms';
import Email from '@/pages/notice/Template/Detail/doc/Email';

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
};

const Detail = observer(() => {
  const { id } = useParams<{ id: string }>();

  const getConfig = () =>
    configService
      .queryNoPagingPost({
        terms: [{ column: 'type$IN', value: id }],
      })
      .then((resp: any) => {
        return resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      });

  const getDingTalkDept = (configId: string) => service.dingTalk.getDepartments(configId);
  const getDingTalkDeptTree = (configId: string) => service.dingTalk.getDepartmentsTree(configId);
  const getDingTalkUser = (configId: string, departmentId: string) =>
    service.dingTalk.getUserByDepartment(configId, departmentId);

  const getWeixinDept = (configId: string) => service.weixin.getDepartments(configId);
  const getWeixinTags = (configId: string) => service.weixin.getTags(configId);
  const getWeixinUser = (configId: string) => service.weixin.getUserByDepartment(configId);

  const getAliyunSigns = (configId: string) => service.aliyun.getSigns(configId);
  const getAliyunTemplates = (configId: string) => service.aliyun.getTemplates(configId);

  const [provider, setProvider] = useState<string>();
  // 正则提取${}里面的值
  const pattern = /(?<=\$\{).*?(?=\})/g;
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldInit('template.message', (field, form1) => {
            if (id === 'email') {
              field.setComponent(FBraftEditor);
              // form1.setValuesIn('template.message', 'testtt')
            }
            console.log(form1);
            ///给FBraftEditor 设置初始值
          });
          onFieldValueChange('provider', (field) => {
            const value = field.value;
            setProvider(value);
          });
          onFieldValueChange('template.message', (field, form1) => {
            let value = (field as Field).value;
            if (id === 'email' && form1.modified) {
              value = value?.toHTML();
            }
            const idList = value
              ?.match(pattern)
              ?.filter((i: string) => i)
              .map((item: string) => ({ id: item, type: 'string', format: '--' }));
            if (form1.modified) {
              form1.setValuesIn('variableDefinitions', idList);
            }
          });
          onFieldValueChange('variableDefinitions.*.type', (field) => {
            const value = (field as Field).value;
            const format = field.query('.format').take() as any;
            switch (value) {
              case 'date':
                format.setComponent(Select);
                format.setDataSource([
                  { label: 'String类型的UTC时间戳 (毫秒)', value: 'string' },
                  { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
                  { label: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
                  { label: 'yyyy-MM-dd HH:mm:ss EE', value: 'yyyy-MM-dd HH:mm:ss EE' },
                  { label: 'yyyy-MM-dd HH:mm:ss zzz', value: 'yyyy-MM-dd HH:mm:ss zzz' },
                ]);
                format.setValue('string');
                break;
              case 'string':
                format.setComponent(PreviewText.Input);
                format.setValue('--');
                break;
              case 'number':
                format.setComponent(Input);
                format.setValue('%.xf');
                break;
              case 'file':
                format.setComponent(Select);
                format.setDataSource([
                  { label: '视频', value: 'video' },
                  { label: '图片', value: 'img' },
                  { label: '全部', value: 'any' },
                ]);
                format.setValue('any');
                break;
              case 'other':
                format.setComponent(PreviewText.Input);
                format.setValue('--');
                break;
            }
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
      Editable,
      PreviewText,
      Space,
      FUpload,
      NumberPicker,
      FBraftEditor,
      ArrayItems,
      FormGrid,
      ArrayTable,
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
    if (id === 'email') {
      data.provider = 'embedded';
      data.template.message = data.template.message.toHTML();
    }

    let response;
    if (data.id) {
      response = await service.update(data);
    } else {
      response = await service.save(data);
    }

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
        'x-hidden': id === 'email',
        enum: typeList[id] || [],
      },
      configId: {
        title: '绑定配置',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        // enum: [
        //   {label: '测试配置1', value: 'test1'},
        //   {label: '测试配置2', value: 'test2'},
        //   {label: '测试配置3', value: 'test3'},
        // ],
        'x-reactions': '{{useAsyncDataSource(getConfig)}}',
        'x-visible': id !== 'email',
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
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '请输入收信人ID',
                },
                'x-component-props': {
                  placeholder: '请输入收信人ID',
                  mode: 'tags',
                },
                'x-reactions': {
                  dependencies: ['configId'],
                  fulfill: {
                    run: '{{useAsyncDataSource(getWeixinUser($deps[0]))}}',
                  },
                },
              },
              toParty: {
                title: '收信部门ID',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '请输入收信部门ID',
                },
                'x-component-props': {
                  placeholder: '请输入收信部门ID',
                  mode: 'tags',
                },
                'x-reactions': {
                  dependencies: ['configId'],
                  fulfill: {
                    run: '{{useAsyncDataSource(getWeixinDept($deps[0]))}}',
                  },
                },
              },
              toTag: {
                title: '标签推送',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '标签推送',
                },
                'x-component-props': {
                  placeholder: '请输入标签推送，多个标签用,号分隔',
                  mode: 'tags',
                },
                'x-reactions': {
                  dependencies: ['configId'],
                  fulfill: {
                    run: '{{useAsyncDataSource(getWeixinTags($deps[0]))}}',
                  },
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
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入收信人ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入收信人ID',
                    },
                    'x-reactions': {
                      dependencies: ['configId'],
                      fulfill: {
                        run: '{{useAsyncDataSource(getDingTalkUser($deps[0]))}}',
                      },
                    },
                  },
                  departmentIdList: {
                    title: '收信部门ID',
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入收信部门ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入AgentID',
                    },
                    'x-reactions': {
                      dependencies: ['configId'],
                      fulfill: {
                        run: '{{useAsyncDataSource(getDingTalkDept($deps[0]))}}',
                      },
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
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入模版ID',
                    },
                    'x-component-props': {
                      placeholder: '请输入模版ID',
                    },
                    'x-reactions': {
                      dependencies: ['configId'],
                      fulfill: {
                        run: '{{useAsyncDataSource(getAliyunTemplates($deps[0]))}}',
                      },
                    },
                  },
                  phoneNumber: {
                    title: '收信人',
                    'x-component': 'Select',
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
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '请输入签名',
                    },
                    'x-component-props': {
                      placeholder: '请输入签名',
                    },
                    'x-reactions': {
                      dependencies: ['configId'],
                      fulfill: {
                        run: '{{useAsyncDataSource(getAliyunSigns($deps[0]))}}',
                      },
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
            type: 'void',
            'x-visible': id === 'email',
            properties: {
              // subject	String	邮件-模板ID
              // sendTo	Array	邮件-收件人
              // sendTo	String	邮件-内容
              // attachments	String	邮件-附件信息
              sendTo: {
                'x-component': 'Input.TextArea',
                'x-decorator': 'FormItem',
                title: '收件人',
                'x-decorator-props': {
                  tip: '请输入收件人邮箱,多个收件人用换行分隔',
                },
              },
              // message: {
              //   "x-component": 'FBraftEditor',
              //   "x-decorator": 'FormItem',
              //   title: '模版内容',
              //   "x-decorator-props": {
              //     tip: '请输入收件人邮箱,多个收件人用换行分隔'
              //   },
              // },
              attachments: {
                type: 'array',
                title: '附件信息',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems',
                'x-decorator-props': {
                  style: {
                    width: '100%',
                  },
                },
                items: {
                  type: 'object',

                  'x-component': 'FormGrid',
                  'x-component-props': {
                    maxColumns: 24,
                    minColumns: 24,
                  },

                  properties: {
                    file: {
                      'x-component': 'FUpload',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        style: {
                          width: '100%',
                        },
                        gridSpan: 23,
                      },
                      'x-component-props': {
                        type: 'file',
                        placeholder: '请上传文件',
                      },
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Remove',
                      'x-decorator-props': {
                        gridSpan: 1,
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayItems.Addition',
                    title: '添加附件',
                  },
                },
              },
              // subject: {
              //   title: '模版ID',
              //   'x-decorator': 'FormItem',
              //   'x-component': 'Input',
              // },
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
                  required: true,
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
                  required: true,
                  enum: [
                    { label: '字符串', value: 'string' },
                    { label: '时间', value: 'date' },
                    { label: '数字', value: 'number' },
                    { label: '文件', value: 'file' },
                    { label: '其他', value: 'other' },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '格式', width: '150px' },
              required: true,
              properties: {
                format: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
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
              <SchemaField
                schema={schema}
                scope={{
                  getConfig,
                  getDingTalkDept,
                  getDingTalkDeptTree,
                  getDingTalkUser,
                  getWeixinDept,
                  getWeixinTags,
                  getWeixinUser,
                  getAliyunSigns,
                  getAliyunTemplates,
                  useAsyncDataSource,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <Submit onSubmit={handleSave}>保存</Submit>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} push={2}>
            {docMap[id][provider]}
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
});
export default Detail;

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
  Switch,
} from '@formily/antd';
import type { Field } from '@formily/core';
import {
  createForm,
  FormPath,
  onFieldInit,
  onFieldReact,
  onFieldValueChange,
  registerValidateRules,
} from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import styles from './index.less';
import { useEffect, useMemo, useRef, useState } from 'react';
import FUpload from '@/components/Upload';
import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Tooltip } from 'antd';
import { typeList } from '@/pages/notice';
import { configService, service, state } from '@/pages/notice/Template';
import FBraftEditor from '@/components/FBraftEditor';
import { onlyMessage, phoneRegEx, useAsyncDataSource } from '@/utils/util';
import WeixinCorp from '@/pages/notice/Template/Detail/doc/WeixinCorp';
import WeixinApp from '@/pages/notice/Template/Detail/doc/WeixinApp';
import DingTalk from '@/pages/notice/Template/Detail/doc/DingTalk';
import DingTalkRebot from '@/pages/notice/Template/Detail/doc/DingTalkRebot';
import AliyunVoice from '@/pages/notice/Template/Detail/doc/AliyunVoice';
import AliyunSms from '@/pages/notice/Template/Detail/doc/AliyunSms';
import Email from '@/pages/notice/Template/Detail/doc/Email';
import { Store } from 'jetlinks-store';
import FAutoComplete from '@/components/FAutoComplete';
import { PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';
import FMonacoEditor from '@/components/FMonacoEditor';
import Webhook from './doc/Webhook';
import { useModel } from '@@/plugin-model/useModel';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
  const [provider, setProvider] = useState<string>('embedded');
  const { initialState } = useModel('@@initialState');
  // 正则提取${}里面的值
  const pattern = /(?<=\$\{).*?(?=\})/g;

  // 提取微信服务号里面的值 {{}}
  const weixinPattern = /(?<=\{\{).*?(?=\.DATA}})/g;

  const getConfig = (provider1: string) =>
    configService
      .queryNoPagingPost({
        terms: [
          { column: 'type$IN', value: id },
          { column: 'provider', value: provider1 },
        ],
      })
      .then((resp: any) => {
        return resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      });

  //需要复杂联动才可以完成
  const getWeixinDept = (configId: string) => service.weixin.getDepartments(configId);
  const getWeixinTags = (configId: string) => service.weixin.getTags(configId);
  const getWeixinUser = (configId: string) => service.weixin.getUser(configId);

  const getDingTalkDept = (configId: string) => service.dingTalk.getDepartments(configId);
  const getDingTalkDeptTree = (configId: string) => service.dingTalk.getDepartmentsTree(configId);
  const getDingTalkUser = (configId: string) => service.dingTalk.getUser(configId);

  const getWeixinOfficialTags = (configId: string) => service.weixin.getOfficialTags(configId);
  const getWeixinOfficialTemplates = (configId: string) =>
    service.weixin.getOfficialTemplates(configId);

  const getAliyunSigns = (configId: string) => service.aliyun.getSigns(configId);
  const getAliyunTemplates = (configId: string) => service.aliyun.getTemplates(configId);

  const variableDefinitionsRef =
    useRef<{ id: string; name: string; type: string; format: string }[]>();
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldInit('template.message', (field) => {
            if (id === 'email') {
              field.setComponent(FBraftEditor, {
                placeholder:
                  '变量格式:${name};\n 示例:尊敬的${name},${time}有设备触发告警,请注意处理',
                // height: '100px',
              });
            }
            const _provider = field.query('provider').value();
            if (_provider === 'corpMessage') {
              field.componentProps = {
                // disabled: true,
                rows: 5,
                placeholder:
                  '变量格式:${name};\n 示例:尊敬的${name},${time}有设备触发告警,请注意处理',
              };
            }
          });
          onFieldValueChange('provider', (field, form1) => {
            const value = field.value;
            setProvider(value);
            if (field.modified) {
              form1.setValuesIn('configId', null);
              form1.setValuesIn('template', null);
            }
            // 设置绑定配置的数据
            form1.setFieldState('configId', async (state1) => {
              state1.dataSource = await getConfig(value);
            });

            if (value === 'officialMessage') {
              form1.setFieldState('template.message', (state5) => {
                state5.decoratorProps = {
                  tooltip: '服务号模版消息内容',
                };
              });
            }
          });
          onFieldValueChange('configId', (field, form1) => {
            const value = field.value;
            // 判断provider
            if (!value) return;
            switch (form1.values.provider) {
              case 'corpMessage':
                form1.setFieldState('template.toUser', async (state8) => {
                  state8.dataSource = await getWeixinUser(value);
                });
                form1.setFieldState('template.toParty', async (state9) => {
                  state9.dataSource = await getWeixinDept(value);
                });
                form1.setFieldState('template.toTag', async (state10) => {
                  state10.dataSource = await getWeixinTags(value);
                });
                break;
              case 'officialMessage':
                form1.setFieldState('template.tagid', async (state1) => {
                  state1.dataSource = await getWeixinOfficialTags(value);
                });
                form1.setFieldState('template.wxTemplateId', async (state2) => {
                  const list = await getWeixinOfficialTemplates(value);
                  Store.set('wxTemplate', list);
                  state2.dataSource = list;
                });
                break;
              case 'dingTalkMessage':
                form1.setFieldState('template.userIdList', async (state3) => {
                  state3.dataSource = await getDingTalkUser(value);
                });
                form1.setFieldState('template.departmentIdList', async (state4) => {
                  const list = await getDingTalkDept(value);
                  Store.set('wxTemplate', list);
                  state4.dataSource = list;
                });
                break;
              case 'aliyun':
                // 阿里云语音
                form1.setFieldState('template.ttsCode', async (state5) => {
                  const list = await getAliyunTemplates(value);
                  Store.set('AliyunTemplate', list);
                  state5.dataSource = list;
                });
                break;
              case 'aliyunSms':
                // 阿里云短信
                form1.setFieldState('template.code', async (state6) => {
                  const list = await getAliyunTemplates(value);
                  Store.set('AliyunTemplate', list);
                  state6.dataSource = list;
                });

                form1.setFieldState('template.signName', async (state7) => {
                  // const list =
                  // Store.set('AliyunTemplate', list);
                  state7.dataSource = await getAliyunSigns(value);
                });

                break;
              default:
                break;
            }
          });
          onFieldValueChange('template.wxTemplateId', (field, form1) => {
            const value = field.value;
            // 处理消息模版。
            const template = Store.get('wxTemplate');
            const data = template?.find((i: { id: any }) => i.id === value);
            if (data) {
              form1.setFieldState('template.title', (state1) => {
                state1.value = data.title;
                state1.disabled = true;
              });
              form1.setFieldState('template.message', (state1) => {
                state1.value = data.content;
                state1.disabled = true;
              });
            }
          });
          onFieldValueChange('template.code', (field, form1) => {
            const value = field.value;
            const template = Store.get('AliyunTemplate');
            const data = template?.find((i: { templateCode: any }) => i.templateCode === value);
            if (data) {
              form1.setFieldState('template.message', (state1) => {
                state1.value = data.templateContent;
                state1.disabled = true;
              });
            }
          });
          onFieldValueChange('template.*(subject,markdown.title,link.title)', (field, form1) => {
            const value = (field as Field).value;
            const _message = field.query('template.message').value();

            const titleList =
              (typeof value === 'string' &&
                (value + _message)?.match(pattern)?.filter((i: string) => i)) ||
              // .map((item: string) => ({id: item, type: 'string', format: '--'}))) ||
              [];
            // 拼接message的内容

            form1.setFieldState('variableDefinitions', (state1) => {
              state1.visible = !!titleList && titleList.length > 0;
            });
            if (form1.modified) {
              const oldKey = variableDefinitionsRef.current?.map((i) => i.id);
              const newKey = [...new Set(titleList)];
              const _result = newKey.map((item) =>
                oldKey?.includes(item)
                  ? variableDefinitionsRef.current?.find((i) => i.id === item)
                  : {
                      id: item,
                      type: 'string',
                      format: '%s',
                    },
              );
              form1.setValuesIn('variableDefinitions', _result);
            }
          });
          onFieldValueChange('template.message', (field, form1) => {
            const _provider = field.query('provider').value();

            const value = (field as Field).value;
            const idList =
              (typeof value === 'string' &&
                value
                  ?.match(_provider === 'officialMessage' ? weixinPattern : pattern)
                  ?.filter((i: string) => i)) ||
              [];

            if (id === 'email') {
              const subject = field.query('template.subject');
              const title = subject.value();
              const titleList = title?.match(pattern)?.filter((i: string) => i);
              // .map((item: string) => ({id: item, type: 'string', format: '--'}));
              if (idList && titleList?.length > 0) {
                idList.unshift(...titleList);
              }
            }
            if (_provider === 'dingTalkRobotWebHook') {
              const title = field.query('template.markdown.title').value();
              const titleList = title?.match(pattern)?.filter((i: string) => i);
              // .map((item: string) => ({id: item, type: 'string', format: '--'}));
              if (idList && titleList?.length > 0) {
                idList.unshift(...titleList);
              }
            }
            form1.setFieldState('variableDefinitions', (state1) => {
              state1.visible = !!idList && idList.length > 0;
            });

            if (form1.modified) {
              // 获取缓存的KEY；
              const oldKey = variableDefinitionsRef.current?.map((i) => i.id);
              const newKey = [...new Set(idList)];
              const _result = newKey.map((item) =>
                oldKey?.includes(item)
                  ? variableDefinitionsRef.current?.find((i) => i.id === item)
                  : {
                      id: item,
                      type: 'string',
                      format: '%s',
                    },
              );
              form1.setValuesIn('variableDefinitions', _result);
            }
          });
          onFieldValueChange('variableDefinitions.*.*', (field) => {
            // 缓存编辑后的数据
            variableDefinitionsRef.current = field.query('variableDefinitions').value();
          });
          onFieldReact('variableDefinitions.*.type', (field) => {
            const value = (field as Field).value;
            const formatPath = FormPath.transform(
              field.path,
              /\d+/,
              (index) => `variableDefinitions.${parseInt(index)}.format`,
            );
            const format = field.query(formatPath).take() as any;

            const fieldModified = field && (field as Field).modified;
            if (!format) return;
            if (fieldModified) {
              format.setValue(undefined);
            }
            switch (value) {
              case 'date':
                format.setComponent(FAutoComplete);
                format.setDataSource([
                  { label: 'timestamp', value: 'timestamp' },
                  { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
                  { label: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
                  // { label: 'yyyy-MM-dd HH:mm:ss EE', value: 'yyyy-MM-dd HH:mm:ss EE' },
                  // { label: 'yyyy-MM-dd HH:mm:ss zzz', value: 'yyyy-MM-dd HH:mm:ss zzz' },
                ]);
                if (fieldModified) {
                  format.setValue('timestamp');
                }
                break;
              case 'string':
                format.setComponent(PreviewText.Input);
                if (fieldModified) {
                  format.setValue('%s');
                }
                break;
              case 'double':
                format.setComponent(Input);
                if (fieldModified) {
                  format.setValue('%.0f');
                }
                break;
              // case 'file':
              //   format.setComponent(Select);
              //   format.setDataSource([
              //     {label: '视频', value: 'video'},
              //     {label: '图片', value: 'img'},
              //     {label: '全部', value: 'any'},
              //   ]);
              //   format.setValue('any');
              //   break;
              // case 'other':
              //   format.setComponent(PreviewText.Input);
              //   format.setValue('--');
              //   break;
            }
          });
        },
      }),
    [id],
  );

  useEffect(() => {
    setTimeout(() => {
      if (initialState?.settings?.title) {
        document.title = `通知模板 - ${initialState?.settings?.title}`;
      } else {
        document.title = '通知模板';
      }
    }, 0);
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
      FAutoComplete,
      FMonacoEditor,
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

    // 微信服务号： template.message =>template.content
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
      data.template.text = data.template.message;
    }

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

  registerValidateRules({
    batchCheckEmail(value) {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      let error;
      if (value) {
        value.some((item: string) => {
          if (!regEmail.test(item)) {
            error = item;
            return true;
          }
          return false;
        });
      }
      return error ? `${error}邮件格式错误` : '';
    },
  });
  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入名称',
        },
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
          placeholder: '请选择类型',
        },
        required: true,
        'x-visible': typeList[id]?.length > 0,
        'x-hidden': id === 'email' || id === 'webhook',
        'x-value': typeList[id]?.[0]?.value,
        enum: typeList[id] || [],
      },
      configId: {
        title: '绑定配置',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择绑定配置',
        },
        required: true,
        'x-decorator-props': {
          tooltip: '使用固定的通知配置来发送此通知模版',
        },
        'x-visible': id !== 'email',
      },
      template: {
        type: 'object',
        properties: {
          weixin: {
            type: 'void',
            'x-visible': id === 'weixin',
            properties: {
              corpMessage: {
                type: 'void',
                properties: {
                  agentId: {
                    title: 'AgentId',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '应用唯一标识',
                    },
                    required: true,
                    'x-component-props': {
                      placeholder: '请输入AgentID',
                    },
                    'x-validator': [
                      {
                        max: 64,
                        message: '最多可输入64个字符',
                      },
                    ],
                  },
                  layout: {
                    type: 'void',
                    'x-decorator': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 2,
                      minColumns: 2,
                    },
                    properties: {
                      toUser: {
                        title: '收信人',
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          tooltip: '如果不填写该字段,将在使用此模版发送通知时进行指定。',
                          gridSpan: 1,
                        },
                        'x-component-props': {
                          placeholder: '请选择收信人',
                        },
                      },
                      toParty: {
                        title: '收信组织',
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        // 'x-decorator-props': {
                        //   tooltip: '如果不填写该字段,将在使用此模版发送通知时进行指定。',
                        //   gridSpan: 1,
                        // },
                        'x-component-props': {
                          placeholder: '请选择收信组织',
                        },
                      },
                    },
                  },
                  toTag: {
                    title: '标签推送',
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip:
                        '本企业微信的标签ID列表,最多支持100个,如果不填写该字段,将在使用此模版发送通知时进行指定',
                    },
                    'x-component-props': {
                      placeholder: '请选择标签推送，多个标签用,号分隔',
                    },
                  },
                },
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="corpMessage"}}',
                    },
                  },
                },
              },
              officialMessage: {
                type: 'void',
                properties: {
                  tagid: {
                    title: '用户标签',
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: '请选择用户标签',
                    },
                    'x-decorator-props': {
                      tooltip: '如果不填写该字段，将在使用此模板发送通知时进行指定',
                    },
                  },
                  layout: {
                    type: 'void',
                    'x-decorator': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 2,
                      minColumns: 2,
                    },
                    properties: {
                      wxTemplateId: {
                        title: '消息模版',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: '请选择消息模版',
                        },
                        required: true,
                        'x-decorator-props': {
                          gridSpan: 1,
                          tooltip: '微信公众号中配置的消息模版',
                        },
                      },
                      url: {
                        title: '模版跳转链接',
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: '请输入模版跳转链接',
                        },
                        'x-decorator-props': {
                          gridSpan: 1,
                          tooltip: '用于点击消息后进行页面跳转',
                        },
                      },
                    },
                  },
                  toMiniProgram: {
                    title: '跳转小程序',
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Radio.Group',
                    'x-component-props': {
                      // optionType: 'button'
                    },
                    'x-decorator-props': {
                      tooltip: '配置后点击通知消息将跳转到对应小程序',
                    },
                    default: false,
                    enum: [
                      { label: '是', value: true },
                      { label: '否', value: false },
                    ],
                  },
                  miniProgram: {
                    type: 'void',
                    properties: {
                      layout: {
                        type: 'void',
                        'x-decorator': 'FormGrid',
                        'x-decorator-props': {
                          maxColumns: 2,
                          minColumns: 2,
                        },
                        properties: {
                          miniProgramId: {
                            title: '跳转小程序AppId',
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-component-props': {
                              placeholder: '请输入跳转小程序AppId',
                            },
                            'x-decorator-props': {
                              gridSpan: 1,
                              tooltip: '小程序唯一性id',
                            },
                          },
                          miniProgramPath: {
                            title: '跳转小程序具体路径',
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-component-props': {
                              placeholder: '请输入跳转小程序具体路径',
                            },
                            'x-decorator-props': {
                              gridSpan: 1,
                              tooltip: '用于点击消息之后跳转到小程序的具体页面',
                            },
                          },
                        },
                      },
                    },
                    'x-reactions': {
                      dependencies: ['.toMiniProgram'],
                      fulfill: {
                        state: {
                          visible: '{{$deps[0]===true}}',
                        },
                      },
                    },
                  },
                  title: {
                    title: '模版标题',
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '这里是回显内容',
                    },
                    'x-decorator-props': {
                      tooltip: '服务号消息模版标题',
                    },
                    'x-disabled': true,
                    'x-validator': [
                      {
                        max: 64,
                        message: '最多可输入64个字符',
                      },
                    ],
                  },
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
                    required: true,
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '应用唯一标识',
                    },
                    'x-component-props': {
                      placeholder: '请输入AgentID',
                    },
                    'x-validator': [
                      {
                        max: 64,
                        message: '最多可输入64个字符',
                      },
                    ],
                  },
                  layout: {
                    type: 'void',
                    'x-decorator': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 2,
                      minColumns: 2,
                    },
                    properties: {
                      departmentIdList: {
                        title: '收信组织',
                        // required: true,
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        // 'x-decorator-props': {
                        //   tooltip: '如果不填写该字段，将在使用此模板发送通知时进行指定',
                        //   gridSpan: 1,
                        // },
                        'x-component-props': {
                          placeholder: '请选择收信组织',
                        },
                        // 'x-reactions': {
                        //   dependencies: ['configId'],
                        //   fulfill: {
                        //     run: '{{useAsyncDataSource(getDingTalkDept($deps[0]))}}',
                        //   },
                        // },
                      },
                      userIdList: {
                        title: '收信人',
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          tooltip: '如果不填写该字段，将在使用此模板发送通知时进行指定',
                          gridSpan: 1,
                        },
                        'x-component-props': {
                          placeholder: '请选择收信人',
                        },
                        // 'x-reactions': {
                        //   dependencies: ['configId'],
                        //   fulfill: {
                        //     run: '{{useAsyncDataSource(getDingTalkUser($deps[0]))}}',
                        //   },
                        // },
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
                    required: true,
                    'x-component-props': {
                      placeholder: '请选择消息类型',
                    },
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
                        required: true,
                        title: '标题',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                        'x-component-props': {
                          placeholder: '请输入标题',
                        },
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
                        required: true,
                        title: '标题',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                        'x-component-props': {
                          placeholder: '请输入标题',
                        },
                      },
                      '{url:picUrl}': {
                        title: '图片链接',
                        'x-component': 'FUpload',
                        'x-decorator': 'FormItem',
                        'x-component-props': {
                          type: 'file',
                          placeholder: '请输入图片链接',
                        },
                      },
                      messageUrl: {
                        title: '内容链接',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                        'x-component-props': {
                          placeholder: '请输入内容链接',
                        },
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
                  layout: {
                    type: 'void',
                    'x-decorator': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 2,
                      minColumns: 2,
                    },
                    properties: {
                      ttsCode: {
                        title: '模版ID',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          tooltip: '阿里云内部分配的唯一ID标识',
                          gridSpan: 1,
                        },
                        required: true,
                        'x-component-props': {
                          placeholder: '请输入模版ID',
                        },
                      },
                      calledNumber: {
                        title: '被叫号码',
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          tooltip: '仅支持中国大陆号码',
                          gridSpan: 1,
                        },
                        'x-component-props': {
                          placeholder: '请输入被叫号码',
                        },
                        'x-validator': [
                          {
                            max: 64,
                            message: '最多可输入64个字符',
                          },
                          {
                            validator: (value: string) => {
                              return new Promise((resolve) => {
                                if (!value) resolve('');
                                if (!phoneRegEx(value)) {
                                  resolve('请输入有效号码');
                                }
                                resolve('');
                              });
                            },
                          },
                        ],
                      },
                    },
                  },
                  calledShowNumbers: {
                    title: '被叫显号',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '必须是已购买的号码,用于呼叫号码显示',
                    },
                    'x-component-props': {
                      placeholder: '请输入被叫显号',
                    },
                    'x-validator': [
                      {
                        max: 64,
                        message: '最多可输入64个字符',
                      },
                      {
                        validator: (value: string) => {
                          return new Promise((resolve) => {
                            if (!value) resolve('');
                            if (!phoneRegEx(value)) {
                              resolve('请输入有效号码');
                            }
                            resolve('');
                          });
                        },
                      },
                    ],
                  },
                  PlayTimes: {
                    title: '播放次数',
                    'x-component': 'NumberPicker',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '语音文件的播放次数',
                    },
                    default: 1,
                    'x-validator': [
                      {
                        min: 1,
                        max: 3,
                        message: '仅支持1～3次',
                      },
                    ],
                    'x-component-props': {
                      placeholder: '请输入播放次数',
                    },
                  },
                },
              },
              sms: {
                'x-visible': id === 'sms',
                type: 'void',
                properties: {
                  layout: {
                    type: 'void',
                    'x-decorator': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 2,
                      minColumns: 2,
                    },
                    properties: {
                      code: {
                        title: '模版',
                        required: true,
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          tooltip: '阿里云短信平台自定义的模版名称',
                          gridSpan: 1,
                        },
                        'x-component-props': {
                          placeholder: '请选择模版',
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
                        'x-component': 'Input',
                        'x-decorator': 'FormItem',
                        'x-decorator-props': {
                          tooltip: '仅支持中国大陆号码',
                          gridSpan: 1,
                        },
                        'x-validator': ['phone'],
                        'x-component-props': {
                          placeholder: '请输入收信人',
                        },
                      },
                    },
                  },
                  signName: {
                    title: '签名',
                    required: true,
                    'x-component': 'Select',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      tooltip: '用于短信内容签名信息显示',
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
                },
              },
            },
          },
          email: {
            type: 'void',
            'x-visible': id === 'email',
            properties: {
              subject: {
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                title: '标题',
                'x-decorator-props': {
                  tooltip: '邮件标题',
                },
                required: true,
                'x-component-props': {
                  placeholder: '请输入标题',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                ],
              },
              sendTo: {
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                title: '收件人',
                'x-decorator-props': {
                  tooltip: '多个收件人用换行分隔 \n最大支持1000个号码',
                },
                'x-component-props': {
                  mode: 'tags',
                  placeholder: '请输入收件人邮箱,多个收件人用换行分隔',
                },
                'x-validator': {
                  batchCheckEmail: true,
                },
              },
              attachments: {
                type: 'array',
                title: '附件信息',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems',
                'x-decorator-props': {
                  style: {
                    width: '100%',
                  },
                  tooltip: '附件只输入文件名称将在发送邮件时进行文件上传',
                },
                items: {
                  type: 'object',
                  'x-decorator': 'FormGrid',
                  'x-decorator-props': {
                    maxColumns: 24,
                    minColumns: 24,
                  },
                  properties: {
                    '{url:location,name:name}': {
                      'x-component': 'FUpload',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        style: {
                          width: '100%',
                        },
                        gridSpan: 23,
                      },
                      required: true,
                      'x-component-props': {
                        type: 'file',
                        display: 'name',
                        placeholder: '请上传文件或输入文件名称',
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
            },
          },
          webhook: {
            type: 'void',
            'x-visible': id === 'webhook',
            properties: {
              contextAsBody: {
                title: '请求体',
                type: 'boolean',
                'x-component': 'Radio.Group',
                'x-decorator': 'FormItem',
                default: true,
                enum: [
                  { label: '默认', value: true },
                  { label: '自定义', value: false },
                ],
              },
              body: {
                'x-decorator': 'FormItem',
                'x-component': 'FMonacoEditor',
                required: true,
                'x-component-props': {
                  height: 250,
                  theme: 'vs',
                  language: 'json',
                  editorDidMount: (editor1: any) => {
                    editor1.onDidScrollChange?.(() => {
                      editor1.getAction('editor.action.formatDocument').run();
                    });
                  },
                },
                // 'x-decorator-props': {
                //   style: {
                //     zIndex: 9998,
                //   },
                // },
                'x-reactions': {
                  dependencies: ['.contextAsBody'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]===false}}',
                    },
                  },
                },
              },
              defaultBody: {
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
                'x-component-props': {
                  rows: 3,
                  placeholder: '请求体中的数据来自于发送通知时指定的所有变量',
                },
                'x-disabled': true,
                'x-reactions': {
                  dependencies: ['.contextAsBody'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]===true}}',
                    },
                  },
                },
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
          tooltip: '发送的内容，支持录入变量',
        },
        required: true,
        'x-reactions': {
          dependencies: ['provider'],
          fulfill: {
            state: {
              hidden: '{{$deps[0]==="aliyun"||$deps[0]==="http"}}',
              disabled: '{{["aliyunSms","aliyun"].includes($deps[0])}}',
            },
          },
        },
        'x-component-props': {
          rows: 5,
          placeholder: '变量格式:${name};\n 示例:尊敬的${name},${time}有设备触发告警,请注意处理',
        },
        'x-validator': [
          {
            max: 500,
            message: '最多可输入500个字符',
          },
        ],
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
        'x-decorator-props': {
          style: {
            zIndex: 999,
          },
        },
        'x-visible': false,
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
              'x-component-props': { title: '名称', width: '120px' },
              properties: {
                name: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  required: true,
                  'x-component': 'Input',
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
                    { label: '数字', value: 'double' },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '格式', width: '300px' },
              required: true,
              properties: {
                format: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-reactions': {
                    dependencies: ['.type'],
                    when: "{{$deps[0]!=='string'}}",
                    fulfill: {
                      schema: {
                        'x-component-props': {
                          suffix: (
                            <Tooltip title="格式为：%.xf   x代表数字保留的小数位数。当x=0时,代表格式为整数">
                              <QuestionCircleOutlined />
                            </Tooltip>
                          ),
                        },
                      },
                    },
                    otherwise: {
                      schema: {
                        'x-component-props.suffix': '',
                      },
                    },
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
        // 'x-decorator-props': {
        //   style: {
        //     zIndex: 998,
        //   },
        // },
      },
    },
  };
  const { permission } = usePermissions('notice');
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
                  getWeixinOfficialTags,
                  getWeixinOfficialTemplates,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <PermissionButton
                    type="primary"
                    isPermission={permission.add || permission.update}
                    onClick={handleSave}
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

import { PermissionButton } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row } from 'antd';
import styles from './index.less';
import {
  ArrayCollapse,
  Form,
  FormButtonGroup,
  FormItem,
  Input,
  Select,
  Radio,
  Checkbox,
  FormCollapse,
  FormGrid,
} from '@formily/antd';
import { useEffect, useState } from 'react';
import { createSchemaField } from '@formily/react';
import { createForm, Field, onFieldValueChange } from '@formily/core';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '../index';
import { PlusOutlined } from '@ant-design/icons';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import usePermissions from '@/hooks/permission';

const Save = () => {
  const { permission: rolePermission } = usePermissions('system/Role');
  const { permission } = PermissionButton.usePermission('system/Apply');
  const [view, setView] = useState<boolean>(false);

  const provider1 = require('/public/images/apply/provider1.png');
  const provider2 = require('/public/images/apply/provider2.png');
  const provider3 = require('/public/images/apply/provider3.png');
  const provider4 = require('/public/images/apply/provider4.png');
  const provider5 = require('/public/images/apply/provider5.png');

  const providerType = new Map();
  providerType.set('internal-standalone', provider1); //内部独立
  providerType.set('internal-integrated', provider2); //内部集成
  providerType.set('dingtalk-ent-app', provider3); //钉钉
  providerType.set('wechat-webapp', provider4); //微信
  providerType.set('third-party', provider5); //三方
  const formCollapse = FormCollapse.createFormCollapse!();

  //接入方式
  const integrationModesList = [
    {
      label: '页面集成',
      value: 'page',
    },
    {
      label: 'API客户端',
      value: 'apiClient',
    },
    {
      label: 'API服务',
      value: 'apiServer',
    },
    {
      label: '单点登陆',
      value: 'ssoClient',
    },
  ];

  const createImageLabel = (image: string, text: string) => {
    return (
      <div
        style={{ textAlign: 'center', marginTop: 10, fontSize: '14px', width: 115, height: 120 }}
      >
        <img height="64px" src={image} style={{ marginTop: 10 }} />
        <div
          style={{
            color: '#000000',
            marginTop: 5,
          }}
        >
          {text}
        </div>
      </div>
    );
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Radio,
      Checkbox,
      ArrayCollapse,
      FormCollapse,
      FormGrid,
    },
  });

  const getProvidersAll = () => {
    return service.getProvidersAll().then((res) => {
      if (res.status === 200) {
        return res.result.map((item: any) => ({
          label: createImageLabel(providerType.get(item.provider), item.name),
          value: item.provider,
        }));
      }
    });
  };
  const getRole = () => service.queryRoleList();

  const useAsyncData = (api: any) => (fields: Field) => {
    fields.loading = true;
    api(fields).then(
      action.bound!((resp: Response<any>) => {
        fields.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        fields.loading = false;
      }),
    );
  };

  const form = createForm({
    validateFirst: true,
    effects() {
      onFieldValueChange('provider', (field, form1) => {
        const value = field.value;
        switch (value) {
          case 'internal-standalone':
            form1.setFieldState('integrationModes', (f1) => {
              // field.hidden = false;
              f1.value = [];
            });
            break;
          case 'internal-integrated':
            form1.setFieldState('integrationModes', (f2) => {
              // field.hidden = true
              f2.value = ['page'];
            });
            break;
          case 'dingtalk-ent-app':
            form1.setFieldState('integrationModes', (f3) => {
              // field.hidden = true;
              f3.value = ['ssoClient'];
            });
            break;
          case 'wechat-webapp':
            form1.setFieldState('integrationModes', (f4) => {
              // field.hidden = true;
              f4.value = ['ssoClient'];
            });
            break;
          case 'third-party':
            form1.setFieldState('integrationModes', (f5) => {
              // field.hidden = false
              f5.value = [];
            });
            break;
          default:
            break;
        }
      });
      onFieldValueChange('integrationModes', (field) => {
        formCollapse.activeKeys = field.value;
        // const modes = ['page','apiClient','apiServer','ssoClient']
        // const items = modes.concat(field.value).filter(item=>!field.value.includes(item))
        // console.log(items)
      });
    },
  });

  const handleSave = async () => {
    const data = await form.submit();
    console.log(data);
  };

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入名称',
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
      provider: {
        title: '应用',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {
          optionType: 'button',
          placeholder: '请选择应用',
        },
        required: true,
        'x-reactions': '{{useAsyncDataSource(getProvidersAll)}}',
        'x-decorator-props': {
          gridSpan: 1,
        },
        default: 'internal-standalone',
        'x-validator': [
          {
            required: true,
            message: '请选择应用',
          },
        ],
      },
      integrationModes: {
        type: 'array',
        title: '接入方式',
        // 'x-hidden': true,
        enum: integrationModesList,
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox.Group',
        'x-validator': [
          {
            required: true,
            message: '请选择接入方式',
          },
        ],
      },
      config: {
        type: 'void',
        // 'x-hidden': true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 2,
        },
        'x-component': 'FormCollapse',

        'x-component-props': {
          formCollapse: '{{formCollapse}}',
        },
        properties: {
          apiServer: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: 'API服务',
            },
            // 'x-reactions':{
            //   dependencies: ['integrationModes'],
            //   fulfill: {
            //     state: {
            //       visible:
            //         '{{$self.value.includes($deps[0])}}',
            //     },
            //   },
            // },
            properties: {
              'apiServer.secureKey': {
                type: 'string',
                title: 'key',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'apiServer.roleIdList': {
                title: '角色',
                'x-decorator': 'FormItem',
                required: true,
                'x-component': 'Select',
                'x-component-props': {
                  mode: 'multiple',
                  showArrow: true,
                  placeholder: '请选择角色',
                  filterOption: (input: string, option: any) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                },
                'x-reactions': ['{{useAsyncData(getRole)}}'],
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                  addonAfter: (
                    <PermissionButton
                      type="link"
                      style={{ padding: 0 }}
                      isPermission={rolePermission.add}
                      onClick={() => {
                        console.log(rolePermission.add, permission.update);
                        const tab: any = window.open(`${origin}/#/system/role?save=true`);
                        tab!.onTabSaveSuccess = (value: any) => {
                          form.setFieldState('roleIdList', async (state) => {
                            state.dataSource = await getRole().then((resp) =>
                              resp.result?.map((item: Record<string, unknown>) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })),
                            );
                            state.value = [...(state.value || []), value.id];
                          });
                        };
                      }}
                    >
                      <PlusOutlined />
                    </PermissionButton>
                  ),
                },
              },
            },
          },
          apiClient: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: 'API客户端',
            },
            properties: {
              'apiClient.baseUrl': {
                type: 'string',
                title: '接口地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                  tooltip: '访问Api服务的地址',
                },
                required: true,
                'x-component': 'Input',
              },
              'apiClient.authConfig.oAuth2.authorizationUrl': {
                type: 'string',
                title: '授权地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'apiClient.authConfig.oAuth2.redirectUri': {
                type: 'string',
                title: '回调地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'apiClient.authConfig.oAuth2.clientId': {
                type: 'string',
                title: 'appId',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'apiClient.authConfig.oAuth2.clientSecret': {
                type: 'string',
                title: 'appKey',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
            },
          },
          page: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: '页面集成',
            },
            properties: {
              'page.baseUrl': {
                type: 'string',
                title: '接入地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                  tooltip: '访问可视化集成的地址',
                },
                required: true,
                'x-component': 'Input',
              },
              'page.routeType': {
                type: 'string',
                title: '路由方式',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Select',
                default: 'hash',
                enum: [
                  { label: 'hash', value: 'hash' },
                  { label: 'history', value: 'history' },
                ],
              },
            },
          },
          ssoClient: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: '单点登录',
            },
            properties: {
              'sso.configuration.oAuth2.authorizationUrl': {
                type: 'string',
                title: '授权地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'sso.configuration.oAuth2.redirectUri': {
                type: 'string',
                title: '回调地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'sso.configuration.oAuth2.clientId': {
                type: 'string',
                title: 'appId',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
              'sso.configuration.oAuth2.clientSecret': {
                type: 'string',
                title: 'appKey',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
              },
            },
          },
        },
      },
      description: {
        title: '说明',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        'x-component-props': {
          rows: 3,
          showCount: true,
          maxLength: 200,
          placeholder: '请输入说明',
        },
      },
    },
  };

  useEffect(() => {
    setView(false);
    // const { permission: rolePermission } = usePermissions('system/Role');
    console.log(rolePermission);
  }, []);
  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={14}>
            {/* <TitleComponent data={'基本信息'} /> */}
            <Form form={form} layout="vertical" className={styles.form}>
              <SchemaField
                schema={schema}
                scope={{
                  formCollapse,
                  useAsyncDataSource,
                  useAsyncData,
                  getProvidersAll,
                  getRole,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  {!view && (
                    <PermissionButton
                      type="primary"
                      isPermission={permission.add || permission.update}
                      onClick={() => handleSave()}
                    >
                      保存
                    </PermissionButton>
                  )}
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={10} className={styles.apply}>
            <div className={styles.doc}>文档</div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};
export default Save;

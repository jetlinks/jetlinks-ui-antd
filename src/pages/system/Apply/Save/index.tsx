import { PermissionButton } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, AutoComplete } from 'antd';
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
  Switch,
  TreeSelect,
  ArrayTable,
} from '@formily/antd';
import { TreeSelect as ATreeSelect } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { createSchemaField } from '@formily/react';
import { createForm, Field, onFieldReact, onFieldValueChange, onFormInit } from '@formily/core';
import { onlyMessage, randomString, useAsyncDataSource } from '@/utils/util';
import { service } from '../index';
import { PlusOutlined } from '@ant-design/icons';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import usePermissions from '@/hooks/permission';
import { useHistory, useLocation } from '@/hooks';
import { getMenuPathByCode } from '@/utils/menu';
import MenuPage from '../Menu';
import _ from 'lodash';
import { UploadImage } from '@/components';

const Save = () => {
  const location = useLocation();
  const history = useHistory();
  const { permission: rolePermission } = usePermissions('system/Role');
  const { permission: deptPermission } = usePermissions('system/Department');
  const { permission } = PermissionButton.usePermission('system/Apply');
  const [view, setView] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [visible, setVisiable] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const accessRef = useRef<any>([]);

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
      label: '单点登录',
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

  const providerList = [
    {
      label: createImageLabel(providerType.get('internal-standalone'), '内部独立应用'),
      value: 'internal-standalone',
    },
    {
      label: createImageLabel(providerType.get('internal-integrated'), '内部集成应用'),
      value: 'internal-integrated',
    },
    {
      label: createImageLabel(providerType.get('wechat-webapp'), '微信网站应用'),
      value: 'wechat-webapp',
    },
    {
      label: createImageLabel(providerType.get('dingtalk-ent-app'), '钉钉企业内部应用'),
      value: 'dingtalk-ent-app',
    },
    {
      label: createImageLabel(providerType.get('third-party'), '第三方应用'),
      value: 'third-party',
    },
  ];

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
      Switch,
      TreeSelect,
      ArrayTable,
      AutoComplete,
      UploadImage,
    },
  });

  // const getProvidersAll = () => {
  //   return service.getProvidersAll().then((res) => {
  //     if (res.status === 200) {
  //       return res.result.map((item: any) => ({
  //         label: createImageLabel(providerType.get(item.provider), item.name),
  //         value: item.provider,
  //       }));
  //     }
  //   });
  // };
  const getRole = () => service.queryRoleList();
  const getOrg = () => service.queryOrgList();

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
      onFormInit(async (formInit) => {
        if (!id) return;
        const resp = await service.detail(id);
        const integrationModes = resp.result.integrationModes.map((item: any) => item.value);
        // setAccess(integrationModes)
        accessRef.current = integrationModes;
        formInit.setInitialValues({
          ...resp.result,
          integrationModes,
          'apiServer.appId': id,
        });
      });
      onFieldValueChange('provider', (field, form1) => {
        const value = field.value;
        // console.log(value);
        if (field.modified) {
          switch (value) {
            case 'internal-standalone':
              form1.setFieldState('integrationModes', (f1) => {
                f1.value = [];
                f1.dataSource = integrationModesList;
              });
              break;
            case 'internal-integrated':
              form1.setFieldState('integrationModes', (f2) => {
                f2.value = [];
                f2.dataSource = integrationModesList?.filter(
                  (item) => item.value === 'apiClient' || item.value === 'page',
                );
              });
              break;
            case 'dingtalk-ent-app':
              form1.setFieldState('integrationModes', (f3) => {
                f3.value = ['ssoClient'];
                f3.dataSource = integrationModesList?.filter((item) => item.value === 'ssoClient');
              });
              break;
            case 'wechat-webapp':
              form1.setFieldState('integrationModes', (f4) => {
                f4.value = ['ssoClient'];
                f4.dataSource = integrationModesList?.filter((item) => item.value === 'ssoClient');
              });
              break;
            case 'third-party':
              form1.setFieldState('integrationModes', (f5) => {
                f5.value = [];
                f5.dataSource = integrationModesList;
              });
              break;
            default:
              break;
          }
        }
      });
      onFieldValueChange('integrationModes', (field, form2) => {
        const value = field.value;
        formCollapse.activeKeys = field.value;
        const modes = ['page', 'apiClient', 'apiServer', 'ssoClient'];
        const items = modes.concat(field.value).filter((item) => !value?.includes(item)); //未被选中
        // console.log(value);
        items.forEach((i) => {
          form2.setFieldState(`config.${i}`, (state) => {
            state.visible = false;
          });
        });
        field.value?.forEach((parms: any) => {
          form2.setFieldState(`config.${parms}`, (state) => {
            state.visible = true;
          });
        });
      });
      onFieldReact('apiClient.authConfig.oauth2.clientId', (field) => {
        if (id && accessRef.current?.includes('apiClient')) {
          field.componentProps = {
            disabled: true,
          };
        }
      });
      onFieldReact('apiServer.ipWhiteList', (field: any) => {
        const value = (field as Field).value;
        console.log(value);
        const pattern =
          /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
        if (value) {
          const str = value?.split(/[\n,]/g).filter((i: any) => i && i.trim());
          console.log(str);
          str.forEach((item: any) => {
            const ip = pattern.test(item);
            console.log(ip);
            if (!ip) {
              field.selfErrors = `[${item}]不是正确的IP地址`;
              return;
            } else {
              field.selfErrors = '';
            }
          });
        } else {
          field.selfErrors = '';
        }
      });
    },
  });

  const handleSave = async () => {
    const data: any = await form.submit();
    const list = integrationModesList.map((item) => item.value);
    _.difference(list, data.integrationModes).forEach((item) => {
      if (item === 'ssoClient') {
        delete data['sso'];
      }
      delete data[item];
    });

    //独立应用-api客户端 id?clientId:appId
    if (data.provider === 'internal-standalone') {
      if (data.integrationModes.includes('apiClient')) {
        data.id = data.apiClient.authConfig.oauth2.clientId;
      }
      if (
        data.integrationModes.includes('apiServer') &&
        !data.integrationModes.includes('apiClient')
      ) {
        data.id = data.apiServer.appId;
      }
    }
    //api客户端  accessTokenProperty grantType 默认参数
    // if(data.integrationModes.includes('apiClient')){
    //   data.apiClient.authConfig.grantType='authorization_code'
    //   data.apiClient.authConfig.accessTokenProperty='access_token'
    // }
    //独立应用，单点登录需要api配置和单点登录配置
    if (
      data.provider === 'internal-standalone' &&
      data.integrationModes.includes('ssoClient') &&
      data.integrationModes.length === 1
    ) {
      onlyMessage('配置单点登录需同时配置api配置', 'warning');
    } else {
      if (id) {
        const resp: any = await service.modify(id, data);
        if (resp.status === 200) {
          const isPage = data.integrationModes.includes('page');
          if (isPage) {
            setVisiable(true);
            setDetail(data);
          } else {
            onlyMessage('保存成功');
            const url = getMenuPathByCode('system/Apply');
            history.push(url);
          }
        }
      } else {
        const res: any = await service.save(data);
        if (res.status === 200) {
          const isPage = data.integrationModes.includes('page');
          if (isPage) {
            setVisiable(true);
            setDetail(data);
          } else {
            onlyMessage('保存成功');
            const url = getMenuPathByCode('system/Apply');
            history.push(url);
          }
        }
      }
    }
    // console.log(data);
  };

  //单点登录
  //独立应用
  const ssoStandalone = {
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
      'x-component-props': {
        placeholder: '请输入授权地址',
      },
      'x-reactions': {
        dependencies: ['integrationModes'],
        fulfill: {
          state: {
            visible: '{{$deps[0] && !$deps[0].includes("apiClient")}}',
          },
        },
      },
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
      // required: true,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入回调地址',
      },
      'x-reactions': {
        dependencies: ['integrationModes'],
        fulfill: {
          state: {
            visible: '{{$deps[0] && !$deps[0].includes("apiClient")}}',
          },
        },
      },
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
      'x-component-props': {
        placeholder: '请输入appId',
      },
      'x-reactions': {
        dependencies: ['integrationModes'],
        fulfill: {
          state: {
            visible: '{{$deps[0] && !$deps[0].includes("apiClient")}}',
          },
        },
      },
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
      'x-component-props': {
        placeholder: '请输入appKey',
      },
      'x-reactions': {
        dependencies: ['integrationModes'],
        fulfill: {
          state: {
            visible: '{{$deps[0] && !$deps[0].includes("apiClient")}}',
          },
        },
      },
    },
    'sso.autoCreateUser': {
      type: 'string',
      title: '自动创建用户',
      required: true,
      default: false,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Switch',
    },
  } as any;
  // 微信/钉钉
  const ssoConfig = {
    'sso.configuration.appKey': {
      type: 'string',
      title: 'appKey',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-reactions': {
        dependencies: ['provider'],
        fulfill: {
          state: {
            visible: '{{$deps[0]==="dingtalk-ent-app" }}',
          },
        },
      },
      required: true,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入appKey',
      },
    },
    'sso.configuration.appId': {
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
      'x-component-props': {
        placeholder: '请输入appId',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入appId',
        },
      ],
      'x-reactions': {
        dependencies: ['provider'],
        fulfill: {
          state: {
            visible: '{{$deps[0]==="wechat-webapp"}}',
          },
        },
      },
    },
    'sso.configuration.appSecret': {
      type: 'string',
      title: 'appSecret',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      required: true,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入appSecret',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入appSecret',
        },
      ],
    },
    'sso.autoCreateUser': {
      type: 'string',
      title: '自动创建用户',
      required: true,
      default: false,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Switch',
    },
  } as any;
  //第三方平台
  const ssoThird = {
    'sso.configuration.oauth2.type': {
      type: 'string',
      title: '认证方式',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择认证方式',
      },
      enum: [{ label: 'oauth2', value: 'oauth2' }],
    },
    'sso.configuration.oauth2.scope': {
      type: 'string',
      title: 'scope',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入scope',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入scope',
        },
      ],
    },
    'sso.configuration.oauth2.clientId': {
      type: 'string',
      title: 'client_id',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入client_id',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入client_id',
        },
      ],
    },
    'sso.configuration.oauth2.clientSecret': {
      type: 'string',
      title: 'client_secret',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入client_secret',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入client_secret',
        },
      ],
    },
    'sso.configuration.oauth2.authorizationUrl': {
      type: 'string',
      title: '授权地址',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入授权地址',
      },
    },
    'sso.configuration.oauth2.tokenUrl': {
      type: 'string',
      title: 'token地址',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入token地址',
      },
    },
    'sso.configuration.oauth2.logoUrl': {
      type: 'string',
      title: 'logo',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'UploadImage',
    },
    'sso.configuration.oauth2.userInfoUrl': {
      type: 'string',
      title: '用户信息地址',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入用户信息地址',
      },
    },
    'sso.configuration.oauth2.userProperty': {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          title: '用户ID',
          required: true,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 2,
            layout: 'vertical',
            labelAlign: 'left',
            tooltip: '通过jsonpath表达式从授权结果中获取第三方平台用户的唯一标识',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '输入从用户信息接口返回数据中的用户ID字段。示例:result.id',
          },
        },
        username: {
          type: 'string',
          title: '用户名',
          required: true,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 2,
            layout: 'vertical',
            labelAlign: 'left',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '输入从用户信息接口返回数据中的用户名字段。示例:result.name',
          },
        },
        avatar: {
          type: 'string',
          title: '头像',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 2,
            layout: 'vertical',
            labelAlign: 'left',
          },
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '输入从用户信息接口返回数据中的用户头像字段。示例:result.avatar',
          },
        },
      },
    },
    'sso.autoCreateUser': {
      type: 'string',
      title: '自动创建用户',
      required: true,
      default: false,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      'x-component': 'Switch',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  } as any;
  //内部独立应用-客户端
  const clientStandalone = {
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
      'x-component-props': {
        placeholder: '请输入接口地址',
      },
    },
    'apiClient.authConfig.type': {
      type: 'string',
      title: '认证方式',
      'x-hidden': true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      required: true,
      'x-component': 'Input',
      default: 'oauth2',
    },
    'apiClient.authConfig.oauth2.authorizationUrl': {
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
      'x-component-props': {
        placeholder: '请输入授权地址',
      },
    },
    'apiClient.authConfig.oauth2.redirectUri': {
      type: 'string',
      title: '回调地址',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 2,
        layout: 'vertical',
        labelAlign: 'left',
      },
      // required: true,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入回调地址',
      },
    },
    'apiClient.authConfig.oauth2.clientId': {
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
      'x-component-props': {
        placeholder: '请输入appId',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入appId',
        },
      ],
    },
    'apiClient.authConfig.oauth2.clientSecret': {
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
      'x-component-props': {
        placeholder: '请输入appKey',
      },
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入appKey',
        },
      ],
    },
  } as any;
  //第三方平台-客户端
  const clientThird = {
    apiClient: {
      type: 'object',
      properties: {
        baseUrl: {
          type: 'string',
          title: '接口地址',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 2,
            layout: 'vertical',
            labelAlign: 'left',
            tooltip: '访问第三方平台接口的地址',
          },
          required: true,
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入接口地址',
          },
        },
        authConfig: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              title: '认证方式',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 2,
                layout: 'vertical',
                labelAlign: 'left',
              },
              required: true,
              'x-component': 'Select',
              default: 'oauth2',
              enum: [
                { label: 'OAuth2', value: 'oauth2' },
                { label: '基本认证', value: 'basic' },
                { label: 'bearer认证', value: 'bearer' },
              ],
            },
            bearer: {
              type: 'object',
              'x-reactions': {
                dependencies: ['.type'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] ==="bearer"}}',
                  },
                },
              },
              properties: {
                token: {
                  type: 'string',
                  title: 'token',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    gridSpan: 2,
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  required: true,
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入token',
                  },
                },
              },
            },
            basic: {
              type: 'object',
              'x-reactions': {
                dependencies: ['.type'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] ==="basic"}}',
                  },
                },
              },
              properties: {
                username: {
                  type: 'string',
                  title: '用户名',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    gridSpan: 2,
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  required: true,
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入用户名',
                  },
                },
                password: {
                  type: 'string',
                  title: '密码',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    gridSpan: 2,
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  required: true,
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入密码',
                  },
                },
              },
            },
            oauth2: {
              type: 'object',
              'x-reactions': {
                dependencies: ['.type'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] ==="oauth2"}}',
                  },
                },
              },
              properties: {
                authorizationUrl: {
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
                tokenRequestType: {
                  type: 'string',
                  title: '请求方式',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    gridSpan: 2,
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  required: true,
                  'x-component': 'Select',
                  default: 'POST_BODY',
                  enum: [
                    { label: '请求体', value: 'POST_BODY' },
                    { label: '请求头', value: 'POST_URI' },
                  ],
                },
                // tokenRequest: {
                //   type: 'string',
                //   title: '请求类型',
                //   'x-decorator': 'FormItem',
                //   'x-decorator-props': {
                //     gridSpan: 2,
                //     layout: 'vertical',
                //     labelAlign: 'left',
                //   },
                //   required: true,
                //   'x-component': 'Select',
                //   default: 'POST_BODY',
                //   enum: [
                //     { label: '请求体', value: 'POST_BODY' },
                //     { label: '请求头', value: 'POST_URI' },
                //   ]
                // },
                clientId: {
                  type: 'string',
                  title: 'client_id',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    gridSpan: 2,
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  required: true,
                  'x-component': 'Input',
                },
                clientSecret: {
                  type: 'string',
                  title: 'client_secret',
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
      },
    },
  } as any;

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
        // 'x-reactions': '{{useAsyncDataSource(getProvidersAll)}}',
        'x-decorator-props': {
          gridSpan: 1,
        },
        default: 'internal-standalone',
        enum: providerList,
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
        'x-reactions': {
          dependencies: ['integrationModes'],
          fulfill: {
            state: {
              visible: '{{$deps[0] && $deps[0].length!==0}}',
            },
          },
        },
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
            properties: {
              'apiServer.appId': {
                type: 'string',
                title: 'appId',
                default: randomString(16),
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
                'x-component-props': {
                  disabled: true,
                },
                'x-reactions': {
                  dependencies: ['integrationModes'],
                  fulfill: {
                    state: {
                      visible: '{{!$deps[0].includes("apiClient")}}',
                    },
                  },
                },
              },
              'apiServer.secureKey': {
                type: 'string',
                title: 'secureKey',
                default: randomString(),
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                required: true,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入secureKey',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入secureKey',
                  },
                ],
              },
              'apiServer.redirectUri': {
                type: 'string',
                title: '回调地址',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                // required: true,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入回调地址',
                },
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] && $deps[0]!=="third-party"}}',
                    },
                  },
                },
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
                  tooltip: '为API用户分配角色',
                  addonAfter: (
                    <PermissionButton
                      type="link"
                      style={{ padding: 0 }}
                      isPermission={rolePermission.add}
                      onClick={() => {
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
              'apiServer.orgIdList': {
                title: '组织',
                'x-decorator': 'FormItem',
                'x-component': 'TreeSelect',
                'x-component-props': {
                  multiple: true,
                  showArrow: true,
                  placeholder: '请选择组织',
                  showCheckedStrategy: ATreeSelect.SHOW_ALL,
                  filterOption: (input: string, option: any) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  fieldNames: {
                    label: 'name',
                    value: 'id',
                  },
                  treeNodeFilterProp: 'name',
                },
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                  tooltip: '为API用户分组所属组织',
                  addonAfter: (
                    <PermissionButton
                      type="link"
                      style={{ padding: 0 }}
                      isPermission={deptPermission.add}
                      onClick={() => {
                        const tab: any = window.open(`${origin}/#/system/department?save=true`);
                        tab!.onTabSaveSuccess = (value: any) => {
                          form.setFieldState('orgIdList', async (state) => {
                            state.dataSource = await getOrg().then((resp) =>
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
                'x-reactions': ['{{useAsyncData(getOrg)}}'],
              },
              apiServerThird: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] && $deps[0]==="third-party"}}',
                    },
                  },
                },
                properties: {
                  'apiServer.redirectUri': {
                    type: 'string',
                    title: 'redirectUrl',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 2,
                      layout: 'vertical',
                      labelAlign: 'left',
                      tooltip: '授权后自动跳转的页面地址',
                    },
                    // required: true,
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '请输入redirectUrl',
                    },
                  },
                  'apiServer.ipWhiteList': {
                    type: 'string',
                    title: 'IP白名单',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 2,
                      layout: 'vertical',
                      labelAlign: 'left',
                    },
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      placeholder: '请输入IP白名单，多个地址回车分隔，不填默认均可访问',
                      rows: 3,
                    },
                  },
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
              standaloneConfig: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] && $deps[0]==="internal-standalone"}}',
                    },
                  },
                },
                properties: { ...clientStandalone },
              },
              thirdConfig: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="third-party"}}',
                    },
                  },
                },
                properties: { ...clientThird },
              },
              integratedConfig: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="internal-integrated"}}',
                    },
                  },
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
                    'x-component-props': {
                      placeholder: '请输入接口地址',
                    },
                  },
                },
              },

              'apiClient.headers': {
                type: 'array',
                default: [{}],
                title: '请求头',
                'x-decorator': 'FormItem',
                // required: true,
                'x-component': 'ArrayTable',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] && $deps[0]!=="internal-integrated"}}',
                    },
                  },
                },
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      // required: true,
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 100, title: 'key' },
                      properties: {
                        key: {
                          // required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 100, title: 'value' },
                      properties: {
                        value: {
                          // required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 30 },
                      properties: {
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayTable.Remove',
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    title: '添加请求头',
                  },
                },
              },
              'apiClient.parameters': {
                type: 'array',
                default: [{}],
                title: '参数',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] && $deps[0]!=="internal-integrated"}}',
                    },
                  },
                },
                'x-decorator': 'FormItem',
                // required: true,
                'x-component': 'ArrayTable',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      // required: true,
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 100, title: 'key' },
                      properties: {
                        key: {
                          // required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 100, title: 'value' },
                      properties: {
                        value: {
                          // required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 30 },
                      properties: {
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayTable.Remove',
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    title: '添加参数',
                  },
                },
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
                  tooltip: '填写访问其它平台的地址',
                },
                required: true,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入接入地址',
                },
              },
              'page.routeType': {
                type: 'string',
                title: '路由方式',
                'x-decorator': 'FormItem',
                // 'x-reactions': {
                //   dependencies: ['provider'],
                //   fulfill: {
                //     state: {
                //       visible: '{{$deps[0]==="internal-integrated"}}',
                //     },
                //   },
                // },
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
              'page.parameters': {
                type: 'array',
                default: [{}],
                title: '参数',
                'x-decorator': 'FormItem',
                required: true,
                'x-component': 'ArrayTable',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="third-party"}}',
                    },
                  },
                },
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                  tooltip: '自定义参数,格式${name}',
                },
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      // required: true,
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 100, title: 'KEY' },
                      properties: {
                        key: {
                          // required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 100, title: 'VALUE' },
                      properties: {
                        value: {
                          // required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'AutoComplete',
                          'x-component-props': {
                            options: [{ value: '用户ID' }, { value: '用户名' }, { value: 'token' }],
                          },
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 50 },
                      properties: {
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayTable.Remove',
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    title: '新增',
                  },
                },
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
              standaloneConfig: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] && $deps[0]==="internal-standalone"}}',
                    },
                  },
                },
                properties: { ...ssoStandalone },
              },
              ssoConfig: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="wechat-webapp" || $deps[0]==="dingtalk-ent-app"}}',
                    },
                  },
                },
                properties: { ...ssoConfig },
              },
              thirdConfig: {
                type: 'void',
                'x-reactions': {
                  dependencies: ['provider'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="third-party"}}',
                    },
                  },
                },
                properties: { ...ssoThird },
              },
              userConfig: {
                type: 'void',
                'x-decorator': 'FormGrid',
                'x-hidden': true,
                'x-decorator-props': {
                  maxColumns: 2,
                  minColumns: 2,
                  columnGap: 24,
                },
                'x-reactions': {
                  dependencies: ['sso.autoCreateUser'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]}}',
                    },
                  },
                },
                properties: {
                  'sso.usernamePrefix': {
                    type: 'string',
                    title: '用户名前缀',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 2,
                      layout: 'vertical',
                      labelAlign: 'left',
                    },
                    required: true,
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '请输入用户名前缀',
                    },
                  },
                  'sso.defaultPasswd': {
                    type: 'string',
                    title: '默认密码',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 2,
                      layout: 'vertical',
                      labelAlign: 'left',
                    },
                    required: true,
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '请输入默认密码',
                    },
                    'x-validator': [
                      {
                        max: 64,
                        message: '最多可输入64个字符',
                      },
                      {
                        required: true,
                        message: '请输入默认密码',
                      },
                    ],
                  },
                  'sso.roleIdList': {
                    title: '角色',
                    'x-decorator': 'FormItem',
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
                  'sso.orgIdList': {
                    title: '组织',
                    'x-decorator': 'FormItem',
                    'x-component': 'TreeSelect',
                    'x-component-props': {
                      multiple: true,
                      showArrow: true,
                      placeholder: '请选择组织',
                      showCheckedStrategy: ATreeSelect.SHOW_ALL,
                      filterOption: (input: string, option: any) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                      fieldNames: {
                        label: 'name',
                        value: 'id',
                      },
                      treeNodeFilterProp: 'name',
                    },
                    'x-decorator-props': {
                      gridSpan: 2,
                      layout: 'vertical',
                      labelAlign: 'left',
                      addonAfter: (
                        <PermissionButton
                          type="link"
                          style={{ padding: 0 }}
                          isPermission={deptPermission.add}
                          onClick={() => {
                            const tab: any = window.open(`${origin}/#/system/department?save=true`);
                            tab!.onTabSaveSuccess = (value: any) => {
                              form.setFieldState('orgIdList', async (state) => {
                                state.dataSource = await getOrg().then((resp) =>
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
                    'x-reactions': ['{{useAsyncData(getOrg)}}'],
                  },
                },
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
    const params = new URLSearchParams(location.search);
    const item = params.get('id');
    // console.log(id);
    if (item) {
      setId(item);
    }
    if (location && location.state) {
      setView(location.state.view);
    }
  }, [location]);
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
                  // getProvidersAll,
                  getRole,
                  getOrg,
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
            <div className={styles.doc}></div>
          </Col>
        </Row>
      </Card>
      {visible && (
        <MenuPage
          data={detail}
          close={() => {
            setVisiable(false);
          }}
        />
      )}
    </PageContainer>
  );
};
export default Save;

import { message, Modal } from 'antd';
import { useIntl } from 'umi';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormItem, Input, Password, Select, Switch } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { PlusOutlined } from '@ant-design/icons';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import { service } from '@/pages/system/User';

interface Props {
  model: 'add' | 'edit' | 'query';
  data: Partial<UserItem>;
  close: () => void;
}

const Save = (props: Props) => {
  const { model } = props;
  const intl = useIntl();

  const [data, setData] = useState<Partial<UserItem>>(props.data);

  const getRole = () => service.queryRoleList();

  const getOrg = () => service.queryOrgList();

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field).then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const getUser = async () => {
    if (props.data.id) {
      console.log('id');
      const response: Response<UserItem> = await service.queryDetail(props.data?.id);
      if (response.status === 200) {
        const temp = response.result as UserItem;
        temp.orgIdList = (temp.orgList as { id: string; name: string }[]).map((item) => item.id);
        temp.roleIdList = (temp.roleList as { id: string; name: string }[]).map((item) => item.id);
        setData(temp);
      }
    }
  };
  useEffect(() => {
    if (model === 'edit') {
      getUser();
    } else {
      setData({});
    }
  }, [props.data, props.model]);

  const form = createForm({
    validateFirst: true,
    initialValues: data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      Switch,
      Select,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: intl.formatMessage({
          id: 'pages.system.name',
          defaultMessage: '姓名',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'name',
        'x-validator': [
          {
            max: 50,
            message: '最多可输入50个字符',
          },
          {
            required: true,
            message: '请输入姓名',
          },
        ],
        // required: true,
      },
      username: {
        title: intl.formatMessage({
          id: 'pages.system.username',
          defaultMessage: '用户名',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          disabled: model === 'edit',
        },
        'x-validator': [
          {
            max: 50,
            message: '最多可输入50个字符',
          },
          {
            required: true,
            message: '请输入用户名',
          },
        ],
        name: 'username',
        required: true,
      },
      password: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.password',
          defaultMessage: '密码',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        'x-component-props': {
          checkStrength: true,
          placeholder: '********',
        },
        maxLength: 128,
        minLength: 6,
        'x-reactions': [
          {
            dependencies: ['.confirmPassword'],
            fulfill: {
              state: {
                selfErrors:
                  '{{$deps[0] && $self.value && $self.value !==$deps[0] ? "两次密码输入不一致" : ""}}',
              },
            },
          },
        ],
        name: 'password',
        'x-validator': [
          {
            max: 128,
            message: '密码最多可输入128位',
          },
          {
            min: 6,
            message: '密码不能少于6位',
          },
          {
            required: model === 'add',
            message: '请输入密码',
          },
        ],
      },
      confirmPassword: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.confirmPassword',
          defaultMessage: '确认密码？',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        'x-component-props': {
          checkStrength: true,
          placeholder: '********',
        },
        maxLength: 128,
        minLength: 6,
        'x-validator': [
          {
            max: 128,
            message: '密码最多可输入128位',
          },
          {
            min: 6,
            message: '密码不能少于6位',
          },
          {
            required: model === 'add',
            message: '请输入确认密码',
          },
        ],
        'x-reactions': [
          {
            dependencies: ['.password'],
            fulfill: {
              state: {
                selfErrors:
                  '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "两次密码输入不一致" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'confirmPassword',
      },
      roleIdList: {
        title: '角色',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          mode: 'multiple',
        },
        'x-reactions': ['{{useAsyncDataSource(getRole)}}'],
        'x-decorator-props': {
          addonAfter: (
            <a
              onClick={() => {
                const tab: any = window.open(`${origin}/#/system/role?save=true`);
                tab!.onTabSaveSuccess = (value: any) => {
                  form.setFieldState('roleIdList', (state) => {
                    state.dataSource = state.dataSource?.concat([
                      { label: value.name, value: value.id },
                    ]);
                  });
                };
              }}
            >
              <PlusOutlined />
            </a>
          ),
        },
      },
      orgIdList: {
        title: '部门',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          mode: 'multiple',
          showArrow: true,
        },
        'x-decorator-props': {
          addonAfter: (
            <a
              onClick={() => {
                const tab: any = window.open(`${origin}/#/system/department?save=true`);
                tab!.onTabSaveSuccess = (value: any) => {
                  form.setFieldState('orgIdList', (state) => {
                    console.log(value, 'value');
                    state.dataSource = state.dataSource?.concat([
                      { label: value.name, value: value.id },
                    ]);
                  });
                };
              }}
            >
              <PlusOutlined />
            </a>
          ),
        },
        'x-reactions': ['{{useAsyncDataSource(getOrg)}}'],
      },
    },
  };

  const save = async () => {
    const value = await form.submit<UserItem>();
    const temp: any = {};
    temp.id = value.id;
    temp.user = value;
    temp.orgIdList = value.orgIdList;
    temp.roleIdList = value.roleIdList;
    const response = await service.saveUser(temp, model);
    if (response.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功',
        }),
      );
      props.close();
    } else {
      message.error('操作失败！');
    }
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.${model}`,
        defaultMessage: '编辑',
      })}
      maskClosable={false}
      visible={model !== 'query'}
      onCancel={props.close}
      onOk={save}
      width="30vw"
    >
      <Form form={form} labelCol={4} wrapperCol={18}>
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getRole, getOrg }} />
      </Form>
    </Modal>
  );
};
export default Save;

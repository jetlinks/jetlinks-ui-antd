import { message, TreeSelect as ATreeSelect } from 'antd';
import { useIntl } from 'umi';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  FormGrid,
  FormItem,
  Input,
  Password,
  Select,
  Switch,
  TreeSelect,
} from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import { service } from '@/pages/system/User';
import { Modal, PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';

interface Props {
  model: 'add' | 'edit' | 'query';
  data: Partial<UserItem>;
  close: () => void;
}

const Save = (props: Props) => {
  const { model } = props;
  const intl = useIntl();

  const { permission: deptPermission } = usePermissions('system/Department');
  const { permission: rolePermission } = usePermissions('system/Role');

  const [data, setData] = useState<Partial<UserItem>>(props.data);

  const getRole = () => service.queryRoleList();

  const getOrg = () => service.queryOrgList();

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field).then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const getUser = async () => {
    if (props.data.id) {
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
      TreeSelect,
      FormGrid,
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
      layout: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          name: {
            title: intl.formatMessage({
              id: 'pages.system.name',
              defaultMessage: '姓名',
            }),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入姓名',
            },
            name: 'name',
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
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
            'x-decorator-props': {
              gridSpan: 1,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              disabled: model === 'edit',
              placeholder: '请输入用户名',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入用户名',
              },
              {
                triggerType: 'onBlur',
                validator: (value: string) => {
                  return new Promise((resolve) => {
                    service
                      .validateField('username', value)
                      .then((resp) => {
                        if (resp.status === 200) {
                          if (resp.result.passed) {
                            resolve('');
                          } else {
                            resolve(model === 'edit' ? '' : resp.result.reason);
                          }
                        }
                        resolve('');
                      })
                      .catch(() => {
                        return '验证失败!';
                      });
                  });
                },
              },
            ],
            name: 'username',
            required: true,
          },
        },
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
          placeholder: '请输入密码',
        },
        'x-visible': model === 'add',
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
          // {
          //   max: 128,
          //   message: '密码最多可输入128位',
          // },
          // {
          //   min: 8,
          //   message: '密码不能少于8位',
          // },
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
          placeholder: '请再次输入密码',
        },
        'x-visible': model === 'add',
        'x-validator': [
          // {
          //   max: 128,
          //   message: '密码最多可输入128位',
          // },
          // {
          //   min: 8,
          //   message: '密码不能少于6位',
          // },
          {
            required: model === 'add',
            message: '请输入确认密码',
          },
          {
            triggerType: 'onBlur',
            validator: (value: string) => {
              return new Promise((resolve) => {
                service
                  .validateField('password', value)
                  .then((resp) => {
                    if (resp.status === 200) {
                      if (resp.result.passed) {
                        resolve('');
                      } else {
                        resolve(model === 'edit' ? '' : resp.result.reason);
                      }
                    }
                    resolve('');
                  })
                  .catch(() => {
                    return '验证失败!';
                  });
              });
            },
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
      layout2: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          roleIdList: {
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
            'x-reactions': ['{{useAsyncDataSource(getRole)}}'],
            'x-decorator-props': {
              gridSpan: 1,
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
          orgIdList: {
            title: '部门',
            'x-decorator': 'FormItem',
            'x-component': 'TreeSelect',
            'x-component-props': {
              multiple: true,
              showArrow: true,
              placeholder: '请选择角色',
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
              gridSpan: 1,
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
            'x-reactions': ['{{useAsyncDataSource(getOrg)}}'],
          },
          telephone: {
            title: '手机号',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': 'phone',
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
          email: {
            title: '邮箱',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': 'email',
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
        },
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
      width="35vw"
      permissionCode={'system/User'}
      permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getRole, getOrg }} />
      </Form>
    </Modal>
  );
};
export default Save;

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
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
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
        'x-decorator-props': {},
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
        required: model === 'add',
        'x-reactions': [
          {
            dependencies: ['.confirmPassword'],
            fulfill: {
              state: {
                selfErrors:
                  '{{$deps[0] && $self.value && $self.value !==$deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'password',
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
        'x-reactions': [
          {
            dependencies: ['.password'],
            fulfill: {
              state: {
                selfErrors:
                  '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'confirmPassword',
        required: model === 'add',
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
              // href={`${origin}/#/system/role`}
              // target='_blank'
              // rel='noreferrer'
              onClick={() => {
                // const test = window.open(`${origin}/#/system/role`);
                // test!.onSuccess1 = (data: any) => {
                //   form.setFieldState('role', state => {
                //     state.dataSource = [...testEnum, { label: '测试数据A', value: 'testA' }];
                //   });
                // console.log(JSON.stringify(data));
                // testEnum.push({label:'测试数据A',value:'testA'});
                // setTestEnum([...testEnum, { label: '测试数据A', value: 'testA' }]);
                // };
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
            <a>
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
    } else {
      message.error('操作失败！');
    }
    props.close();
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
    >
      <Form form={form} labelCol={4} wrapperCol={18}>
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getRole, getOrg }} />
      </Form>
    </Modal>
  );
};
export default Save;

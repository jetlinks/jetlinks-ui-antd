import { message, Modal } from 'antd';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Password } from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { useIntl } from 'umi';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import { service } from '@/pages/system/User';

interface Props {
  visible: boolean;
  close: Function;
  data: Partial<UserItem>;
}

const ResetPassword = (props: Props) => {
  const intl = useIntl();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Password,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
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
        required: true,
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
            min: 8,
            message: '密码不能少于6位',
          },
          {
            required: true,
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
        'x-validator': [
          {
            max: 128,
            message: '密码最多可输入128位',
          },
          {
            min: 8,
            message: '密码不能少于8位',
          },
          {
            required: true,
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
    },
  };

  const form = useMemo(() => createForm({}), [props.visible]);
  return (
    <Modal
      title="重置密码"
      visible={props.visible}
      onCancel={() => props.close()}
      onOk={async () => {
        const value: { password: string; confirmPassword: string } = await form.submit();
        if (props.data.id) {
          const resp = await service.resetPassword(props.data.id, value.confirmPassword);
          if (resp.status === 200) {
            message.success('操作成功');
            props.close();
          }
        }
        props.close();
      }}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default ResetPassword;

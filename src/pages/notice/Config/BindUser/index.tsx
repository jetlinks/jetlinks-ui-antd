import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Select, FormItem, Form } from '@formily/antd';
import { message, Modal } from 'antd';
import { service, state } from '..';
import { useEffect, useState } from 'react';

interface Props {
  close: () => void;
  data: any;
  id: string;
  reload: () => void;
}

const BindUser = (props: Props) => {
  const form = createForm({
    validateFirst: true,
    initialValues: { user: props.data?.userId || '' },
  });
  const [list, setList] = useState<any[]>([]);

  const getUsers = async (id: string) => {
    const resp = await service.syncUser.noBindUser({
      pagign: false,
      terms: [
        {
          column: `id$user-third${state.current?.type}_${state.current?.provider}$not`,
          value: id,
        },
      ],
    });
    const data = resp.result?.map((item: Record<string, unknown>) => ({
      label: item.name,
      value: item.id,
    }));
    setList(data);
  };

  useEffect(() => {
    if (props.data?.id) {
      getUsers(props.data.id);
    }
  }, [props.data]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Select,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      user: {
        type: 'string',
        title: '用户',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择用户',
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        enum: [...list],
        'x-validator': [
          {
            required: true,
            message: '请选择用户',
          },
        ],
      },
    },
  };

  return (
    <Modal
      title="绑定用户 "
      onCancel={() => {
        props.close();
      }}
      visible
      width={500}
      onOk={async () => {
        const values: any = (await form.submit()) as any;
        const resp = await service.syncUser.bindUser(
          props.id,
          state.current?.provider || '',
          state.current?.id || '',
          [
            {
              userId: values.user,
              providerName: props.data?.name,
              thirdPartyUserId: props.data?.id,
            },
          ],
        );
        if (resp.status === 200) {
          message.success('操作成功！');
          props.reload();
        }
      }}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default BindUser;

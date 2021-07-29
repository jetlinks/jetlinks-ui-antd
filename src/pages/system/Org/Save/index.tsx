import { Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import { Form, Input, FormItem } from '@formily/antd';
import React from 'react';
import type { ObsModel } from '@/pages/system/Org/typings';

interface Props {
  obs: ObsModel;
}

const Save: React.FC<Props> = observer((props) => {
  const { obs } = props;
  const form = createForm({});

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      code: {
        title: '编码',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'id',
        required: true,
      },
      name: {
        title: '名称',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
      },
      sort: {
        title: '名称',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
      },
      describe: {
        title: '描述',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'describe',
      },
    },
  };

  return (
    <Modal title="编辑" visible={obs.edit} onCancel={obs.closeEdit}>
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
});
export default Save;

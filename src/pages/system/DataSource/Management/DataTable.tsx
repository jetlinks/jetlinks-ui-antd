import { Form, FormGrid, FormItem, Input, Password, Select } from '@formily/antd';
import { createForm, registerValidateRules } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';

interface Props {
  close: () => void;
  save: (data: any) => void;
  data: any;
}

const DataTable = (props: Props) => {
  const form = createForm({
    validateFirst: true,
    initialValues: props.data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      Select,
      FormGrid,
    },
  });

  registerValidateRules({
    validateId(value) {
      if (!value) return '';
      const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
      return reg.exec(value) ? '' : 'ID只能由数字、字母、下划线、中划线组成';
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
        'x-decorator-props': {
          gridSpan: 1,
        },
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
          {
            validateId: true,
          },
          {
            validator: (value: any) => {
              return new Promise((resolve) => {
                if (value) {
                  const first = value.slice(0, 1);
                  if (typeof Number(first) === 'number' && !isNaN(Number(first))) {
                    resolve('不能以数字开头');
                  } else {
                    resolve('');
                  }
                }
              });
            },
          },
        ],
        required: true,
      },
    },
  };

  const handleSave = async () => {
    const data: any = await form.submit();
    props.save(data);
  };

  return (
    <Modal
      title={`${props.data?.name ? '编辑' : '新增'}`}
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        handleSave();
      }}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default DataTable;

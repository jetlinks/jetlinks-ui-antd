import { Form, FormGrid, FormItem, Input, NumberPicker, Password, Radio } from '@formily/antd';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';

interface Props {
  close: () => void;
  reload: (data: any) => void;
  data: Partial<DataSourceItem>;
}

const DataRow = (props: Props) => {
  const form = createForm({
    validateFirst: true,
    initialValues: props.data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      FormGrid,
      NumberPicker,
      Radio,
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
            title: '列名',
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
            ],
            required: true,
          },
          type: {
            title: '类型',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入类型',
            },
            name: 'typeId',
            'x-validator': [
              {
                required: true,
                message: '请输入类型',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            required: true,
          },
          length: {
            title: '长度',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入长度',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入长度',
              },
              {
                maximum: 99999,
                minimum: 1,
              },
            ],
            required: true,
          },
          scale: {
            title: '精度',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入精度',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入精度',
              },
              {
                maximum: 99999,
                minimum: 1,
              },
            ],
            required: true,
          },
          notnull: {
            title: '不能为空',
            type: 'boolean',
            default: false,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
              placeholder: '请选择是否不能为空',
              optionType: 'button',
              buttonStyle: 'solid',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-validator': [
              {
                required: true,
                message: '请选择是否不能为空',
              },
            ],
            required: true,
            enum: [
              {
                label: '是',
                value: true,
              },
              {
                label: '否',
                value: false,
              },
            ],
          },
          description: {
            title: '说明',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              rows: 3,
              showCount: true,
              maxLength: 200,
              placeholder: '请输入说明',
            },
          },
        },
      },
    },
  };

  const handleSave = async () => {
    const data: any = await form.submit();
    props.reload(data);
  };

  return (
    <Modal
      width={'55vw'}
      title={`${props.data?.id ? '编辑' : '新增'}列`}
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

export default DataRow;

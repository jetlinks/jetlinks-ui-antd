import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { Form, FormGrid, FormItem, Input, Password, PreviewText } from '@formily/antd';
import { Modal } from 'antd';

const componentMap = {
  string: 'Input',
  password: 'Password',
};

interface Props {
  close: () => void;
  metadata: any;
  ok: (data: any) => void;
}

const ManualInspection = (props: Props) => {
  const { metadata } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      FormGrid,
      PreviewText,
    },
  });

  const configToSchema = (data: any[]) => {
    const config = {};
    data.forEach((item) => {
      config[item.property] = {
        type: 'string',
        title: item.name,
        require: true,
        'x-decorator': 'FormItem',
        'x-component': componentMap[item.type.type],
        'x-decorator-props': {
          tooltip: item.description,
        },
        'x-component-props': {
          value: '',
        },
      };
    });
    return config;
  };

  const renderConfigCard = () => {
    const itemSchema: ISchema = {
      type: 'object',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            minColumns: [1],
            maxColumns: [1],
          },
          properties: configToSchema(metadata?.data?.properties),
        },
      },
    };

    return (
      <>
        <PreviewText.Placeholder value="-">
          <Form form={form} layout="vertical">
            <SchemaField schema={itemSchema} />
          </Form>
        </PreviewText.Placeholder>
      </>
    );
  };
  return (
    <Modal
      title="人工检查"
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        const values = (await form.submit()) as any;
        if (metadata?.check) {
          props.ok({
            status: 'error',
            data: metadata,
          });
        } else {
          let flag = true;
          Object.keys(values).forEach((key) => {
            if (values[key] !== metadata?.check[key]) {
              flag = false;
            }
          });
          if (flag) {
            props.ok({
              status: 'success',
              data: metadata,
            });
          } else {
            props.ok({
              status: 'error',
              data: metadata,
            });
          }
        }
      }}
      visible
    >
      {renderConfigCard()}
    </Modal>
  );
};

export default ManualInspection;

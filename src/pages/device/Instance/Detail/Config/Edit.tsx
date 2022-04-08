import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { InstanceModel, service } from '@/pages/device/Instance';
import type { ISchema } from '@formily/json-schema';
import { Form, FormGrid, FormItem, Input, Password, PreviewText } from '@formily/antd';
import { Button, Drawer, message, Space } from 'antd';
import { useParams } from 'umi';

const componentMap = {
  string: 'Input',
  password: 'Password',
};

interface Props {
  close: () => void;
  metadata: any[];
}

const Edit = (props: Props) => {
  const { metadata } = props;
  const params = useParams<{ id: string }>();
  const id = InstanceModel.detail?.id || params?.id;

  const form = createForm({
    validateFirst: true,
    initialValues: InstanceModel.detail?.configuration,
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
        'x-decorator': 'FormItem',
        'x-component': componentMap[item.type.type],
        'x-decorator-props': {
          tooltip: item.description,
        },
      };
    });
    return config;
  };

  const renderConfigCard = () => {
    return metadata?.map((item: any) => {
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
            properties: configToSchema(item.properties),
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
    });
  };
  return (
    <Drawer
      title="编辑配置"
      placement="right"
      onClose={() => {
        props.close();
      }}
      visible
      extra={
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              const values = (await form.submit()) as any;
              const resp = await service.modify(id || '', {
                id,
                configuration: { ...values },
              });
              if (resp.status === 200) {
                message.success('操作成功！');
                props.close();
              }
            }}
          >
            保存
          </Button>
        </Space>
      }
    >
      {renderConfigCard()}
    </Drawer>
  );
};

export default Edit;

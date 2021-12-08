import { Card, Divider, Empty } from 'antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import { createSchemaField } from '@formily/react';
import type { ConfigMetadata, ConfigProperty } from '@/pages/device/Product/typings';
import type { ISchema } from '@formily/json-schema';
import { Form, FormGrid, FormItem, FormLayout, Input, Password, PreviewText } from '@formily/antd';
import { createForm } from '@formily/core';
import { history, useParams } from 'umi';
import Tags from '@/pages/device/Instance/Detail/Config/Tags';

const componentMap = {
  string: 'Input',
  password: 'Password',
};

const Config = () => {
  const params = useParams<{ id: string }>();
  useEffect(() => {
    const id = InstanceModel.current?.id || params.id;
    if (id) {
      service.getConfigMetadata(id).then((response) => {
        InstanceModel.config = response?.result;
      });
    } else {
      history.goBack();
    }
  }, []);

  const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);
  const [state, setState] = useState<boolean>(false);

  const form = createForm({
    validateFirst: true,
    readPretty: state,
    initialValues: InstanceModel.detail?.configuration,
  });

  const id = InstanceModel.current?.id;

  useEffect(() => {
    if (id) {
      service.getConfigMetadata(id).then((config) => {
        setMetadata(config?.result);
      });
    }

    return () => {};
  }, [id]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      FormGrid,
      PreviewText,
    },
  });

  const configToSchema = (data: ConfigProperty[]) => {
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
    return metadata ? (
      metadata?.map((item) => {
        const itemSchema: ISchema = {
          type: 'object',
          properties: {
            grid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                minColumns: [2],
                maxColumns: [2],
              },
              properties: configToSchema(item.properties),
            },
          },
        };

        return (
          <Card
            title={item.name}
            extra={<a onClick={() => setState(!state)}>{state ? '编辑' : '保存'}</a>}
          >
            <PreviewText.Placeholder value="-">
              <Form form={form}>
                <FormLayout labelCol={6} wrapperCol={16}>
                  <SchemaField schema={itemSchema} />
                </FormLayout>
              </Form>
            </PreviewText.Placeholder>
          </Card>
        );
      })
    ) : (
      <Empty />
    );
  };

  return (
    <>
      {renderConfigCard()}
      <Divider />
      <Tags />
    </>
  );
};

export default Config;

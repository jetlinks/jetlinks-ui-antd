import { createSchemaField, observer } from '@formily/react';
import { productModel, service } from '@/pages/device/Product';
import { Form, FormItem, FormGrid, Password, FormLayout, PreviewText, Input } from '@formily/antd';
import { createForm } from '@formily/core';
import { Card, Empty } from 'antd';
import type { ISchema } from '@formily/json-schema';
import { SetStateAction, useEffect, useState } from 'react';
import type { ConfigMetadata, ConfigProperty } from '@/pages/device/Product/typings';

const componentMap = {
  string: 'Input',
  password: 'Password',
};
const BaseInfo = observer(() => {
  const id = productModel.current?.id;
  const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);
  const [state, setState] = useState<boolean>(false);

  const form = createForm({
    validateFirst: true,
    readPretty: state,
    initialValues: productModel.current?.configuration,
  });

  useEffect(() => {
    if (id) {
      service.getConfigMetadata(id).then((config: { result: SetStateAction<ConfigMetadata[]> }) => {
        setMetadata(config.result);
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

  return <>{renderConfigCard()}</>;
});
export default BaseInfo;

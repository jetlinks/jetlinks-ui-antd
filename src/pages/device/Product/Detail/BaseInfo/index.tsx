import { createSchemaField } from '@formily/react';
import { productModel, service } from '@/pages/device/Product';
import { Form, FormItem, FormGrid, Password, FormLayout, PreviewText, Input } from '@formily/antd';
import { createForm } from '@formily/core';
import { Card, Empty } from 'antd';
import type { ISchema } from '@formily/json-schema';
import type { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import type { ConfigMetadata, ConfigProperty } from '@/pages/device/Product/typings';
import { useParams } from 'umi';
import { useIntl } from '@@/plugin-locale/localeExports';

const componentMap = {
  string: 'Input',
  password: 'Password',
};
const BaseInfo = () => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);
  const [state, setState] = useState<boolean>(false);

  const form = createForm({
    validateFirst: true,
    readPretty: state,
    initialValues: productModel.current?.configuration,
  });

  useEffect(() => {
    if (param.id) {
      service
        .getConfigMetadata(param.id)
        .then((config: { result: SetStateAction<ConfigMetadata[]> }) => {
          setMetadata(config.result);
        });
    }
  }, [param.id]);

  const SchemaField = createSchemaField({
    components: {
      Password,
      FormGrid,
      PreviewText,
      FormItem,
      Input,
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
    return metadata && metadata.length > 0 ? (
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
            key={item.name}
            title={item.name}
            extra={
              <a onClick={() => setState(!state)}>
                {state ? (
                  <>
                    {intl.formatMessage({
                      id: 'pages.data.option.edit',
                      defaultMessage: '编辑',
                    })}
                  </>
                ) : (
                  <>
                    {intl.formatMessage({
                      id: 'pages.device.productDetail.base.save',
                      defaultMessage: '保存',
                    })}
                  </>
                )}
              </a>
            }
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
      <Empty description={'暂无配置'} />
    );
  };

  return <>{renderConfigCard()}</>;
};
export default BaseInfo;

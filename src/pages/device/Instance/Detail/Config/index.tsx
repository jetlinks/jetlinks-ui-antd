import { Card, Divider, Empty, message, Popconfirm, Space, Tooltip } from 'antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import { createSchemaField } from '@formily/react';
import type { ConfigMetadata, ConfigProperty } from '@/pages/device/Product/typings';
import type { ISchema } from '@formily/json-schema';
import { Form, FormGrid, FormItem, FormLayout, Input, Password, PreviewText } from '@formily/antd';
import { createForm } from '@formily/core';
import { history, useParams } from 'umi';
import Tags from '@/pages/device/Instance/Detail/Config/Tags';
import Icon from '@ant-design/icons';

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

  const id = InstanceModel.detail?.id;

  useEffect(() => {
    if (id) {
      service.getConfigMetadata(id).then((config) => {
        setMetadata(config?.result);
      });
      setState(
        !!(
          InstanceModel.detail?.configuration &&
          Object.keys(InstanceModel.detail?.configuration).length > 0
        ),
      );
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
          <>
            <Divider />
            <Card
              title={item.name}
              extra={
                <Space>
                  <a
                    onClick={async () => {
                      if (!state) {
                        const values = (await form.submit()) as any;
                        const resp = await service.modify(id || '', {
                          id,
                          configuration: { ...values },
                        });
                        if (resp.status === 200) {
                          InstanceModel.detail = {
                            ...InstanceModel.detail,
                            configuration: { ...values },
                          };
                        }
                      }
                      setState(!state);
                    }}
                  >
                    {state ? '编辑' : '保存'}
                  </a>
                  {InstanceModel.detail.state?.value !== 'notActive' && (
                    <Popconfirm
                      title="确认重新应用该配置？"
                      onConfirm={async () => {
                        const resp = await service.deployDevice(id || '');
                        if (resp.status === 200) {
                          message.success('操作成功');
                        }
                      }}
                    >
                      <a>应用配置</a>
                      <Tooltip title="修改配置后需重新应用后才能生效。">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </Popconfirm>
                  )}
                  {InstanceModel.detail?.aloneConfiguration && (
                    <Popconfirm
                      title="确认恢复默认配置？"
                      onConfirm={async () => {
                        const resp = await service.configurationReset(id || '');
                        if (resp.status === 200) {
                          message.success('恢复默认配置成功');
                        }
                      }}
                    >
                      <a>恢复默认</a>
                      <Tooltip
                        title={`该设备单独编辑过配置信息，点击此将恢复成默认的配置信息，请谨慎操作。`}
                      >
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </Popconfirm>
                  )}
                </Space>
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
          </>
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

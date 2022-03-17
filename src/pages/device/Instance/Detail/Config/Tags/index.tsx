import { createSchemaField, FormProvider } from '@formily/react';
import { Editable, FormItem, Input, ArrayTable } from '@formily/antd';
import { createForm } from '@formily/core';
import { Card, message } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Editable,
    Input,
    ArrayTable,
  },
});

const Tags = () => {
  const intl = useIntl();
  const [tags, setTags] = useState<any[]>([]);

  const tag = InstanceModel.detail?.tags;

  useEffect(() => {
    if (tag) {
      setTags([...tag] || []);
    }
  }, [tag]);

  const form = createForm({
    initialValues: {
      tags: tags,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 10 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: 'ID' },
              properties: {
                key: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-disabled': true,
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: intl.formatMessage({
                  id: 'pages.table.name',
                  defaultMessage: '名称',
                }),
              },
              properties: {
                name: {
                  type: 'string',
                  'x-decorator': 'Editable',
                  'x-component': 'Input',
                },
              },
            },
            column5: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: intl.formatMessage({
                  id: 'pages.device.instanceDetail.detail.value',
                  defaultMessage: '值',
                }),
              },
              properties: {
                value: {
                  type: 'string',
                  'x-decorator': 'Editable',
                  'x-component': 'Input',
                },
              },
            },
          },
        },
      },
    },
  };
  return (
    <Card
      title={intl.formatMessage({
        id: 'pages.device.instanceDetail.tags',
        defaultMessage: '标签',
      })}
      extra={
        <a
          onClick={async () => {
            const values = (await form.submit()) as any;
            if (values?.tags) {
              const resp = await service.saveTags(InstanceModel.detail?.id || '', values.tags);
              if (resp.status === 200) {
                InstanceModel.detail = { ...InstanceModel.detail, tags: values.tags };
                message.success('操作成功！');
              }
            }
          }}
        >
          {intl.formatMessage({
            id: 'pages.device.instanceDetail.save',
            defaultMessage: '保存',
          })}
        </a>
      }
    >
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    </Card>
  );
};

export default Tags;

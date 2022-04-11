import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { InstanceModel, service } from '@/pages/device/Instance';
import { ArrayTable, FormItem, Input } from '@formily/antd';
import { message, Modal } from 'antd';
import { useIntl } from 'umi';

interface Props {
  close: () => void;
  tags: any[];
}

const Edit = (props: Props) => {
  const { tags } = props;
  const intl = useIntl();

  const form = createForm({
    initialValues: {
      tags: tags,
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      ArrayTable,
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
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: 'ID' },
              properties: {
                key: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  // 'x-disabled': true
                },
              },
            },
            column2: {
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
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column3: {
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
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 100,
                title: '操作',
                dataIndex: 'operations',
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayTable.Remove',
                    },
                  },
                },
              },
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            'x-component': 'ArrayTable.Addition',
            title: '添加',
          },
        },
      },
    },
  };

  return (
    <Modal
      title="编辑标签"
      onCancel={() => {
        props.close();
      }}
      visible
      width={1000}
      onOk={async () => {
        const values: any = (await form.submit()) as any;
        const list = (values?.tags || []).filter((item: any) => item?.id);
        const resp = await service.saveTags(InstanceModel.detail?.id || '', list);
        if (resp.status === 200) {
          InstanceModel.detail = { ...InstanceModel.detail, tags: values.tags };
          message.success('操作成功！');
          props.close();
        }
      }}
    >
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    </Modal>
  );
};

export default Edit;

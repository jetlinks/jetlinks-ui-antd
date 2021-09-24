import { createSchemaField, FormProvider, observer } from '@formily/react';
import { Editable, FormItem, Input, ArrayTable } from '@formily/antd';
import { createForm } from '@formily/core';
import { Card } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Editable,
    Input,
    ArrayTable,
  },
});
const form = createForm();

const Tags = observer(() => {
  const intl = useIntl();
  const schema = {
    type: 'object',
    properties: {
      array: {
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
              'x-component-props': {
                width: 50,
                title: intl.formatMessage({
                  id: 'pages.device.instanceDetail.detail.sort',
                  defaultMessage: '排序',
                }),
                align: 'center',
              },
              properties: {
                sort: {
                  type: 'void',
                  'x-component': 'ArrayTable.SortHandle',
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: 'ID' },
              properties: {
                a1: {
                  type: 'string',
                  'x-decorator': 'Editable',
                  'x-component': 'Input',
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
                a2: {
                  type: 'string',
                  'x-decorator': 'FormItem',
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
                a3: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: intl.formatMessage({
                  id: 'pages.data.option',
                  defaultMessage: '操作',
                }),
                dataIndex: 'operations',
                width: 200,
                fixed: 'right',
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
                    moveDown: {
                      type: 'void',
                      'x-component': 'ArrayTable.MoveDown',
                    },
                    moveUp: {
                      type: 'void',
                      'x-component': 'ArrayTable.MoveUp',
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
            title: intl.formatMessage({
              id: 'pages.device.instanceDetail.detail.value',
              defaultMessage: '添加标签',
            }),
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
        <a>
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
});
export default Tags;

import { useIntl } from 'umi';
import { createForm, onFormSubmitStart } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { ArrayTable, Editable, Form, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { service } from '@/pages/system/Permission';
import { Modal } from '@/components';
import { onlyMessage } from '@/utils/util';

interface Props {
  model: 'add' | 'edit' | 'query';
  data: Partial<PermissionItem>;
  close: () => void;
}

const defaultAction = [
  { action: 'query', name: '查询', describe: '查询' },
  { action: 'save', name: '保存', describe: '保存' },
  { action: 'delete', name: '删除', describe: '删除' },
];

const Save = (props: Props) => {
  const { model } = props;
  const intl = useIntl();

  const [data, setData] = useState<Partial<PermissionItem>>(props.data);

  useEffect(() => {
    if (model === 'edit') {
      setData(props.data);
    } else {
      setData({});
    }
  }, [props.data, props.model]);

  const form = createForm({
    validateFirst: true,
    initialValues: data,
    effects: () => {
      onFormSubmitStart((formEffect) => {
        formEffect.values.actions = formEffect.values.actions?.filter(
          (item: any) => Object.keys(item).length > 0,
        );
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      ArrayTable,
      Editable,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: intl.formatMessage({
          id: 'pages.system.permission.id',
          defaultMessage: '标识(ID)',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入标识(ID)',
        },
        'x-disabled': model === 'edit',
        name: 'id',
        'x-decorator-props': {
          tooltip: <div>标识ID需与代码中的标识ID一致</div>,
        },
        'x-validator': [
          {
            required: true,
            message: '请输入标识(ID)',
          },
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            triggerType: 'onBlur',
            validator: (value: string) => {
              return new Promise((resolve) => {
                if (!value) resolve('');
                service
                  .validateField({ id: value })
                  .then((resp) => {
                    if (resp.status === 200) {
                      if (resp.result.passed) {
                        resolve('');
                      } else {
                        resolve(model === 'edit' ? '' : resp.result.reason);
                      }
                    }
                    resolve('');
                  })
                  .catch(() => {
                    return '验证失败!';
                  });
              });
            },
          },
        ],
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'name',
        'x-component-props': {
          placeholder: '请输入名称',
        },
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
      },
      actions: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        default: defaultAction,
        title: '操作类型',
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 80, title: '-', align: 'center' },
              properties: {
                index: {
                  type: 'void',
                  'x-component': 'ArrayTable.Index',
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: intl.formatMessage({
                  id: 'pages.system.permission.addConfigurationType',
                  defaultMessage: '操作类型',
                }),
              },
              properties: {
                action: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-validator': [
                    {
                      required: true,
                      message: '请输入操作类型',
                    },
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                  ],
                },
              },
            },
            column3: {
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
                  'x-validator': [
                    {
                      required: true,
                      message: '请输入名称',
                    },
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: intl.formatMessage({
                  id: 'pages.table.describe',
                  defaultMessage: '描述',
                }),
              },
              properties: {
                describe: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-validator': [
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                  ],
                },
              },
            },
            column5: {
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

  const save = async () => {
    const value = await form.submit<PermissionItem>();
    let response = undefined;
    if (props.model === 'add') {
      response = await service.save(value);
    } else {
      response = await service.update(value);
    }
    if (response && response.status === 200) {
      onlyMessage(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功',
        }),
      );
      props.close();
    }
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.${model}`,
        defaultMessage: '编辑',
      })}
      maskClosable={false}
      visible={model !== 'query'}
      onCancel={props.close}
      onOk={save}
      width="1000px"
      // permissionCode={'system/Permission'}
      // permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

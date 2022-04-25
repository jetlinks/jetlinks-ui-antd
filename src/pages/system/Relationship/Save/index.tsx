import { useIntl } from 'umi';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import { service } from '@/pages/system/Relationship';
import { Modal } from '@/components';
import { message } from 'antd';

interface Props {
  data: Partial<ReationItem>;
  close: () => void;
}

const Save = (props: Props) => {
  const intl = useIntl();

  const getTypes = () => service.getTypes();

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field).then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          ...item,
          label: item.name,
          value: JSON.stringify({
            objectType: item.id,
            objectTypeName: item.name,
          }),
        }));
        field.loading = false;
      }),
    );
  };

  const form = createForm({
    validateFirst: true,
    initialValues: props.data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FormGrid,
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
      layout: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          name: {
            title: '名称',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
            name: 'name',
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
          relation: {
            title: '标识',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-disabled': !!props.data?.id,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入标识',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入标识',
              },
              // {
              //   triggerType: 'onBlur',
              //   // validator: (value: string) => {
              //   //   return new Promise((resolve) => {
              //   //     service
              //   //       .validateField('username', value)
              //   //       .then((resp) => {
              //   //         if (resp.status === 200) {
              //   //           if (resp.result.passed) {
              //   //             resolve('');
              //   //           } else {
              //   //             resolve(model === 'edit' ? '' : resp.result.reason);
              //   //           }
              //   //         }
              //   //         resolve('');
              //   //       })
              //   //       .catch(() => {
              //   //         return '验证失败!';
              //   //       });
              //   //   });
              //   // },
              // },
            ],
            name: 'relation',
            required: true,
          },
          object: {
            title: '关联方',
            'x-decorator-props': {
              gridSpan: 1,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-disabled': !!props.data?.id,
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择关联方',
              showArrow: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
            required: true,
            'x-reactions': ['{{useAsyncDataSource(getTypes)}}'],
          },
          target: {
            title: '被关联方',
            'x-decorator-props': {
              gridSpan: 1,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-disabled': !!props.data?.id,
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择被关联方',
            },
            'x-reactions': {
              dependencies: ['..object'],
              fulfill: {
                state: {
                  dataSource:
                    '{{JSON.parse($deps[0] || "{}").objectType==="device"?[{label: "用户", value: JSON.stringify({"targetType":"user", "targetTypeName": "用户"})}] : []}}',
                },
              },
            },
            required: true,
          },
          description: {
            title: '说明',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              rows: 5,
              placeholder: '请输入说明',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-validator': [
              {
                max: 200,
                message: '最多可输入200个字符',
              },
            ],
          },
        },
      },
    },
  };

  const save = async () => {
    const value = await form.submit<any>();
    const temp: any = {
      ...props.data,
      ...value,
      ...JSON.parse(value?.object || '{}'),
      ...JSON.parse(value?.target || '{}'),
    };
    delete temp.object;
    delete temp.target;
    const response: any = await service[!props.data?.id ? 'save' : 'update']({ ...temp });
    if (response.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功',
        }),
      );
      props.close();
    } else {
      message.error('操作失败！');
    }
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.${props.data.id ? 'edit' : 'add'}`,
        defaultMessage: '编辑',
      })}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={save}
      width="35vw"
      permissionCode={'system/Relationship'}
      permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getTypes }} />
      </Form>
    </Modal>
  );
};
export default Save;

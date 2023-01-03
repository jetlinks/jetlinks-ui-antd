import { Form, FormGrid, FormItem, Input, Password, Select } from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { Store } from 'jetlinks-store';
import { service } from '@/pages/system/DataSource';
import { onlyMessage } from '@/utils/util';

interface Props {
  close: () => void;
  reload: () => void;
  data: Partial<DataSourceItem>;
}

const Save = (props: Props) => {
  const form = createForm({
    validateFirst: true,
    initialValues: props.data,
    effects: () => {
      onFieldValueChange('typeId', (field, form1) => {
        if (field.modified) {
          form1.setFieldState('description', (state) => {
            state.value = '';
          });
          form1.setFieldState('shareConfig.*', (state) => {
            state.value = '';
          });
        }
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      Select,
      FormGrid,
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
              gridSpan: 1,
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
            required: true,
          },
          typeId: {
            title: '类型',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请选择类型',
            },
            name: 'typeId',
            'x-validator': [
              {
                required: true,
                message: '请选择类型',
              },
            ],
            required: true,
            'x-disabled': !!props.data.id,
            enum: Store.get('datasource-type'),
          },
          'shareConfig.url': {
            title: 'URL',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入r2bdc或者jdbc连接地址，示例：r2dbc:mysql://127.0.0.1:3306/test',
            },
            'x-validator': [
              // {
              //   format: 'url',
              //   message: '请输入正确的URL',
              // },
              {
                required: true,
                message: '请输入URL',
              },
              {
                triggerType: 'onBlur',
                validator: (value: string) => {
                  return new Promise((resolve) => {
                    if (!value) {
                      resolve('');
                    } else {
                      const arr = value.split(':');
                      if ((arr?.[0] === 'jdbc' || arr?.[0] === 'r2dbc') && arr?.[1] === 'mysql') {
                        resolve('');
                      } else {
                        resolve('请输入正确的URL');
                      }
                    }
                  });
                },
              },
            ],
            required: true,
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="rdb"}}',
                },
              },
            },
          },
          'shareConfig.adminUrl': {
            title: '管理地址',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入管理地址，示例：http://localhost:15672',
            },
            'x-validator': [
              // {
              //   format: 'url',
              //   message: '请输入正确的管理地址',
              // },
              {
                required: true,
                message: '请输入管理地址',
              },
              // {
              //   triggerType: 'onBlur',
              //   validator: (value: string) => {
              //     return new Promise((resolve) => {
              //       if (!value) {
              //         resolve('');
              //       } else {
              //         const arr = value.split('://')
              //         if (arr[0] === 'http' || arr[0] === 'https') {
              //           resolve('');
              //         } else {
              //           resolve('请输入正确的管理地址')
              //         }
              //       }
              //     });
              //   },
              // },
            ],
            required: true,
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="rabbitmq"}}',
                },
              },
            },
          },
          'shareConfig.addresses': {
            title: '链接地址',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入链接地址，示例：localhost:5672',
            },
            'x-validator': [
              // {
              //   format: 'url',
              //   message: '请输入正确的链接地址',
              // },
              {
                required: true,
                message: '请输入链接地址',
              },
              // {
              //   triggerType: 'onBlur',
              //   validator: (value: string) => {
              //     return new Promise((resolve) => {
              //       if (!value) {
              //         resolve('');
              //       } else {
              //         const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
              //         if (reg.test(value)) {
              //           resolve('');
              //         } else {
              //           resolve('请输入正确的链接地址')
              //         }
              //       }
              //     });
              //   },
              // },
            ],
            required: true,
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="rabbitmq"}}',
                },
              },
            },
          },
          'shareConfig.username': {
            title: '用户名',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入用户名',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入用户名',
              },
            ],
            required: true,
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{["rdb","rabbitmq"].includes($deps[0])}}',
                },
              },
            },
          },
          'shareConfig.password': {
            title: '密码',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Password',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入密码',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入密码',
              },
            ],
            required: true,
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{["rdb","rabbitmq"].includes($deps[0])}}',
                },
              },
            },
          },
          'shareConfig.virtualHost': {
            title: '虚拟域',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入虚拟域',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入虚拟域',
              },
            ],
            required: true,
            default: '/',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="rabbitmq"}}',
                },
              },
            },
          },
          'shareConfig.schema': {
            title: 'schema',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入schema',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入schema',
              },
            ],
            required: true,
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="rdb"}}',
                },
              },
            },
          },
          description: {
            title: '说明',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              rows: 3,
              showCount: true,
              maxLength: 200,
              placeholder: '请输入说明',
            },
          },
        },
      },
    },
  };

  const handleSave = async () => {
    const data: any = await form.submit();
    const response: any = props.data?.id ? await service.update(data) : await service.save(data);
    if (response.status === 200) {
      onlyMessage('保存成功');
      props.reload();
    }
  };

  return (
    <Modal
      width={'55vw'}
      title={`${props.data?.id ? '编辑' : '新增'}数据源`}
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        handleSave();
      }}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Save;

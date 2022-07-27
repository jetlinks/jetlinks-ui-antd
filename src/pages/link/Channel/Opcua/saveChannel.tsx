import { createForm, Field } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, NumberPicker, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/link/Channel/Opcua';
import { Modal } from '@/components';
import { onlyMessage } from '@/utils/util';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';

interface Props {
  data: any;
  close: () => void;
}

const SaveChannel = (props: Props) => {
  const form = createForm({
    initialValues: {
      ...props.data,
    },
  });

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field).then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          label: item,
          value: item,
        }));
        field.loading = false;
      }),
    );
  };

  const getPolicies = () => service.policies();
  const getModes = () => service.modes();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FormGrid,
      NumberPicker,
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
          'configuration.endpoint': {
            title: '服务地址',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入服务地址',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入服务地址',
              },
              {
                pattern:
                  '(opc.tcp|http|https|opc.http|opc.https|opc.ws|opc.wss)://([^:/]+|\\[.*])(:\\d+)?(/.*)?',
                message: '以固定协议(http,https,opc.tcp等)字段开头，并用://与IP地址连接',
              },
            ],
            name: 'endpoint',
            required: true,
          },
          'configuration.securityPolicy': {
            title: '安全策略',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择安全策略',
              showArrow: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请选择安全策略',
              },
            ],
            'x-reactions': ['{{useAsyncDataSource(getPolicies)}}'],
          },
          'configuration.securityMode': {
            title: '安全模式',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择安全模式',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择安全模式',
              },
            ],
            required: true,
            'x-reactions': ['{{useAsyncDataSource(getModes)}}'],
          },
          'configuration.username': {
            title: '用户名',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入用户名',
            },
            name: 'name',
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          'configuration.password': {
            title: '密码',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入密码',
            },
            name: 'name',
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
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
    if (props.data.id) {
      const res = await service.editOpc(props.data.id, value);
      if (res.status === 200) {
        onlyMessage('保存成功');
        props.close();
      }
    } else {
      const res = await service.saveOpc(value);
      if (res.status === 200) {
        onlyMessage('保存成功');
        props.close();
      }
    }
  };

  return (
    <Modal
      title={props.data.id ? '编辑通道' : '新增通道'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={save}
      width="35vw"
      permissionCode={'link/Channel/Opcua'}
      permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getPolicies, getModes }} />
      </Form>
    </Modal>
  );
};
export default SaveChannel;

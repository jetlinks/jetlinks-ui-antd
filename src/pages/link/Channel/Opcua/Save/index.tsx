import { useIntl } from 'umi';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/link/Channel/Opcua';
import { Modal } from '@/components';
import { message } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  data: Partial<OpaUa>;
  close: () => void;
  device?: any;
}

const Save = (props: Props) => {
  const intl = useIntl();
  const [policies, setPolicies] = useState<any>([]);
  const [modes, setModes] = useState<any>([]);

  const form = createForm({
    validateFirst: true,
    initialValues: {
      ...props.data,
      clientConfigs: props.data?.clientConfigs?.[0],
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
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
          'clientConfigs.endpoint': {
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
                message: '格式错误(opc.tcp://127.0.0.1:49320)',
              },
            ],
            name: 'endpoint',
            required: true,
          },
          'clientConfigs.securityPolicy': {
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
            enum: policies,
          },
          'clientConfigs.securityMode': {
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
            enum: modes,
          },
          'clientConfigs.username': {
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
          'clientConfigs.password': {
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
    console.log(value);
    const item = {
      name: value.name,
      description: value.description,
      clientConfigs: [value.clientConfigs],
    };
    if (props.data.id) {
      service.modify(props.data.id, item).then((res: any) => {
        if (res.status === 200) {
          message.success('保存成功');
          props.close();
        }
      });
    } else {
      if (props.device) {
        service.save(item).then((res: any) => {
          if (res.status === 200) {
            const params = {
              opcUaId: res.result.id,
              deviceId: props.device.id,
              deviceName: props.device.name,
              productId: props.device.productId,
              productName: props.device.productName,
            };
            service.bind(params).then((resp) => {
              if (resp.status === 200) {
                message.success('保存成功');
                props.close();
              }
            });
          }
        });
      } else {
        service.save(item).then((res: any) => {
          if (res.status === 200) {
            message.success('保存成功');
            props.close();
          }
        });
      }
    }
  };

  useEffect(() => {
    service.policies().then((res) => setPolicies(res.result));
    service.modes().then((res) => setModes(res.result));
  }, []);
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
      permissionCode={'link/Channel/Opcua'}
      permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

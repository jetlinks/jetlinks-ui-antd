import { useIntl } from 'umi';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/link/Channel/Modbus';
import { Modal } from '@/components';
import { message } from 'antd';

interface Props {
  data: any;
  close: () => void;
}

const Save = (props: Props) => {
  const intl = useIntl();

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
          host: {
            title: 'IP',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入IP',
            },
            'x-validator': ['ipv4'],
            name: 'host',
            required: true,
          },
          port: {
            title: '端口',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              placeholder: '请输入端口',
            },
            default: 502,
            'x-validator': [
              {
                min: 1,
                max: 65535,
                message: '请输入1～65535之间的正整数',
              },
            ],
            name: 'host',
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
    if (props.data.id) {
      service
        .edit({
          ...value,
          id: props.data.id,
        })
        .then((res: any) => {
          if (res.status === 200) {
            message.success('保存成功');
            props.close();
          }
        });
    } else {
      service.save(value).then((res: any) => {
        if (res.status === 200) {
          message.success('保存成功');
          props.close();
        }
      });
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
      permissionCode={'link/Channel/Modbus'}
      permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

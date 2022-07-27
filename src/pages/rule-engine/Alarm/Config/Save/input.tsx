import { Modal } from 'antd';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Switch } from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/rule-engine/Alarm/Config';
import { onlyMessage } from '@/utils/util';

interface Props {
  data?: any;
  close: () => void;
  save: () => void;
}

const InputSave = (props: Props) => {
  const { data, close } = props;

  const form = createForm({
    validateFirst: true,
    // initialValues: data,
    effects() {
      onFormInit((f) => {
        if (data) {
          f.setInitialValues({
            ...data?.data?.config?.config,
            address: data?.data?.config?.config?.address,
            topic: data?.data?.config?.config?.topic,
            state: data?.data?.state?.value === 'enabled' ? true : false,
          });
        }
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      Switch,
    },
  });

  const save = async () => {
    form.validate();
    const inputConfig: any = await form.submit();
    const res = await service.saveOutputData({
      config: {
        sourceType: 'kafka',
        config: {
          ...inputConfig,
          state: inputConfig?.state ? 'enabled' : 'disable',
        },
      },
      state: inputConfig?.state ? 'enabled' : 'disable',
      id: data?.data?.id,
      sourceType: 'kafka',
      exchangeType: 'consume',
    });

    if (res.status === 200) {
      onlyMessage('操作成功');
      props.save();
    }
  };

  const inputSchema: ISchema = {
    type: 'object',
    properties: {
      id: {
        'x-component': 'Input',
        'x-hidden': true,
      },
      address: {
        title: 'kafka地址',
        type: 'string',
        // required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入kafka地址',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
      },
      topic: {
        title: 'topic',
        type: 'string',
        // required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入topic',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
      },
      state: {
        title: '状态',
        type: 'string',
        // required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        default: false,
        'x-component-props': {
          checkedChildren: '禁用',
          unCheckedChildren: '启用',
        },
      },
    },
  };

  return (
    <Modal
      maskClosable={false}
      width="45vw"
      title="编辑"
      onCancel={() => close()}
      onOk={() => save()}
      visible
    >
      <Form form={form} labelCol={5} wrapperCol={16} layout="vertical">
        <SchemaField schema={inputSchema} />
      </Form>
    </Modal>
  );
};
export default InputSave;

import { Modal } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Switch } from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/rule-engine/Alarm/Config';
import { onlyMessage } from '@/utils/util';
import type { IOConfigItem } from '../typing';

interface Props {
  data?: FirmwareItem;
  close: () => void;
}

const InputSave = (props: Props) => {
  const { data, close } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: data,
    effects() {
      onFormInit(async (f) => {
        const resp = await service.getDataExchange('consume');
        if (resp.status === 200) {
          f.setInitialValues(resp.result?.config.config);
          f.setValuesIn('id', resp.result?.id);
          f.setValuesIn('state', resp.result?.state?.value === 'enabled' ? true : false);
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
    const inputConfig: IOConfigItem = await form.submit();
    const res = await service.saveOutputData({
      config: {
        sourceType: 'kafka',
        config: inputConfig,
      },
      id: inputConfig.id,
      sourceType: 'kafka',
      exchangeType: 'consume',
    });

    if (res.status === 200) {
      onlyMessage('操作成功');
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
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入kafka地址',
        },
      },
      topic: {
        title: 'topic',
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入topic',
        },
      },
      state: {
        title: '状态',
        type: 'string',
        required: true,
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

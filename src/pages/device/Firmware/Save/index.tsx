import { Modal } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, Select, Upload } from '@formily/antd';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';

interface Props {
  data?: FirmwareItem;
  close: () => void;
  visible: boolean;
}

const Save = (props: Props) => {
  const { data, close, visible } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: data,
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Upload,
      Select,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      productId: {
        title: '产品',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
      name: {
        title: '名称',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      version: {
        title: '版本号',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      versionOrder: {
        title: '版本序号',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
      signMethod: {
        title: '签名方式',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
      sign: {
        title: '签名',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
      file: {
        title: '文件上传',
        'x-decorator': 'FormItem',
        'x-component': 'Upload',
      },
      describe: {
        title: '描述信息',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 3,
        },
      },
    },
  };
  return (
    <Modal title="新增固件版本" onCancel={() => close()} onOk={console.log} visible={visible}>
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

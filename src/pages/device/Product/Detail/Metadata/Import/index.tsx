import { Modal } from 'antd';
import { createSchemaField } from '@formily/react';
import { createForm } from '@formily/core';
import { Form, FormItem, Input, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import FMonacoEditor from '@/components/FMonacoEditor';
import Upload from '@/components/Upload/Upload';

interface Props {
  visible: boolean;
  close: () => void;
}

const Import = (props: Props) => {
  const form = createForm({
    initialValues: {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FMonacoEditor,
      Upload,
    },
  });
  const schema: ISchema = {
    type: 'object',
    properties: {
      type: {
        title: '导入方式',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: '拷贝产品', value: 'copy' },
          { label: '导入物模型', value: 'import' },
        ],
      },
      device: {
        title: '选择设备',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [],
        'x-visible': false,
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='copy'}}",
            },
          },
        },
      },
      upload: {
        title: '快速导入',
        'x-decorator': 'FormItem',
        'x-component': 'Upload',
      },
      metadata: {
        title: '类型',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          {
            label: 'Jetlinks物模型',
            value: 'jetlinks',
          },
          {
            label: '阿里云物模型TSL',
            value: 'aliyun-tsl',
          },
        ],
        'x-visible': false,
        default: 'jetlinks',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='import'}}",
            },
          },
        },
      },
      editor: {
        title: '物模型',
        'x-decorator': 'FormItem',
        'x-component': 'FMonacoEditor',
        'x-component-props': {
          height: 200,
          theme: 'vs',
          language: 'json',
        },
        'x-visible': false,
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='import'}}",
            },
          },
        },
      },
    },
  };

  return (
    <Modal title="导入物模型" visible={props.visible} onCancel={() => props.close()}>
      <div style={{ background: 'rgb(236, 237, 238)' }}>
        <p style={{ padding: 10 }}>
          <span style={{ color: '#f5222d' }}>注</span>
          ：导入的物模型会覆盖原来的属性、功能、事件、标签，请谨慎操作。
          <br />
          物模型格式请参考文档：
          <a
            target="_blank"
            href="http://doc.jetlinks.cn/basics-guide/device-manager.html#%E8%AE%BE%E5%A4%87%E5%9E%8B%E5%8F%B7"
          >
            设备型号
          </a>
        </p>
      </div>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Import;

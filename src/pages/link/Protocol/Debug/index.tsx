import { Button, Modal } from 'antd';
import type { ISchema } from '@formily/json-schema';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, Radio, Select, Space } from '@formily/antd';
import FMonacoEditor from '@/components/FMonacoEditor';
import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { service } from '@/pages/link/Protocol';
import { useEffect, useState } from 'react';

interface Props {
  close: () => void;
  data: Partial<ProtocolItem>;
}

const Debug = (props: Props) => {
  const { close, data } = props;

  const [transport, setTransport] = useState<{ label: string; value: string }[]>([]);
  const form = createForm({
    initialValues: {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Radio,
      Space,
      FMonacoEditor,
    },
    scope: {
      setDefaultCode(field: Field) {
        const type = (field.query('.type').take() as Field).value;
        const trans = (field.query('.transport').take() as Field).value;

        if (type === 'encode') {
          field.value =
            '{\n' +
            '  "messageType":"READ_PROPERTY",\n' +
            '  "properties":[\n' +
            '    \n' +
            '  ]\n' +
            '}';
        } else {
          field.setComponentProps({
            language: 'text',
          });
          switch (trans) {
            case 'HTTP':
              field.value = 'POST /url\n' + 'Content-Type: application/json\n' + '\n' + '{}';
              break;
            case 'MQTT':
              field.value = 'QoS0 /topic\n' + '\n' + '{}';
              break;
            case 'CoAP':
              field.value = 'POST /url\n' + 'Content-Format: application/json\n' + '\n' + '{}';
              break;
            default:
              field.value = '';
              break;
          }
        }
      },
    },
  });

  // 获取调试类型
  const getTransport = () => service.covert(data);

  useEffect(() => {
    getTransport().then((resp) => {
      const convertData = resp.result?.transports?.map((item: Record<string, unknown>) => ({
        label: item.name,
        value: item.id,
      }));
      setTransport(convertData);
    });
  }, []);

  const debug = async () => {
    const values = (await form.submit()) as Record<string, any>;
    const resp = await service.debug(values.type, {
      entity: props.data,
      request: values,
    });
    form.setValues({
      output: resp.result,
    });
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      space: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'Space',
        properties: {
          type: {
            'x-component': 'Radio.Group',
            'x-decorator': 'FormItem',
            enum: [
              { label: '编码', value: 'encode' },
              { label: '解码', value: 'decode' },
            ],
            default: 'encode',
          },
          transport: {
            title: '链接类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-component-props': {
              style: {
                width: '200px',
              },
            },
            default: transport ? transport[0]?.value : null,
            enum: transport,
          },
          payloadType: {
            title: '消息类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              style: {
                width: '200px',
              },
            },
            default: 'JSON',
            enum: [
              { label: 'JSON', value: 'JSON' },
              { label: 'STRING', value: 'STRING' },
              { label: 'HEX', value: 'HEX' },
              { label: 'BINARY', value: 'BINARY' },
            ],
          },
        },
      },
      payload: {
        title: '输入',
        'x-decorator': 'FormItem',
        'x-component': 'FMonacoEditor',
        'x-component-props': {
          height: 200,
          theme: 'dark',
          language: 'json',
          editorDidMount: (editor1: any) => {
            editor1.onDidContentSizeChange?.(() => {
              editor1.getAction('editor.action.formatDocument').run();
            });
          },
        },
        'x-reactions': '{{setDefaultCode}}',
      },
      output: {
        title: '输出',
        'x-decorator': 'FormItem',
        'x-component': 'FMonacoEditor',
        'x-component-props': {
          height: 200,
          language: 'verilog',
        },
      },
    },
  };

  return (
    <Modal
      maskClosable={false}
      title="调试"
      width="60vw"
      onCancel={() => close()}
      visible={true}
      footer={
        <Button type="primary" onClick={debug}>
          执行
        </Button>
      }
    >
      <Form form={form} size="small">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Debug;

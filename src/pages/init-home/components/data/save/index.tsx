import { Modal } from 'antd';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker } from '@formily/antd';
import { onFormInit } from '@formily/core';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { service } from '../../../index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { onlyMessage } from '@/utils/util';

interface Props {
  data?: any;
  close: () => void;
  save: (values: any) => void;
}

const Save = (props: Props) => {
  const { close, data } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: data,
    effects: () => {
      onFormInit(async (form1) => {
        const resp = await service.getResourcesCurrent();
        const current = resp?.result;
        const _host = current.find((item: any) => item.host === '0.0.0.0')?.ports['TCP'] || [];
        form1.setFieldState('port', (state) => {
          state.dataSource = _host?.map((p: any) => ({ label: p, value: p }));
        });
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      NumberPicker,
      Select,
    },
  });

  const save = async () => {
    const values: any = await form.submit();
    onlyMessage('保存成功！');
    props.save(values);
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 2,
          maxColumns: 2,
        },
        properties: {
          host: {
            title: '本地地址',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择本地地址',
            },
            'x-disabled': true,
            default: '0.0.0.0',
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
              tooltip: '绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0',
            },
            required: true,
            'x-validator': ['ipv4'],
          },
          port: {
            title: '本地端口',
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              tooltip: '监听指定端口的请求',
              layout: 'vertical',
            },
            required: true,
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择本地端口',
            },
            'x-validator': [
              {
                max: 65535,
                message: '请输入1-65535之间的正整数',
              },
              {
                min: 1,
                message: '请输入1-65535之间的正整数',
              },
            ],
          },
          publicHost: {
            title: '公网地址',
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              tooltip: (
                <span>
                  <div>对外提供访问的地址</div>内网环境时填写服务器的内网IP地址
                </span>
              ),
              layout: 'vertical',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': ['ipv4'],
            'x-component-props': {
              placeholder: '请输入公网地址',
            },
          },
          publicPort: {
            title: '公网端口',
            'x-decorator-props': {
              gridSpan: 1,
              tooltip: '对外提供访问的端口',
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-component-props': {
              placeholder: '请输入公网端口',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-validator': [
              {
                max: 65535,
                message: '请输入1-65535之间的正整数',
              },
              {
                min: 1,
                message: '请输入1-65535之间的正整数',
              },
            ],
          },
        },
      },
    },
  };

  return (
    <Modal
      maskClosable={false}
      width="52vw"
      title={'初始数据'}
      onCancel={() => close()}
      onOk={() => save()}
      visible
    >
      <div style={{ background: 'rgb(236, 237, 238)' }}>
        <p style={{ padding: 10 }}>
          <ExclamationCircleOutlined style={{ marginRight: 5 }} />
          初始化数据包括MQTT产品、MQTT设备、MQTT类型设备接入网关、MQTT网络组件、Jetlinks 官方协议
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Form form={form} labelCol={5} wrapperCol={16} layout="vertical">
          <SchemaField schema={schema} />
        </Form>
      </div>
    </Modal>
  );
};

export default Save;

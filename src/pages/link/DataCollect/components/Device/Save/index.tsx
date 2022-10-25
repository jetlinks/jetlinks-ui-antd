import { Button, Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker, Password } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import service from '@/pages/link/DataCollect/service';
import { onlyMessage } from '@/utils/util';

interface Props {
  channelId?: string;
  data: Partial<CollectorItem>;
  close: () => void;
  reload: () => void;
}

export default (props: Props) => {
  const [data, setData] = useState<Partial<ChannelItem>>(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const form = createForm({
    validateFirst: true,
    initialValues: data || {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Password,
      FormGrid,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          'configuration.unitId': {
            title: '从机地址',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入从机地址',
            },
            'x-reactions': {
              dependencies: ['..provider'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="MODBUS_TCP"}}',
                },
              },
            },
            'x-validator': [
              {
                required: true,
                message: '请输入从机地址',
              },
              {
                max: 255,
                message: '请输入0-255之间的整整数',
              },
              {
                min: 0,
                message: '请输入0-255之间的整整数',
              },
            ],
          },
          'circuitBreaker.type': {
            title: '处理方式',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择处理方式',
            },
            default: 'LowerFrequency',
            enum: [
              { label: '降频', value: 'LowerFrequency' },
              { label: '熔断', value: 'Break' },
              { label: '忽略', value: 'Ignore' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择处理方式',
              },
            ],
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

  const save = async () => {
    const value = await form.submit<CollectorItem>();
    let response: any = null;
    if (props.data?.id) {
      response = await service.updateCollector(props.data?.id, { ...props.data, ...value });
    } else {
      if (props.channelId) {
        const resp = await service.queryChannelByID(props.channelId);
        if (resp.status === 200) {
          const obj = {
            ...value,
            provider: resp.result.provider,
            channelId: resp.result.channelId,
            configuration: {},
          };
          response = await service.saveCollector({ ...obj });
        }
      }
    }
    if (response && response?.status === 200) {
      onlyMessage('操作成功');
      props.reload();
    }
  };

  return (
    <Modal
      title={props?.data?.id ? '编辑' : '新增'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={700}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button
          type="primary"
          key={2}
          onClick={() => {
            save();
          }}
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

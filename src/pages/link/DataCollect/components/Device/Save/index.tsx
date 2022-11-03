import { Button, Modal } from 'antd';
import { createForm, Field, onFieldReact } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker, Password } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import service from '@/pages/link/DataCollect/service';
import { onlyMessage } from '@/utils/util';
import { RadioCard } from '@/components';

interface Props {
  channelId?: string;
  data: Partial<CollectorItem>;
  close: () => void;
  reload: () => void;
  provider?: 'OPC_UA' | 'MODBUS_TCP';
}

export default (props: Props) => {
  const form = createForm({
    validateFirst: true,
    initialValues: Object.keys(props.data).length
      ? props.data
      : {
          circuitBreaker: {
            type: 'LowerFrequency',
          },
        },
    effects: () => {
      onFieldReact('circuitBreaker.type', async (field, f) => {
        const func = (field as Field).value;
        f.setFieldState('circuitBreaker.type', (state) => {
          let tooltip = '';
          if (func === 'LowerFrequency') {
            tooltip =
              '连续20次异常，降低连接频率至原有频率的1/10（重试间隔不超过1分钟），故障处理后自动恢复至设定连接频率';
          } else if (func === 'Break') {
            tooltip = '连续10分钟异常，停止采集数据进入熔断状态，设备重新启用后恢复采集状态';
          } else if (func === 'Ignore') {
            tooltip = '忽略异常，保持原采集频率超时时间为5s';
          }
          state.decoratorProps = {
            tooltip: tooltip,
            gridSpan: 2,
          };
        });
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Password,
      FormGrid,
      RadioCard,
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
            'x-visible': props.provider === 'MODBUS_TCP',
            'x-validator': [
              {
                required: true,
                message: '请输入从机地址',
              },
              {
                max: 255,
                message: '请输入0-255之间的正整数',
              },
              {
                min: 0,
                message: '请输入0-255之间的正整数',
              },
            ],
          },
          'circuitBreaker.type': {
            title: '故障处理',
            'x-component': 'RadioCard',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择故障处理',
              model: 'singular',
              itemStyle: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minWidth: '130px',
                height: '50px',
              },
              options: [
                { label: '降频', value: 'LowerFrequency' },
                { label: '熔断', value: 'Break' },
                { label: '忽略', value: 'Ignore' },
              ],
            },
            default: 'LowerFrequency',
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
            channelId: props.channelId,
            configuration: {
              ...value.configuration,
            },
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

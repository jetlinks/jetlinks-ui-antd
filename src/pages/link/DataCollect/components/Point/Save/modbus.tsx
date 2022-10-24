import { Button, Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import {
  Form,
  FormGrid,
  FormItem,
  Input,
  Select,
  NumberPicker,
  Password,
  Checkbox,
} from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import service from '@/pages/link/DataCollect/service';
import { PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';

interface Props {
  data: Partial<PointItem>;
  close: () => void;
  reload: () => void;
}

export default (props: Props) => {
  const { permission } = PermissionButton.usePermission('link/Protocol');
  const [data, setData] = useState<Partial<PointItem>>(props.data);

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
      Checkbox,
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
            title: '点位名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入点位名称',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入点位名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          'configuration.function': {
            title: '功能码',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择功能码',
            },
            enum: [
              { label: '离散输入寄存器', value: 'DiscreteInputs' },
              { label: '保存寄存器', value: 'HoldingRegisters' },
              { label: '输入寄存器', value: 'InputRegisters' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择功能码',
              },
            ],
          },
          'configuration.parameter.address': {
            title: '地址',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入地址',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入地址',
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
          'configuration.codec.configuration.readIndex': {
            title: '起始位置',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入起始位置',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入起始位置',
              },
            ],
          },
          'configuration.parameter.quantity': {
            title: '寄存器数量',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入寄存器数量',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入寄存器数量',
              },
            ],
          },
          'configuration.codec.provider': {
            title: '数据类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择数据类型',
            },
            enum: [],
            'x-validator': [
              {
                required: true,
                message: '请选择数据类型',
              },
            ],
          },
          'configuration.codec.configuration.scaleFactor': {
            title: '缩放因子',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            default: 1,
            'x-component-props': {
              placeholder: '请输入缩放因子',
            },
            enum: [],
            'x-validator': [
              {
                required: true,
                message: '请输入缩放因子',
              },
            ],
          },
          accessModes: {
            title: '访问类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择访问类型',
            },
            enum: [
              { label: '读', value: 'read' },
              { label: '写', value: 'write' },
              { label: '订阅', value: 'subscribe' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择访问类型',
              },
            ],
          },
          'configuration.interval': {
            title: '采集频率',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            default: 3,
            'x-component-props': {
              placeholder: '请输入采集频率',
              addonAfter: '秒',
              style: {
                width: '100%',
              },
            },
            'x-validator': [
              {
                required: true,
                message: '请输入采集频率',
              },
            ],
          },
          features: {
            title: '采集特性',
            type: 'array',
            'x-component': 'Checkbox.Group',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            enum: [
              {
                label: '只推送变化的数据',
                value: 'changedOnly',
              },
            ],
          },
        },
      },
    },
  };

  const save = async () => {
    const value = await form.submit<PointItem>();
    const response: any = props.data?.id
      ? await service.updatePoint(props.data?.id, { ...props.data, ...value })
      : await service.savePoint({ ...props.data, ...value });
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
          disabled={props.data?.id ? !permission.update : !permission.add}
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

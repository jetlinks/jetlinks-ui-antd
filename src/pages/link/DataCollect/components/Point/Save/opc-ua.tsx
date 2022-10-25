import { Button, Modal } from 'antd';
import { createForm, Field } from '@formily/core';
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
import { onlyMessage } from '@/utils/util';
import { action } from '@formily/reactive';

interface Props {
  data: Partial<PointItem>;
  close: () => void;
  reload: () => void;
}

export default (props: Props) => {
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

  const getCodecProvider = () => service.queryCodecProvider();

  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((resp: any) => {
        field.dataSource = (resp?.result || []).map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

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
            'x-reactions': '{{useAsyncDataSource(getCodecProvider)}}',
            'x-validator': [
              {
                required: true,
                message: '请选择数据类型',
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

  const saveData = async () => {
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
            saveData();
          }}
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getCodecProvider }} />
      </Form>
    </Modal>
  );
};

import { Button, Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker, Password } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
// import service from '@/pages/link/DataCollect/service';
import { PermissionButton } from '@/components';
// import { onlyMessage } from '@/utils/util';

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
            enum: [],
            'x-validator': [
              {
                required: true,
                message: '请输入采集频率',
              },
            ],
          },
        },
      },
    },
  };

  const save = async () => {
    // const value = await form.submit<ProtocolItem>();
    // const response: any = props.data?.id
    //   ? await service.savePatch({ ...props.data, ...value })
    //   : await service.save({ ...props.data, ...value });
    // if (response && response?.status === 200) {
    //   onlyMessage('操作成功');
    //   props.reload();
    //   if ((window as any).onTabSaveSuccess) {
    //     (window as any).onTabSaveSuccess(response);
    //     setTimeout(() => window.close(), 300);
    //   }
    // }
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

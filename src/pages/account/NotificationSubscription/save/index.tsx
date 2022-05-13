import { Modal } from 'antd';
import type { AccessLogItem } from '@/pages/Log/Access/typings';
import { useEffect, useMemo, useState } from 'react';
import { Form, FormGrid, FormItem, Input, Select, Checkbox } from '@formily/antd';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';

interface Props {
  data: Partial<AccessLogItem>;
  close: () => void;
}

const Save = (props: Props) => {
  const [data, setDada] = useState<Partial<AccessLogItem>>(props.data || {});

  useEffect(() => {
    setDada(props.data);
  }, [props.data]);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        initialValues: data,
        effects() {
          //
        },
      }),
    [],
  );

  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 1,
        },
        properties: {
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 2,
              labelAlign: 'left',
              layout: 'vertical',
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          type: {
            title: '类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
            },
            enum: [
              {
                label: '设备告警',
                value: 'device',
              },
            ],
            'x-component-props': {
              placeholder: '请选择类型',
            },
          },
          rule: {
            title: '告警规则',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
            },
            enum: [],
            'x-component-props': {
              placeholder: '请选择告警规则',
            },
          },
          notice: {
            title: '通知方式',
            type: 'array',
            required: true,
            enum: [
              {
                label: '站内通知',
                value: 1,
              },
              {
                label: '邮件通知',
                value: 2,
              },
              {
                label: '短信通知',
                value: 3,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            'x-decorator-props': {
              gridSpan: 2,
              labelAlign: 'left',
              layout: 'vertical',
            },
          },
        },
      },
    },
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      Select,
      Checkbox,
    },
  });

  return (
    <Modal title={'详情'} visible onCancel={props.close} onOk={props.close} width={'45vw'}>
      <Form form={form} layout="vertical">
        <SchemaField
          schema={schema}
          scope={
            {
              // useAsyncDataSource,
              // queryRegionsList,
              // queryProductList,
              // queryAliyunProductList,
            }
          }
        />
      </Form>
    </Modal>
  );
};
export default Save;

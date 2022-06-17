import { Modal } from 'antd';
import { useIntl } from 'umi';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/rule-engine/Instance';
import type { InstanceItem } from '../typings';
import { onlyMessage } from '@/utils/util';

interface Props {
  data: Partial<InstanceItem>;
  close: () => void;
}

const Save = (props: Props) => {
  const intl = useIntl();

  const [data, setData] = useState<Partial<InstanceItem>>(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const form = createForm({
    validateFirst: true,
    initialValues: data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
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
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'name',
        'x-component-props': {
          placeholder: '请输入名称',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入名称',
          },
        ],
      },
      description: {
        title: '说明',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 5,
          placeholder: '请输入说明',
        },
        'x-validator': [
          {
            max: 200,
            message: '最多可输入200个字符',
          },
        ],
      },
    },
  };

  const save = async () => {
    const value = await form.submit<InstanceItem>();
    let response = undefined;
    if (!props.data?.id) {
      response = await service.saveRule(value);
    } else {
      response = await service.modify(props.data.id, { ...props.data, ...value });
    }
    if (response.status === 200) {
      onlyMessage(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功',
        }),
      );
      props.close();
    } else {
      onlyMessage('操作失败！', 'error');
    }
  };

  return (
    <Modal
      title={props.data?.id ? '编辑' : '新增'}
      visible
      onCancel={props.close}
      onOk={save}
      width="35vw"
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

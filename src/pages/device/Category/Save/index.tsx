import {
  ArrayTable,
  Editable,
  Form,
  FormGrid,
  FormItem,
  FormTab,
  Input,
  NumberPicker,
  Password,
  Select,
  Switch,
  Upload,
} from '@formily/antd';
import React from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import FUpload from '@/components/Upload';
import * as ICONS from '@ant-design/icons';
import { Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import type { CategoryItem } from '@/pages/visualization/Category/typings';

interface Props {
  visible: boolean;
  close: () => void;
  data: Partial<CategoryItem>;
}

const Save = (props: Props) => {
  const intl = useIntl();

  const form = createForm({
    validateFirst: true,
    initialValues: props.data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormTab,
      Input,
      Password,
      Upload,
      Select,
      ArrayTable,
      Switch,
      FormGrid,
      Editable,
      NumberPicker,
      FUpload,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const save = () => {};

  const schema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: 'ID',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
        name: 'id',
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
        name: 'name',
      },
      key: {
        title: intl.formatMessage({
          id: 'pages.device.category.key',
          defaultMessage: '标识',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
        name: 'name',
      },
      description: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '描述信息',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 3,
        },
        name: 'description',
      },
    },
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.add`,
        defaultMessage: '编辑',
      })}
      visible={props.visible}
      onCancel={() => props.close()}
      onOk={save}
    >
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Save;

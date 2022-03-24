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
import { message, Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import type { CategoryItem } from '@/pages/visualization/Category/typings';
import { service, state } from '@/pages/device/Category';
import type { Response } from '@/utils/typings';

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

  const save = async () => {
    const value: CategoryItem = await form.submit();
    if (!!state.parentId) {
      value.parentId = state.parentId;
    }
    const resp = props.data.id
      ? await service.update(value as CategoryItem)
      : ((await service.save(value as any)) as Response<CategoryItem>);
    if (resp.status === 200) {
      message.success('操作成功!');
    } else {
      message.error('操作失败');
    }
    props.close();
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      // parentId: {
      //   title: '上级分类',
      //   'x-decorator': 'FormItem',
      //   'x-component': 'Input',
      //   name: 'parentId',
      //   'x-disabled': true,
      //   'x-visible': !!state.parentId,
      //   'x-value': state.parentId,
      // },
      // id: {
      //   title: 'ID',
      //   'x-decorator': 'FormItem',
      //   'x-component': 'Input',
      //   required: true,
      //   name: 'id',
      //   'x-disabled': !!props.data.id,
      // },
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
      sortIndex: {
        title: intl.formatMessage({
          id: 'pages.device.category.sortIndex',
          defaultMessage: '排序',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        name: 'sortIndex',
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
      maskClosable={false}
      title={intl.formatMessage({
        id: `pages.data.option.${props.data.id ? 'edit' : 'add'}`,
        defaultMessage: '新增',
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

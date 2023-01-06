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
import React, { useState } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import FUpload from '@/components/Upload';
import * as ICONS from '@ant-design/icons';
import { Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { service, state } from '@/pages/device/Category';
import type { Response } from '@/utils/typings';
import { onlyMessage } from '@/utils/util';

interface Props {
  visible: boolean;
  close: () => void;
  data: Partial<CategoryItem>;
  reload?: () => void;
}

const Save = (props: Props) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const resp = props.data.id
      ? await service.update(value as CategoryItem)
      : ((await service.save(value as any)) as Response<CategoryItem>);
    if (resp.status === 200) {
      onlyMessage('操作成功');
      if (props.reload) {
        props.reload();
      }
    } else {
      onlyMessage('操作失败', 'error');
    }
    setLoading(false);
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
        name: 'name',
      },
      sortIndex: {
        title: '排序',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-component-props': {
          placeholder: '请输入排序',
          min: 1,
        },
        name: 'sortIndex',
        'x-validator': [
          {
            format: 'integer',
            message: '请输入正整数',
          },
        ],
      },
      description: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '说明',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 3,
          placeholder: '请输入说明',
          showCount: true,
          maxLength: 200,
        },
        name: 'description',
      },
    },
  };

  return (
    <Modal
      maskClosable={false}
      title={`${!props.data.id ? '新增' : '编辑'}${state.parentId ? '子分类' : '分类'}`}
      visible={props.visible}
      onCancel={() => props.close()}
      onOk={save}
      confirmLoading={loading}
    >
      <Form layout={'vertical'} form={form}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Save;

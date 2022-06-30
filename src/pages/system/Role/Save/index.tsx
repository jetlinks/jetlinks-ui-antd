import { useIntl } from 'umi';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/system/Role';
import { Modal } from '@/components';
import { onlyMessage } from '@/utils/util';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';

interface Props {
  model: 'add' | 'edit' | 'query';
  close: () => void;
}

const Save = (props: Props) => {
  const { model } = props;
  const intl = useIntl();

  const history = useHistory();

  const form = createForm({
    validateFirst: true,
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
          defaultMessage: '角色名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-decorator-props': {},
        name: 'name',
        required: true,
        'x-component-props': {
          placeholder: '请输入角色名称',
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
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '描述',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          checkStrength: true,
          placeholder: '请输入说明',
        },
        'x-decorator-props': {},
        name: 'password',
        required: false,
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
    const value = await form.submit<RoleItem>();
    const response: any = await service.save(value);
    if (response.status === 200) {
      onlyMessage(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功',
        }),
      );
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(response.result);
        setTimeout(() => window.close(), 300);
      } else {
        history.push(
          `${getMenuPathByParams(MENUS_CODE['system/Role/Detail'], response.result.id)}`,
        );
      }
      props.close();
    } else {
      onlyMessage('操作失败！', 'error');
    }
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.${model}`,
        defaultMessage: '编辑',
      })}
      maskClosable={false}
      visible={model !== 'query'}
      onCancel={props.close}
      onOk={save}
      width="35vw"
      permissionCode={'system/Role'}
      permission={['add']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

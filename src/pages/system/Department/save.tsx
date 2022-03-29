// Modal 弹窗，用于新增、修改数据
import React from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
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
  Checkbox,
  TreeSelect,
} from '@formily/antd';
import { message, Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import type { ModalProps } from 'antd/lib/modal/Modal';
import FUpload from '@/components/Upload';
import * as ICONS from '@ant-design/icons';
import type BaseService from '@/utils/BaseService';

export interface SaveModalProps<T> extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  service: BaseService<T>;
  data?: Partial<T>;
  /**
   * Model关闭事件
   * @param type 是否为请求接口后关闭，用于外部table刷新数据
   */
  onCancel?: (type: boolean, id?: React.Key) => void;
  schema: ISchema;
}

const Save = <T extends object>(props: SaveModalProps<T>) => {
  const { data, schema, onCancel, service } = props;
  const intl = useIntl();

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
      Checkbox,
      TreeSelect,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const form = createForm({
    validateFirst: true,
    initialValues: data || {},
  });

  /**
   * 关闭Modal
   * @param type 是否需要刷新外部table数据
   * @param id 传递上级部门id，用于table展开父节点
   */
  const modalClose = (type: boolean, id?: string) => {
    if (typeof onCancel === 'function') {
      onCancel(type, id);
    }
  };

  /**
   * 新增、修改数据
   */
  const saveData = async () => {
    const formData: T = await form.submit();

    const response =
      data && 'id' in data ? await service.update(formData) : await service.save(formData);

    if (response.status === 200) {
      message.success('操作成功！');
      modalClose(true, response.result.parentId);
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(response.result);
        setTimeout(() => window.close(), 300);
      }
    } else {
      message.error('操作成功！');
    }
  };

  return (
    <Modal
      title={
        props.title
          ? props.title
          : intl.formatMessage({
              id: `pages.data.option.${data && 'id' in data ? 'edit' : 'add'}`,
              defaultMessage: '新增',
            })
      }
      maskClosable={false}
      visible={props.visible}
      onOk={saveData}
      onCancel={() => {
        modalClose(false);
      }}
    >
      <Form form={form} layout={'vertical'}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Save;

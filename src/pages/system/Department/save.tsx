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
  onCancel?: (type: boolean) => void;
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
   */
  const modalClose = (type: boolean) => {
    if (typeof onCancel === 'function') {
      onCancel(type);
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
      modalClose(true);
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
      title={props.title ? props.title : intl.formatMessage({
        id: `pages.data.option.${data && 'id' in data ? 'edit' : 'add'}`,
        defaultMessage: '新增',
      })}
      visible={props.visible}
      onOk={saveData}
      onCancel={() => {
        modalClose(false);
      }}
    >
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Save;

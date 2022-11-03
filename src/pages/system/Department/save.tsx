// Modal 弹窗，用于新增、修改数据
import React, { useState } from 'react';
import { createForm, Field, onFieldReact } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  ArrayTable,
  Checkbox,
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
  TreeSelect,
  Upload,
} from '@formily/antd';
import { Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import type { ModalProps } from 'antd/lib/modal/Modal';
import FUpload from '@/components/Upload';
import * as ICONS from '@ant-design/icons';
import type BaseService from '@/utils/BaseService';
import { onlyMessage } from '@/utils/util';

export interface SaveModalProps<T> extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  service: BaseService<T>;
  data?: Partial<T>;
  reload?: (pId: string) => void;
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
  const [loading, setLoading] = useState(false);

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

  const findItemById = (id: string, options: any[] = []): any | undefined => {
    let _item;
    options.some((item) => {
      if (id === item.id) {
        _item = item;
        return true;
      }
      if (item.children) {
        _item = findItemById(id, item.children);
        return !!_item;
      }
      return false;
    });

    return _item;
  };

  const form = createForm({
    validateFirst: true,
    initialValues: data || {},
    effects() {
      onFieldReact('parentId', (typeFiled, f) => {
        const isModified = (typeFiled as Field).modified;
        if (isModified) {
          const pId = (typeFiled as Field).value;
          const options = (typeFiled as Field).getState().dataSource;
          const item = findItemById(pId, options);
          if (item) {
            if (item.children && item.children.length) {
              f.setFieldState(typeFiled.query('.sortIndex'), async (state) => {
                state.value = item.children[item.children.length - 1].sortIndex + 1;
              });
            } else {
              f.setFieldState(typeFiled.query('.sortIndex'), async (state) => {
                state.value = 1;
              });
            }
          }
        }
      });
    },
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
    setLoading(true);
    const response =
      data && 'id' in data ? await service.update(formData) : await service.save(formData);
    setLoading(false);
    if (response.status === 200) {
      onlyMessage('操作成功！');
      modalClose(true, response.result.parentId);
      if (props.reload) {
        props.reload(response.result.parentId);
      }
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(response.result);
        setTimeout(() => window.close(), 300);
      }
    } else {
      onlyMessage('操作失败！', 'error');
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
      confirmLoading={loading}
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

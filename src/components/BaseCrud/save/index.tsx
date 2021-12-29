import React, { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import {
  NumberPicker,
  Editable,
  Form,
  FormItem,
  Input,
  Password,
  Upload,
  PreviewText,
  FormTab,
  Select,
  ArrayTable,
  Switch,
  FormGrid,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import * as ICONS from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import type BaseService from '@/utils/BaseService';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { CurdModel } from '@/components/BaseCrud/model';
import type { ISchemaFieldProps } from '@formily/react/lib/types';
import type { ModalProps } from 'antd/lib/modal/Modal';
import FUpload from '@/components/Upload';
import FMonacoEditor from '@/components/FMonacoEditor';

interface Props<T> {
  schema: ISchema;
  service: BaseService<T>;
  reload: () => void;
  schemaConfig?: ISchemaFieldProps;
  modelConfig?: ModalProps;
}

const Save = <T extends Record<string, any>>(props: Props<T>) => {
  const intl = useIntl();
  const { service, schema, reload, schemaConfig, modelConfig } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<T>();
  const [model, setModel] = useState<'edit' | 'add' | 'preview'>('edit');

  useEffect(() => {
    const visibleSubscription = Store.subscribe(SystemConst.BASE_CURD_MODAL_VISIBLE, setVisible);
    const dataSubscription = Store.subscribe(SystemConst.BASE_CURD_CURRENT, setCurrent);
    const modelSubscription = Store.subscribe(SystemConst.BASE_CURD_MODEL, setModel);
    return () => {
      visibleSubscription.unsubscribe();
      dataSubscription.unsubscribe();
      modelSubscription.unsubscribe();
    };
  }, [current]);

  const form = createForm({
    validateFirst: true,
    initialValues: current,
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
      FMonacoEditor,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const save = async () => {
    const values: T = await form.submit();
    await service.update(values);
    message.success(
      intl.formatMessage({
        id: 'pages.data.option.success',
        defaultMessage: '操作成功',
      }),
    );
    CurdModel.close();
    reload();
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.${model}`,
        defaultMessage: '编辑',
      })}
      visible={visible}
      onCancel={CurdModel.close}
      onOk={save}
      {...modelConfig}
    >
      <PreviewText.Placeholder value="-">
        <Form form={form} labelCol={5} wrapperCol={16}>
          <SchemaField schema={schema} {...schemaConfig} />
        </Form>
      </PreviewText.Placeholder>
    </Modal>
  );
};

export default Save;

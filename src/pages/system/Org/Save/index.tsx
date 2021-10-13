import { message, Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { NumberPicker, Form, Input, FormItem } from '@formily/antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import OrgModel from '@/pages/system/Org/model';
import { service } from '@/pages/system/Org';

interface Props {
  refresh?: () => void;
  visible: boolean;
}

const Save = (props: Props) => {
  const intl = useIntl();
  const form = createForm({
    initialValues: OrgModel.current,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      NumberPicker,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      code: {
        title: intl.formatMessage({
          id: 'pages.system.org.encoding',
          defaultMessage: '编码',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'id',
        required: true,
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'name',
        required: true,
      },
      sortIndex: {
        title: intl.formatMessage({
          id: 'pages.system.org.add.orderNumber',
          defaultMessage: '序号',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        name: 'name',
        required: true,
      },
      describe: {
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '描述',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        name: 'describe',
      },
    },
  };

  const save = async () => {
    const data: Record<string, unknown> = await form.submit!();
    await service.update({ ...data, parentId: OrgModel.parentId });
    message.success('保存成功');
    OrgModel.closeEdit();
    props.refresh?.();
  };

  return (
    <Modal
      onOk={() => save()}
      title={`${OrgModel.parentId ? '添加下级' : '编辑'}`}
      visible={props.visible}
      onCancel={() => {
        OrgModel.closeEdit();
        props.refresh?.();
      }}
    >
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;

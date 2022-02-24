import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Checkbox } from '@formily/antd';
import { message, Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import type { ModalProps } from 'antd/lib/modal/Modal';
import { useParams } from 'umi';
import Service from './service';

type PermissionType = 'device' | 'product' | 'deviceCategory';

export interface PerModalProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  type: PermissionType;
  bindKeys: string[];
  visible: boolean;
  /**
   * Model关闭事件
   * @param type 是否为请求接口后关闭，用于外部table刷新数据
   */
  onCancel?: (type: boolean) => void;
}

const service = new Service('assets');

export default (props: PerModalProps) => {
  const intl = useIntl();
  const params = useParams<{ id: string }>();

  const SchemaField = createSchemaField({
    components: {
      Form,
      FormItem,
      Checkbox,
    },
  });

  const form = createForm({
    validateFirst: true,
    initialValues: {},
  });

  /**
   * 关闭Modal
   * @param type 是否需要刷新外部table数据
   */
  const modalClose = (type: boolean) => {
    if (typeof props.onCancel === 'function') {
      props.onCancel(type);
    }
  };

  const saveData = async () => {
    const formData: any = await form.submit();
    service
      .bind(props.type, [
        {
          targetType: 'org',
          targetId: params.id,
          assetType: props.type,
          assetIdList: props.bindKeys,
          permission: formData.permission,
        },
      ])
      .subscribe({
        next: () => message.success('操作成功'),
        error: () => message.error('操作失败'),
        complete: () => {
          modalClose(true);
        },
      });
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      permission: {
        type: 'array',
        title: '资产权限',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox.Group',
        enum: [
          { label: '查看', value: 'read', disabled: true },
          { label: '编辑', value: 'save' },
          { label: '删除', value: 'delete' },
        ],
        'x-value': ['read']
      },
    },
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.`,
        defaultMessage: '资产权限',
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

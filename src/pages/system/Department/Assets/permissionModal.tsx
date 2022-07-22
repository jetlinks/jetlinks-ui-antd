import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Checkbox } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import type { ModalProps } from 'antd/lib/modal/Modal';
import Service from './service';
import { forwardRef, useImperativeHandle } from 'react';
import { onlyMessage } from '@/utils/util';

type PermissionType = 'device' | 'product' | 'deviceCategory';

export interface PerModalProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  type: PermissionType;
  parentId: string;
  bindKeys: string[];
  /**
   * Model关闭事件
   * @param type 是否为请求接口后关闭，用于外部table刷新数据
   */
  onCancel?: (type: boolean) => void;
}

const service = new Service('assets');

const Permission = forwardRef((props: PerModalProps, ref) => {
  const SchemaField = createSchemaField({
    components: {
      Form,
      FormItem,
      Checkbox,
    },
  });

  const form = createForm({
    validateFirst: true,
    initialValues: {
      permission: ['read']
    },
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
    console.log(formData)
    service
      .bind(props.type, [
        {
          targetType: 'org',
          targetId: props.parentId,
          assetType: props.type,
          assetIdList: props.bindKeys,
          permission: formData.permission,
        },
      ])
      .subscribe({
        next: () => onlyMessage('操作成功'),
        error: () => onlyMessage('操作失败', 'error'),
        complete: () => {
          modalClose(true);
        },
      });
  };

  useImperativeHandle(ref, () => ({
    saveData,
  }));

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
        required: true,
      },
    },
  };

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    </div>
  );
});

export default Permission;

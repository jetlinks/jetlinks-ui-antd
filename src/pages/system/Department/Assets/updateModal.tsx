import { Modal, Form, Checkbox } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Server from './service';
import { service } from '@/pages/system/Department/Assets/product';
import { onlyMessage } from '@/utils/util';

interface UpdateModalProps {
  id: string | string[];
  type: string;
  targetId: string;
  visible: boolean;
  permissions: string[];
  onCancel: () => void;
  onReload: () => void;
  assetsType: string[];
}
const server = new Server();
export default (props: UpdateModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const saveData = useCallback(async () => {
    const data = form.getFieldsValue();
    if (data) {
      setLoading(true);
      if (Array.isArray(props.id)) {
        const _data = (props.id as string[]).map((item) => ({
          targetType: 'org',
          targetId: props.targetId,
          assetType: props.type,
          assetIdList: [item],
          permission: data.permissions,
        }));
        service.bind('product', _data).subscribe({
          next: () => onlyMessage('操作成功'),
          error: () => onlyMessage('操作失败', 'error'),
          complete: () => {
            setLoading(false);
            props.onCancel();
            props.onReload();
          },
        });
      } else {
        const res = await server.updatePermission(
          props.type,
          props.id as string,
          props.targetId,
          data.permissions,
        );
        setLoading(false);
        if (res.status === 200 && props.onReload) {
          props.onCancel();
          props.onReload();
        }
      }
    }
  }, [props.id]);

  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        permissions: props.permissions,
      });
    }
  }, [props.permissions, form]);

  return (
    <Modal
      title={'编辑'}
      visible={props.visible}
      width={500}
      onCancel={props.onCancel}
      onOk={saveData}
      confirmLoading={loading}
    >
      <Form form={form}>
        <Form.Item name="permissions" label="资产权限" required>
          <Checkbox.Group options={props.assetsType} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

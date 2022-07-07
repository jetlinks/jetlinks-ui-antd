import { Modal, Form, Checkbox } from 'antd';
import { useCallback, useEffect } from 'react';
import Server from './service';

interface UpdateModalProps {
  id: string;
  type: string;
  targetId: string;
  visible: boolean;
  permissions: string[];
  onCancel: () => void;
  onReload: () => void;
}
const server = new Server();
export default (props: UpdateModalProps) => {
  const [form] = Form.useForm();

  const saveData = useCallback(async () => {
    const data = form.getFieldsValue();
    if (data) {
      const res = await server.updatePermission(
        props.type,
        props.id,
        props.targetId,
        data.permissions,
      );
      if (res.status === 200 && props.onReload) {
        props.onCancel();
        props.onReload();
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
    >
      <Form form={form}>
        <Form.Item name="permissions" label="资产权限" required>
          <Checkbox.Group
            options={[
              { label: '查看', value: 'read', disabled: true },
              { label: '编辑', value: 'save' },
              { label: '删除', value: 'delete' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

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
  const [options, setOptions] = useState<any>([]);

  const saveData = useCallback(async () => {
    const data = form.getFieldsValue();
    if (data) {
      setLoading(true);
      if (Array.isArray(props.id)) {
        const resp = await service.updateAll(props.type, 'org', props.targetId, [
          {
            assetIdList: props.id,
            permission: data.permissions,
          },
        ]);
        setLoading(false);
        if (resp.status === 200) {
          props.onCancel();
          props.onReload();
          onlyMessage('操作成功', 'success');
        }
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
          onlyMessage('操作成功', 'success');
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
    // console.log('1------------', props.assetsType)
    // console.log('2------------', props.permissions)
    const item = props.assetsType.filter((it: any) => props.permissions.indexOf(it.value) > -1);
    setOptions(item);
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
          <Checkbox.Group options={options} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form } from 'antd';
import { useLocation } from 'umi';
import { useEffect } from 'react';
import { PermissionButton } from '@/components';
import ActionItems from './action/action';
import { PlusOutlined } from '@ant-design/icons';
import TriggerTerm from '@/pages/rule-engine/Scene/TriggerTerm';

export default () => {
  const location = useLocation();
  const [form] = Form.useForm();

  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');

  const getDetail = async () => {
    // TODO 回显数据
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      getDetail();
    }
  }, [location]);

  const saveData = async () => {
    const formData = await form.validateFields();
    console.log(formData);
  };

  return (
    <PageContainer>
      <Card>
        <Form form={form} autoComplete="off">
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <ActionItems
                    key={key}
                    restField={restField}
                    onRemove={() => remove(name)}
                    name={name}
                  />
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    新增
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <PermissionButton isPermission={getOtherPermission(['add', 'update'])} onClick={saveData}>
          保存
        </PermissionButton>
      </Card>
      <Card>
        <TriggerTerm />
      </Card>
    </PageContainer>
  );
};

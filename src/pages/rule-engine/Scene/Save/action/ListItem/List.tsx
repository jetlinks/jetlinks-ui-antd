import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddButton } from '../../components/Buttons';
import { Item } from './index';

export default () => {
  const [form] = Form.useForm();

  return (
    <div className="action-list-content">
      <Form form={form} colon={false} layout={'vertical'} preserve={false} name="actions">
        <Form.List name="actions">
          {(fields, { add, remove }) => (
            <div className="actions-list_form">
              {fields.length ? (
                fields.map(({ key, name, ...resetField }) => (
                  <Item key={key} name={name} resetField={resetField} remove={remove} />
                ))
              ) : (
                <AddButton>点击配置动作</AddButton>
              )}
              <div className="action-list-add">
                <Button type="primary" onClick={add} ghost icon={<PlusOutlined />}>
                  新增
                </Button>
              </div>
            </div>
          )}
        </Form.List>
      </Form>
    </div>
  );
};

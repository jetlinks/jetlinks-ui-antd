import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Item from './Item';

export default () => {
  const [form] = Form.useForm();

  return (
    <div className="action-list-content">
      <Form form={form} colon={false} layout={'vertical'} preserve={false} name="actions">
        <Form.List name="actions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...resetField }) => (
                <Item key={key} name={name} resetField={resetField} remove={remove} />
              ))}
              <div className="action-list-add">
                <Button type="primary" onClick={add} ghost icon={<PlusOutlined />}>
                  新增
                </Button>
              </div>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
};

import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Item } from './index';
import type { ItemType } from './Item';
import './index.less';

interface PropsType {
  type: ItemType;
}

export default (props: PropsType) => {
  const [form] = Form.useForm();

  return (
    <div className="action-list-content">
      <Form form={form} colon={false} layout={'vertical'} preserve={false} name="actions">
        <Form.List name="actions" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <div className="actions-list_form">
              {fields.map(({ key, name, ...resetField }) => (
                <Item
                  key={key}
                  name={name}
                  resetField={resetField}
                  remove={remove}
                  type={props.type}
                />
              ))}
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

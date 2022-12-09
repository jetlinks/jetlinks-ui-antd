import Action from '../action';
import { Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import { Form, FormInstance } from 'antd';
interface Props {
  form: FormInstance;
}

export default (props: Props) => {
  return (
    <div>
      <Observer>
        {() => (
          <Form.Item
            name={['branches', 0, 'then']}
            rules={[
              {
                validator(_, v) {
                  if (v && !v.length) {
                    return Promise.reject('至少配置一个执行动作');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Action
              thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
              name={0}
              onAdd={(data) => {
                if (FormModel.current.branches && data) {
                  const newThen = [...FormModel.current.branches[0].then, data];
                  FormModel.current.branches[0].then = newThen;
                  props.form.setFieldValue(['branches', 0, 'then'], newThen);
                  props.form.validateFields(['branches', 0, 'then']);
                }
              }}
              onUpdate={(data, type) => {
                const indexOf = FormModel.current.branches![0].then.findIndex(
                  (item) => item.parallel === type,
                );
                if (indexOf !== -1) {
                  if (data.actions?.length) {
                    FormModel.current.branches![0].then[indexOf] = data;
                  } else {
                    FormModel.current.branches![0].then = [];
                  }
                  props.form.setFieldValue(
                    ['branches', 0, 'then'],
                    FormModel.current.branches![0].then,
                  );
                }
              }}
            />
          </Form.Item>
        )}
      </Observer>
    </div>
  );
};

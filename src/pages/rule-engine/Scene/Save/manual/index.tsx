import Action from '../action';
import { Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import { Form } from 'antd';

export default () => {
  return (
    <div>
      <Observer>
        {() => (
          <Form.Item
            name={['branches', 0, 'then']}
            rules={[
              {
                validator(_, v) {
                  console.log(v);
                  if (!v || (v && !v.length)) {
                    return Promise.reject('至少配置一个执行动作');
                  } else {
                    let isActions = false;
                    v.forEach((item: any) => {
                      if (item.actions && item.actions.length) {
                        isActions = true;
                      }
                    });
                    return isActions ? Promise.resolve() : Promise.reject('至少配置一个执行动作');
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
                    FormModel.current.branches![0].then[indexOf].actions = [];
                  }
                }
              }}
            />
          </Form.Item>
        )}
      </Observer>
    </div>
  );
};

import type { ReactChild } from 'react';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import { Observer, observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import TimerTrigger from './TimerTrigger';
import Action from '../action';
import classNames from 'classnames';
import { Form, FormInstance } from 'antd';
import { TitleComponent } from '@/components';

interface Props {
  form: FormInstance;
}

export default observer((props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleLabel = (options: any): ReactChild | ReactChild[] => {
    if (!options || !Object.keys(options).length) return '点击配置定时触发规则';

    const _label = [];
    if (options.when) {
      _label.push(<span className="trigger-options-when">{options.when}</span>);
    }
    if (options.time) {
      _label.push(<span className="trigger-options-time">{options.time}</span>);
    }
    if (options.extraTime) {
      _label.push(<span className="trigger-options-extraTime">{options.extraTime}</span>);
    }
    return _label;
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div>
        <Observer>
          {() => {
            const label = handleLabel(FormModel.current.options?.trigger);
            return (
              <Form.Item
                label={<TitleComponent style={{ fontSize: 14 }} data={'触发规则'} />}
                name={'timer'}
                rules={[
                  {
                    validator(_, v) {
                      if (!v) {
                        return Promise.reject(new Error('请配置定时触发规则'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <AddButton
                  style={{ width: '100%' }}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <div
                    className={classNames('trigger-options-content', {
                      'is-add': !!Object.keys(FormModel.current.options?.trigger || {}).length,
                    })}
                  >
                    {label}
                  </div>
                </AddButton>
              </Form.Item>
            );
          }}
        </Observer>
      </div>
      <div>
        <Observer>
          {() => (
            <Form.Item
              name={['branches', 0, 'then']}
              rules={[
                {
                  validator(_, v) {
                    if (!v || (v && !v.length)) {
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
      {visible && (
        <TimerTrigger
          data={FormModel.current.trigger?.timer}
          save={(data, options) => {
            setVisible(false);
            FormModel.current.options!['trigger'] = options;
            FormModel.current.trigger!.timer = data;
            props.form.setFieldValue('timer', data);
            props.form.validateFields(['timer']);
          }}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
});

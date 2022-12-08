import type { ReactChild } from 'react';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import { Observer, observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import TimerTrigger from './TimerTrigger';
import Action from '../action';
import classNames from 'classnames';

export default observer(() => {
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <Observer>
          {() => {
            const label = handleLabel(FormModel.current.options?.trigger);
            return (
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
            );
          }}
        </Observer>
      </div>
      <div>
        <Observer>
          {() => (
            <Action
              thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
              name={0}
              onAdd={(data) => {
                if (FormModel.current.branches) {
                  FormModel.current.branches[0].then.push(data);
                }
              }}
              onUpdate={(data, type) => {
                const indexOf = FormModel.current.branches![0].then.findIndex(
                  (item) => item.parallel === type,
                );
                if (indexOf !== -1) {
                  FormModel.current.branches![0].then[indexOf] = data;
                }
              }}
            />
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
          }}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
});

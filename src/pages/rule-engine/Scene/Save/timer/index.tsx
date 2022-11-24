import type { ReactChild } from 'react';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import { Observer, observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import TimerTrigger from './TimerTrigger';
import Action from '../action';

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
            console.log(FormModel.options);

            const label = handleLabel(FormModel.options);
            return (
              <AddButton
                style={{ width: '100%' }}
                onClick={() => {
                  setVisible(true);
                }}
              >
                <div className="trigger-options-content">{label}</div>
              </AddButton>
            );
          }}
        </Observer>
      </div>
      <div>
        <Action />
      </div>
      {visible && (
        <TimerTrigger
          data={FormModel.trigger?.timer}
          save={(data, options) => {
            setVisible(false);
            FormModel['options'] = options;
            FormModel.trigger!.timer = data;
          }}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
});

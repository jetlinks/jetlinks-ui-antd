import type { ReactChild } from 'react';
import Terms from '@/pages/rule-engine/Scene/Save/terms';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import { Observer, observer } from '@formily/react';
import AddModel from './addModel';
import { FormModel } from '@/pages/rule-engine/Scene/Save';

export default observer(() => {
  const [visible, setVisible] = useState(false);

  const handleLabel = (options: any): ReactChild | ReactChild[] => {
    if (!options || !Object.keys(options).length) return '点击配置设备触发';

    const _label = [<span className="trigger-options-name">{options.name}</span>];
    if (!options.onlyName) {
      if (options.productName) {
        _label.push(<span className="trigger-options-type">{options.productName}</span>);
      }
      if (options.when) {
        _label.push(<span className="trigger-options-when">{options.when}</span>);
      }
      if (options.time) {
        _label.push(<span className="trigger-options-time">{options.time}</span>);
      }
      if (options.extraTime) {
        _label.push(<span className="trigger-options-extraTime">{options.extraTime}</span>);
      }
      if (options.action) {
        _label.push(<span className="trigger-options-action">{options.action}</span>);
      }
      if (options.type) {
        _label.push(<span className="trigger-options-type">{options.type}</span>);
      }
    }
    return _label;
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Observer>
          {() => {
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
      <Terms />
      {visible && (
        <AddModel
          value={FormModel.trigger?.device}
          onSave={(data, options) => {
            setVisible(false);
            FormModel['options'] = options;
            FormModel.trigger!.device = data;
          }}
          onCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
});

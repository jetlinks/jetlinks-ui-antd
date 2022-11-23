import Terms from '@/pages/rule-engine/Scene/Save/terms';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import AddModel from './addModel';

export default () => {
  const [visible, setVisible] = useState(false);
  const [label] = useState('点击配置设备触发');

  return (
    <div>
      <div>
        <AddButton
          style={{ width: '100%' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          {label}
        </AddButton>
      </div>
      <Terms />
      {visible && <AddModel />}
    </div>
  );
};

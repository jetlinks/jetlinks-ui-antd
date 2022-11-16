import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
import TimerTrigger from './TimerTrigger';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div style={{ marginLeft: 40 }}>
      <div
        style={{ width: 200 }}
        onClick={() => {
          setVisible(true);
        }}
      >
        <AddButton>点击配置定时触发规则</AddButton>
      </div>
      <div>执行动作</div>
      {visible && (
        <TimerTrigger
          data={{}}
          save={(data: any) => {
            console.log(data);
          }}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

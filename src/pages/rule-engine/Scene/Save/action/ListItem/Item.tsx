import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { useState } from 'react';
export type ItemType = 'serial' | 'parallel';
import Modal from '../Modal/add';
interface ItemProps {
  name: number;
  resetField: any;
  remove: (index: number | number[]) => void;
  type: ItemType;
}

export default (props: ItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div
      className="actions-item"
      onClick={() => {
        setVisible(true);
      }}
    >
      {props.name}
      <AddButton>点击配置执行动作</AddButton>
      {visible && <Modal />}
    </div>
  );
};

import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
export type ItemType = 'serial' | 'parallel';
interface ItemProps {
  name: number;
  resetField: any;
  remove: (index: number | number[]) => void;
  type: ItemType;
}

export default (props: ItemProps) => {
  return (
    <div className="actions-item">
      {props.name}
      <AddButton>点击配置执行动作</AddButton>
    </div>
  );
};

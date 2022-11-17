import { useState } from 'react';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import Modal from '../Modal/add';
import './index.less';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import Item from './Item';
import type { ParallelType } from './Item';
interface ListProps {
  type: ParallelType;
  actions: ActionsType[];
}

export default (props: ListProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="action-list-content">
      {props.actions.map((item, index) => (
        <Item name={index} data={item} type={props.type} key={item.key} />
      ))}
      <AddButton
        onClick={() => {
          setVisible(true);
          // const addItem: ActionsType = {
          //   executor: 'device',
          //   device: {
          //     selector: 'all',
          //     source: 'fixed'
          //   },
          //   key: `${props.type}_${props.actions.length}`
          // }

          // if (props.type === 'serial') {
          //   addItem.terms = []
          // }
          // console.log(addItem);

          // FormModel?.actions?.push(addItem)
        }}
      >
        点击配置执行动作
      </AddButton>
      {visible && <Modal />}
    </div>
  );
};

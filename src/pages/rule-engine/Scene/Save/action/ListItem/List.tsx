import { useEffect, useState } from 'react';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import Modal from '../Modal/add';
import './index.less';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import Item from './Item';
import type { ParallelType } from './Item';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
interface ListProps {
  type: ParallelType;
  actions: ActionsType[];
}

export default (props: ListProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [actions, setActions] = useState<ActionsType[]>(props.actions);

  useEffect(() => {
    setActions(props.actions);
  }, [props.actions]);

  return (
    <div className="action-list-content">
      {actions.map((item, index) => (
        <Item name={index} data={item} type={props.type} key={item.key} />
      ))}
      <AddButton
        onClick={() => {
          setVisible(true);
        }}
      >
        点击配置执行动作
      </AddButton>
      {visible && (
        <Modal
          name={props.actions.length + 1}
          data={{
            key: `${props.type}_${props.actions.length}`,
          }}
          close={() => {
            setVisible(false);
          }}
          save={(data: any) => {
            const { type, ...extra } = data;
            const item: ActionsType = {
              ...extra,
              executor: data.type === 'trigger' || data.type === 'relieve' ? 'alarm' : data.type,
              key: data.key,
              alarm: {
                mode: data.type,
              },
            };
            const index = FormModel?.actions.findIndex((i) => {
              return i.key === item.key ? item : i;
            });
            FormModel.actions[index] = { ...item };
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

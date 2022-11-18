import { useState } from 'react';
import Modal from '../Modal/add';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import { DeleteOutlined } from '@ant-design/icons';
import { FormModel } from '@/pages/rule-engine/Scene/Save';

export enum ParallelEnum {
  'parallel' = 'parallel',
  'serial' = 'serial',
}

export type ParallelType = keyof typeof ParallelEnum;
interface ItemProps {
  name: number;
  data: ActionsType;
  type: ParallelType;
}

export default (props: ItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <div className="actions-item">
        <div className="item-options-warp">
          <div className="type">
            <img src="" />
          </div>
          <div
            onClick={() => {
              setVisible(true);
            }}
          >
            {'item'}
          </div>
        </div>
        <div className="item-number">{props.name + 1}</div>
        <div
          className="item-delete"
          onClick={() => {
            const indexOf = FormModel.actions.findIndex((item) => item.key === props.data.key);
            if (props.data.key && indexOf !== -1) {
              FormModel.actions.splice(indexOf, 1);
            }
          }}
        >
          <DeleteOutlined />
        </div>
      </div>
      {visible && (
        <Modal
          name={props.name}
          data={props.data}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </>
  );
};

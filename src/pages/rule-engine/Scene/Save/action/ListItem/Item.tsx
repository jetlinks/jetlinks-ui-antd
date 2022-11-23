import { useState } from 'react';
import Modal from '../Modal/add';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import { DeleteOutlined } from '@ant-design/icons';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import './index.less';
import TriggerAlarm from '../TriggerAlarm';
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

const iconMap = new Map();
iconMap.set('alarm', require('/public/images/scene/action-alarm-icon.png'));

export default (props: ItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [triggerVisible, setTriggerVisible] = useState<boolean>(false);

  const contentRender = () => {
    if (props?.data?.alarm?.mode === 'trigger') {
      return (
        <div>
          满足条件后将触发关联
          <a
            onClick={() => {
              setTriggerVisible(true);
            }}
          >
            关联此场景的告警
          </a>
        </div>
      );
    } else if (props?.data?.alarm?.mode === 'relieve') {
      return (
        <div>
          满足条件后将解除关联
          <a
            onClick={() => {
              setTriggerVisible(true);
            }}
          >
            关联此场景的告警
          </a>
        </div>
      );
    }
    return '';
  };

  return (
    <div className="actions-item-warp">
      <div className="actions-item">
        <div className="item-options-warp">
          <div className="item-options-type">
            <img style={{ width: 48 }} src={iconMap.get(props?.data.executor)} />
          </div>
          <div className={'item-options-content'}>{contentRender()}</div>
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
      {props.type === 'serial' ? (
        props.data.terms?.length ? (
          <div></div>
        ) : (
          <div>添加过滤条件</div>
        )
      ) : null}
      {visible && (
        <Modal
          name={props.name}
          data={props.data}
          close={() => {
            setVisible(false);
          }}
          save={(data: ActionsType) => {
            console.log(data);
            setVisible(false);
          }}
        />
      )}
      {triggerVisible && (
        <TriggerAlarm
          close={() => {
            setTriggerVisible(false);
          }}
        />
      )}
    </div>
  );
};

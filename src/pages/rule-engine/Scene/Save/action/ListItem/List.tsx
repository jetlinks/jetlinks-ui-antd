import { useEffect, useState } from 'react';
import Modal from '../Modal/add';
import './index.less';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import Item from './Item';
import type { ParallelType } from './Item';
import { Observer } from '@formily/react';
import { pick } from 'lodash';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';

interface ListProps {
  branchesName: number;
  type: ParallelType;
  actions: ActionsType[];
  parallel: boolean;
  onAdd: (data: any) => void;
  onDelete: (key: string) => void;
}

export default (props: ListProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [actions, setActions] = useState<ActionsType[]>(props.actions);

  useEffect(() => {
    setActions(props.actions);
  }, [props.actions]);

  return (
    <div className="action-list-content">
      <Observer>
        {() => {
          return actions.map((item, index) => (
            <Item
              branchesName={props.branchesName}
              branchGroup={props.parallel ? 1 : 0}
              name={index}
              data={item}
              type={props.type}
              key={item.key}
              parallel={props.parallel}
              options={item.options}
              onDelete={() => {
                props.onDelete(item.key!);
              }}
              onUpdate={(data, options) => {
                const olData = pick(item, ['terms']);
                props.onAdd({
                  ...olData,
                  ...data,
                  options,
                });
                setVisible(false);
              }}
            />
          ));
        }}
      </Observer>
      <div className={classNames('actions-add-list', { border: actions.length })}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setVisible(true);
          }}
          type="primary"
          ghost
          style={{ width: '100%' }}
        >
          添加执行动作
        </Button>
      </div>

      {/*<AddButton*/}
      {/*  onClick={() => {*/}
      {/*    setVisible(true);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  点击配置执行动作*/}
      {/*</AddButton>*/}
      {visible && (
        <Modal
          // type={props.type}
          parallel={props.parallel}
          name={props.actions.length}
          branchGroup={props.parallel ? 1 : 0}
          branchesName={props.branchesName}
          data={{
            key: `${props.type}_${props.actions.length}`,
          }}
          close={() => {
            setVisible(false);
          }}
          save={(data: any, options) => {
            const { type, ...extra } = data;
            const item: ActionsType = {
              ...extra,
              key: data.key,
              options,
            };
            console.log('addModel', item);
            props.onAdd(item);
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

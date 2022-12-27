import { Collapse } from 'antd';
import { List } from './ListItem';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ShakeLimit from '../components/ShakeLimit';
import './index.less';
import { Observer } from '@formily/react';
import { get } from 'lodash';
import type { ShakeLimitType, BranchesThen } from '../../typings';
import { randomString } from '@/utils/util';
import { useEffect, useRef, useState } from 'react';

const { Panel } = Collapse;

interface ActionsProps {
  name: number;
  openShakeLimit?: boolean;
  thenOptions: BranchesThen[];
  onAdd: (data: BranchesThen) => void;
  onUpdate: (data: BranchesThen, type: boolean) => void;
  onChange?: (data?: BranchesThen[]) => void;
}

export default (props: ActionsProps) => {
  const [parallelArray, setParallelArray] = useState<BranchesThen[]>([]); // 并行行
  const [serialArray, setSerialArray] = useState<BranchesThen[]>([]); // 串行
  const [activeKeys, setActiveKey] = useState<any | any[]>(['1']);

  const [lock, setLock] = useState(false);
  const firstLockRef = useRef(true);

  useEffect(() => {
    const parallelArr = props.thenOptions.filter((item) => item.parallel);
    const serialArr = props.thenOptions.filter((item) => !item.parallel);
    setParallelArray(parallelArr);
    setSerialArray(serialArr);
    const isSerialActions = serialArr.some((item) => {
      return !!item.actions.length;
    });
    if (!lock && parallelArr.length && (!serialArr.length || !isSerialActions)) {
      setActiveKey(['2']);
      setLock(true);
    }
    if (!firstLockRef.current) {
      props.onChange?.(props.thenOptions);
    } else {
      firstLockRef.current = false;
    }
  }, [props.thenOptions]);

  return (
    <div className="actions">
      <div className="actions-title">
        <span>执行</span>
        {props.openShakeLimit ? (
          <Observer>
            {() => {
              const data: ShakeLimitType | undefined = get(FormModel.current.branches, [
                props.name!,
                'shakeLimit',
              ]);
              return (
                <ShakeLimit
                  enabled={data?.enabled}
                  time={data?.time}
                  threshold={data?.threshold}
                  alarmFirst={data?.alarmFirst}
                  onChange={(type, value) => {
                    data![type] = value;
                  }}
                />
              );
            }}
          </Observer>
        ) : null}
      </div>
      <div className="actions-warp">
        <Collapse activeKey={activeKeys} onChange={setActiveKey}>
          <Panel
            header={
              <span>
                串行
                <span className="panel-tip">
                  按顺序依次执行动作，适用于基于动作输出参数，判断是否执行后续动作的场景
                </span>
              </span>
            }
            key="1"
          >
            <div className="actions-list">
              <List
                branchesName={props.name}
                type="serial"
                parallel={false}
                actions={serialArray.length ? serialArray[0].actions : []}
                onAdd={(actionItem) => {
                  const newSerialArray = [...serialArray];
                  if (newSerialArray.length) {
                    const indexOf = newSerialArray[0].actions?.findIndex(
                      (aItem) => aItem.key === actionItem.key,
                    );
                    if (indexOf !== -1) {
                      newSerialArray[0].actions.splice(indexOf, 1, actionItem);
                    } else {
                      newSerialArray[0].actions.push(actionItem);
                    }
                    setSerialArray([...newSerialArray]);
                    props.onUpdate(newSerialArray[0], false);
                  } else {
                    actionItem.key = randomString();
                    props.onAdd({
                      parallel: false,
                      key: randomString(),
                      actions: [actionItem],
                    });
                  }
                }}
                onDelete={(key) => {
                  const aIndex = serialArray[0].actions?.findIndex((aItem) => aItem.key === key);
                  if (aIndex !== -1) {
                    serialArray[0].actions?.splice(aIndex, 1);
                    setSerialArray([...serialArray]);
                    props.onUpdate(serialArray[0], false);
                  }
                }}
              />
            </div>
          </Panel>
          <Panel
            header={
              <span>
                并行
                <span className="panel-tip">
                  同时执行所有动作，适用于不需要关注执行动作先后顺序和结果的场景
                </span>
              </span>
            }
            key="2"
          >
            <div className="actions-list">
              <List
                branchesName={props.name}
                type="parallel"
                parallel={true}
                actions={parallelArray.length ? parallelArray[0].actions : []}
                onAdd={(actionItem) => {
                  const newParallelArray = [...parallelArray];
                  if (newParallelArray.length) {
                    const indexOf = newParallelArray[0].actions?.findIndex(
                      (aItem) => aItem.key === actionItem.key,
                    );
                    if (indexOf !== -1) {
                      newParallelArray[0].actions.splice(indexOf, 1, actionItem);
                    } else {
                      newParallelArray[0].actions.push(actionItem);
                    }
                    setParallelArray([...newParallelArray]);
                    props.onUpdate(newParallelArray[0], true);
                  } else {
                    actionItem.key = randomString();
                    props.onAdd({
                      parallel: true,
                      key: randomString(),
                      actions: [actionItem],
                    });
                  }
                }}
                onDelete={(key) => {
                  const aIndex = parallelArray[0].actions?.findIndex((aItem) => aItem.key === key);
                  if (aIndex !== -1) {
                    parallelArray[0].actions?.splice(aIndex, 1);
                    setParallelArray([...parallelArray]);

                    props.onUpdate(parallelArray[0], true);
                  }
                }}
              />
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

import { Collapse } from 'antd';
import { List } from './ListItem';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ShakeLimit from '../components/ShakeLimit';
import './index.less';
import { Observer } from '@formily/react';
import { get, set } from 'lodash';
import type { ShakeLimitType, BranchesThen } from '../../typings';

const { Panel } = Collapse;

interface ActionsProps {
  name: number;
  openShakeLimit?: boolean;
  thenOptions: BranchesThen[];
}

export default (props: ActionsProps) => {
  return (
    <div className="actions">
      <div className="actions-title">
        <span>执行</span>
        {props.openShakeLimit ? (
          <Observer>
            {() => {
              const data: ShakeLimitType | undefined = get(FormModel.branches, [
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
        <Collapse defaultActiveKey={['1']}>
          <Panel
            header={
              <span>
                串行<span className="panel-tip">按顺序依次执行动作</span>
              </span>
            }
            key="1"
          >
            <div className="actions-list">
              <Observer>
                {() => {
                  const parallelThens = props.thenOptions.filter((item) => !item.parallel);
                  return (
                    <List
                      thenName={props.name}
                      type="serial"
                      parallel={false}
                      actions={parallelThens.length ? parallelThens[0].actions : []}
                      onAdd={(actionItem) => {
                        // console.log(parallelThens);
                        if (parallelThens[0]) {
                          if (
                            parallelThens[0].actions.some((aItem) => aItem.key === actionItem.key)
                          ) {
                            parallelThens[0].actions = parallelThens[0].actions.map((aItem) => {
                              if (aItem.key === actionItem.key) {
                                return actionItem;
                              }
                              return aItem;
                            });
                          } else {
                            parallelThens[0].actions.push(actionItem);
                          }
                          set(FormModel, ['branches', props.name, 'then'], parallelThens);
                        } else {
                          parallelThens.push({
                            parallel: false,
                            actions: [actionItem],
                          });
                          set(FormModel, ['branches', props.name, 'then'], parallelThens);
                        }
                      }}
                      onDelete={(_index) => {
                        parallelThens[0].actions.splice(_index, 1);
                        set(FormModel, ['branches', props.name, 'then'], parallelThens);
                      }}
                    />
                  );
                }}
              </Observer>
            </div>
          </Panel>
          <Panel
            header={
              <span>
                并行<span className="panel-tip">同时执行所有动作</span>
              </span>
            }
            key="2"
          >
            <div className="actions-list">
              <Observer>
                {() => {
                  const parallelThens = props.thenOptions.filter((item) => item.parallel);
                  return (
                    <List
                      thenName={props.name}
                      type="parallel"
                      parallel={true}
                      actions={parallelThens.length ? parallelThens[0].actions : []}
                      onAdd={(actionItem) => {
                        if (parallelThens[0]) {
                          if (
                            parallelThens[0].actions.some((aItem) => aItem.key === actionItem.key)
                          ) {
                            parallelThens[0].actions = parallelThens[0].actions.map((aItem) => {
                              if (aItem.key === actionItem.key) {
                                return actionItem;
                              }
                              return aItem;
                            });
                          } else {
                            parallelThens[0].actions.push(actionItem);
                          }
                          set(FormModel, ['branches', props.name, 'then'], parallelThens);
                        } else {
                          parallelThens.push({
                            parallel: true,
                            actions: [actionItem],
                          });
                          set(FormModel, ['branches', props.name, 'then'], parallelThens);
                        }
                      }}
                      onDelete={(_index) => {
                        parallelThens[0].actions.splice(_index, 1);
                        set(FormModel, ['branches', props.name, 'then'], parallelThens);
                      }}
                    />
                  );
                }}
              </Observer>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

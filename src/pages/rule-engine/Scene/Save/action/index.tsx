import { Collapse } from 'antd';
import { List } from './ListItem';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ShakeLimit from '../components/ShakeLimit';
import './index.less';
import { Observer } from '@formily/react';
import { get } from 'lodash';
import type { ShakeLimitType } from '../../typings';

const { Panel } = Collapse;

interface ActionsProps {
  name?: (string | number)[];
  openShakeLimit?: boolean;
}

export default (props: ActionsProps) => {
  return (
    <div className="actions">
      <div className="actions-title">
        <span>执行</span>
        {props.openShakeLimit ? (
          <Observer>
            {() => {
              const data: ShakeLimitType = get(FormModel, [...props.name!, 'shakeLimit']);
              return (
                <ShakeLimit
                  enabled={data.enabled}
                  time={data.time}
                  threshold={data.threshold}
                  alarmFirst={data.alarmFirst}
                  onChange={(type, value) => {
                    data[type] = value;
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
                {() => (
                  <List
                    type="serial"
                    actions={FormModel.actions.filter((item) => 'terms' in item)}
                  />
                )}
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
                {() => (
                  <List
                    type="parallel"
                    actions={FormModel.actions.filter((item) => !('terms' in item))}
                  />
                )}
              </Observer>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

import { Collapse } from 'antd';
import { List } from './ListItem';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import './index.less';
import { Observer } from '@formily/react';

const { Panel } = Collapse;

export default () => {
  return (
    <div className="actions">
      <div className="actions-title">执行</div>
      <div className="actions-warp">
        <Collapse defaultActiveKey={['1', '2']}>
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

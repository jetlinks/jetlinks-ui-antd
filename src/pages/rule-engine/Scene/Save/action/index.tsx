import { Collapse } from 'antd';

const { Panel } = Collapse;

export default () => {
  return (
    <div className="actions">
      <div className="actions-title">执行</div>
      <div className="actions-warp">
        <Collapse defaultActiveKey={['1']}>
          <Panel
            header={
              <span>
                串行<span>按顺序依次执行动作</span>
              </span>
            }
            key="1"
          >
            <div className="actions-list"></div>
          </Panel>
          <Panel
            header={
              <span>
                并行<span>同时执行所有动作</span>
              </span>
            }
            key="2"
          >
            <div className="actions-list"></div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

import { Modal, Button, Steps } from 'antd';
import React from 'react';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import NotifyWay from './NotifyWay';
import NotifyConfig from './NotifyConfig';
import NotifyTemplate from './NotifyTemplate';
import './index.less';
const initSteps = [
  {
    key: 'way',
    title: '通知方式',
    content: <NotifyWay />,
  },
  {
    key: 'config',
    title: '通知配置',
    content: <NotifyConfig />,
  },
  {
    key: 'template',
    title: '通知模板',
    content: <NotifyTemplate />,
  },
];

const NotifyModel = model<{
  steps: { key: string; title: string; content: React.ReactNode }[];
  current: number;
}>({
  steps: initSteps,
  current: 0,
});

export default observer(() => {
  const next = () => {
    NotifyModel.current += 1;
  };

  const prev = () => {
    NotifyModel.current -= 1;
  };

  return (
    <Modal
      title={'执行动作'}
      open
      width={1000}
      footer={
        <div className="steps-action">
          {NotifyModel.current === 0 && <Button onClick={() => {}}>取消</Button>}
          {NotifyModel.current < NotifyModel.steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {NotifyModel.current === NotifyModel.steps.length - 1 && (
            <Button type="primary" onClick={() => {}}>
              确定
            </Button>
          )}
          {NotifyModel.current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      }
    >
      <div className="steps-steps">
        <Steps current={NotifyModel.current} items={NotifyModel.steps} />
      </div>
      <div className="steps-content">{NotifyModel.steps[NotifyModel.current]?.content}</div>
    </Modal>
  );
});

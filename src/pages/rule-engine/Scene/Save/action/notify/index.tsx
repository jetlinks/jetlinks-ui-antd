import { observe } from '@formily/reactive';
import { Modal, Button, Steps } from 'antd';
import { useState } from 'react';

// const NotifyeModel = model<{
//   steps: <{title: string, content: ReactNode}>[]
// }>({
//   current: {}
// });

export default observe(() => {
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: '通知方式',
      content: 'First-content',
    },
    {
      title: '通知配置',
      content: 'Second-content',
    },
    {
      title: '通知模板',
      content: 'Last-content',
    },
  ];
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <Modal
      title={'执行动作'}
      open
      width={1000}
      footer={
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => {}}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      }
    >
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
    </Modal>
  );
});

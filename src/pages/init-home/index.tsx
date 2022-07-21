import { TitleComponent } from '@/components';
import { Collapse, Steps } from 'antd';
import styles from './index.less';

const InitHome = () => {
  const text = `
        A dog is a type of domesticated animal.
        Known for its loyalty and faithfulness,
        it can be found as a welcome guest in many households across the world.
    `;
  return (
    <div className={styles.init}>
      <TitleComponent data={'系统初始化'} />
      <div className={styles.box}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Steps direction="vertical" current={1} percent={60} style={{ height: '100%' }}>
              <Steps.Step />
              <Steps.Step />
              <Steps.Step />
              <Steps.Step />
            </Steps>
          </div>
          <div className={styles.right}>
            <Collapse defaultActiveKey={['1', '2', '3', '4']}>
              <Collapse.Panel header={<div>基本信息</div>} key="1">
                <p>{text}</p>
              </Collapse.Panel>
              <Collapse.Panel header="This is panel header 2" key="2">
                <p>{text}</p>
              </Collapse.Panel>
              <Collapse.Panel header="This is panel header 3" key="3">
                <p>{text}</p>
              </Collapse.Panel>
              <Collapse.Panel header="This is panel header 3" key="4">
                <p>{text}</p>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitHome;

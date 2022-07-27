import { TitleComponent } from '@/components';
import { Button, Collapse, Steps } from 'antd';
import styles from './index.less';
import Basis from './components/basis';
import Menu from './components/menu';
import Role from './components/role';
import Data from './components/data';
import Service from './service';

export const service = new Service();

const InitHome = () => {
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
              <Collapse.Panel
                header={
                  <div className={styles.collapseTitle}>
                    基本信息
                    <div className={styles.collapseDesc}>
                      配置平台名称、登录背景图、主题色等基本信息
                    </div>
                  </div>
                }
                key="1"
              >
                <Basis getData={() => {}} />
              </Collapse.Panel>
              <Collapse.Panel
                header={
                  <div className={styles.collapseTitle}>
                    菜单初始化<div className={styles.collapseDesc}>初始化菜单数据</div>
                  </div>
                }
                key="2"
              >
                <Menu />
              </Collapse.Panel>
              <Collapse.Panel
                header={
                  <div className={styles.collapseTitle}>
                    角色初始化<div className={styles.collapseDesc}>初始化内置角色与权限数据</div>
                  </div>
                }
                key="3"
              >
                <Role />
              </Collapse.Panel>
              <Collapse.Panel
                header={
                  <div className={styles.collapseTitle}>
                    初始数据<div className={styles.collapseDesc}>初始化设备接入示例数据</div>
                  </div>
                }
                key="4"
              >
                <Data isTrigger={false} onChange={() => {}} />
              </Collapse.Panel>
            </Collapse>
            <Button type="primary" style={{ marginTop: 20 }}>
              确认
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitHome;

import { TitleComponent } from '@/components';
import styles from './index.less';

const InitHome = () => {
  return (
    <div className={styles.init}>
      <TitleComponent data={'系统初始化'} />
      <div className={styles.box}>123</div>
    </div>
  );
};

export default InitHome;

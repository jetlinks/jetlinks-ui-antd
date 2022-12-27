import TabComponent from '@/pages/rule-engine/Alarm/Log/TabComponent';
import useLocation from '@/hooks/route/useLocation';
import { Empty } from '@/components';
import styles from './index.less';

export default () => {
  const location = useLocation();
  const id = location?.query?.id || '';

  return (
    <div className={styles['alarm-configuration-log-box']}>
      {id ? <TabComponent type={'detail'} id={id} /> : <Empty />}
    </div>
  );
};

import TabComponent from '@/pages/rule-engine/Alarm/Log/TabComponent';
import useLocation from '@/hooks/route/useLocation';
import { Empty } from '@/components';

export default () => {
  const location = useLocation();
  const id = location?.query?.id || '';

  return <div>{id ? <TabComponent type={'detail'} id={id} /> : <Empty />}</div>;
};

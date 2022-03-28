import { PageContainer } from '@ant-design/pro-layout';
import { useLocation } from 'umi';
import Assets from '../Assets';
import Member from '../Member';

type LocationType = {
  type: string;
};

export default () => {
  const location = useLocation<LocationType>();
  const params: any = new URLSearchParams(location.search);

  return <PageContainer>{params.get('type') === 'assets' ? <Assets /> : <Member />}</PageContainer>;
};

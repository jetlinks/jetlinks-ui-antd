import { PageContainer } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import { useLocation } from 'umi';
// import { service } from '../system/Apply'

const Iframe = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <PageContainer>
      <iframe
        style={{ width: '100%', height: '800px' }}
        src={'http://47.108.170.157:9010/#/login'}
        frameBorder="0"
      ></iframe>
    </PageContainer>
  );
};
export default Iframe;

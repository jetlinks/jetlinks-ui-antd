import { PageContainer } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import { useLocation } from 'umi';

const Iframe = () => {
  const location = useLocation();
  console.log(location, 22222);
  useEffect(() => {}, []);
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

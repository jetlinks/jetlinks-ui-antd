import { PageContainer } from '@ant-design/pro-layout';

const Iframe = () => {
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

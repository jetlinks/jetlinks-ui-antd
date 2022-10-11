import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { service } from '../system/Apply';

const Iframe = () => {
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const location = useLocation();

  const handle = async (appId: string, url: string) => {
    const res = await service.detail(appId);
    let menuUrl: any = url;
    if (res.status === 200) {
      // console.log(res.result);
      if (res.result.page.routeType === 'hash') {
        menuUrl = `${url}`;
      }
      if (res.result.provider === 'internal-standalone') {
        //{baseUrl}/api/application/sso/{appId}/login?redirect={menuUrl}
        const urlStandalone = `${res.result.page.baseUrl}/api/application/sso/${appId}/login?redirect=${menuUrl}?layout=false`;
        setIframeUrl(urlStandalone);
        // console.log(urlStandalone);
      } else {
        const urlOther = `${res.result.page.baseUrl}/${menuUrl}`;
        setIframeUrl(urlOther);
      }
    }
  };

  useEffect(() => {
    const params = location.pathname.split('/')?.[1];
    const url = location.pathname.split('/').slice(2).join('/');
    // console.log(params, url);
    handle(params, url);
  }, [location, iframeUrl]);

  return (
    <PageContainer>
      <iframe style={{ width: '100%', height: '800px' }} src={iframeUrl} frameBorder="0"></iframe>
    </PageContainer>
  );
};
export default Iframe;

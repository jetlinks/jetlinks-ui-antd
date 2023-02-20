import { useLocation } from '@/hooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';

const Remote = () => {
  const location = useLocation();
  const [url, setUrl] = useState<string>('');

  const _stop = async (id: string) => await service._stopControl(id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deviceId = params.get('id');
    if (deviceId) {
      service._control(deviceId).then((resp: any) => {
        if (resp.status === 200) {
          console.log(resp.result);
          const item = `http://${resp.result?.url}/#/login?token=${resp.result.token}`;
          setUrl(item);
        }
      });
    }
    return () => {
      if (deviceId) {
        _stop(deviceId);
      }
    };
  }, [location]);

  return (
    <PageContainer>
      {/* 远程控制 */}
      <iframe
        src={url}
        style={{
          width: '100%',
          height: 'calc(100vh - 20vh)',
        }}
      ></iframe>
    </PageContainer>
  );
};

export default Remote;

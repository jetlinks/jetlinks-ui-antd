import { useLocation } from '@/hooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';

const Remote = () => {
  const location = useLocation();
  const [url, setUrl] = useState<string>('');
  const [id, setId] = useState<string>('');

  const _stop = async () => await service._stopControl(id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deviceId = params.get('id');
    if (deviceId) {
      setId(deviceId);
      service._control(deviceId).then((resp: any) => {
        if (resp.status === 200) {
          // window.open(resp.result);
          console.log(resp.result);
          const item = `${resp.result?.url}`;
          setUrl(item);
        }
      });
    }
  }, [location]);

  useEffect(() => {
    return () => {
      console.log('---------');
      _stop();
    };
  }, []);

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

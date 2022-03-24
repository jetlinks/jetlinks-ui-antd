import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import Access from './Access';
import Provider from './Provider';
import { service } from '@/pages/link/AccessConfig';

type LocationType = {
  id?: string;
};

const Detail = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  const [config, setConfig] = useState<any>({});

  const location = useLocation<LocationType>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('id')) {
      service.detail(params.get('id') || '').then((resp) => {
        setConfig(resp.result);
        setVisible(false);
      });
    }
  }, []);

  return (
    <PageContainer>
      {visible ? (
        <Provider
          change={(param: any) => {
            setData(param);
            setVisible(false);
          }}
        />
      ) : (
        <Access
          data={data}
          access={config}
          change={() => {
            setVisible(true);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Detail;

import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import Access from './Access';
import Provider from './Provider';
import Media from './Media';
import { service } from '@/pages/link/AccessConfig';
import { Spin } from 'antd';

type LocationType = {
  id?: string;
};

const Detail = () => {
  const location = useLocation<LocationType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  const [provider, setProvider] = useState<any>({});
  const [type, setType] = useState<'media' | 'network' | undefined>(undefined);

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const id = new URLSearchParams(location.search).get('id') || undefined;
    service.getProviders().then((resp) => {
      if (resp.status === 200) {
        setDataSource(resp.result);
        if (new URLSearchParams(location.search).get('id')) {
          setVisible(false);
          service.detail(id || '').then((response) => {
            setData(response.result);
            const dt = resp.result.find((item: any) => item?.id === response.result?.provider);
            setProvider(dt);
            if (
              response.result?.provider === 'fixed-media' ||
              response.result?.provider === 'gb28181-2016'
            ) {
              setType('media');
            } else {
              setType('network');
            }
          });
        } else {
          setVisible(true);
        }
        setLoading(false);
      }
    });
  }, []);

  const componentRender = () => {
    switch (type) {
      case 'network':
        return (
          <Access
            data={data}
            change={() => {
              setVisible(true);
            }}
          />
        );
      case 'media':
        return (
          <Media
            data={data}
            provider={provider}
            change={() => {
              setVisible(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Spin spinning={loading}>
      <PageContainer>
        {visible ? (
          <Provider
            data={dataSource}
            change={(param: any, typings: 'media' | 'network') => {
              setType(typings);
              setProvider(param);
              setData({});
              setVisible(false);
            }}
          />
        ) : (
          componentRender()
        )}
      </PageContainer>
    </Spin>
  );
};

export default Detail;

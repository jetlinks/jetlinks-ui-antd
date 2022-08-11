import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
// import { useLocation } from 'umi';
import Access from './Access';
import Provider from './Provider';
import Media from './Media';
import { service } from '@/pages/link/AccessConfig';
import { Spin } from 'antd';
import Cloud from './Cloud';
import Channel from './Channel';
import { useLocation } from '@/hooks';

const Detail = () => {
  const location = useLocation();
  const [view, setView] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  const [provider, setProvider] = useState<any>({});
  const [type, setType] = useState<'media' | 'network' | 'cloud' | 'channel' | undefined>(
    undefined,
  );

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const _params = new URLSearchParams(location.search);
    const id = _params.get('id') || undefined;
    const paramsType = _params.get('type');

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
            } else if (
              response.result?.provider === 'Ctwing' ||
              response.result?.provider === 'OneNet'
            ) {
              setType('cloud');
            } else if (
              response.result?.provider === 'modbus-tcp' ||
              response.result?.provider === 'opc-ua'
            ) {
              setType('channel');
            } else {
              setType('network');
            }
          });
        } else if (paramsType) {
          setType('media');
          setProvider(resp.result.find((item: any) => item.id === paramsType));
          setData({});
          setVisible(false);
        } else {
          setVisible(true);
        }
        setLoading(false);
      }
    });
  }, [location]);

  useEffect(() => {
    if (location && location.state) {
      setView(location.state.view);
    }
  }, [location]);

  const componentRender = () => {
    switch (type) {
      case 'network':
        return (
          <Access
            data={data}
            provider={provider}
            view={view}
            change={() => {
              setVisible(true);
            }}
          />
        );
      case 'media':
        return (
          <Media
            data={data}
            view={view}
            provider={provider}
            change={() => {
              setVisible(true);
            }}
          />
        );
      case 'cloud':
        return (
          <Cloud
            data={data}
            provider={provider}
            view={view}
            change={() => {
              setVisible(true);
            }}
          />
        );
      case 'channel':
        return (
          <Channel
            data={data}
            provider={provider}
            view={view}
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
            change={(param: any, typings: 'media' | 'network' | 'cloud' | 'channel') => {
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

import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import { useLocation } from 'umi';
import Access from './Access';
import Provider from './Provider';
import Media from './Media';

type LocationType = {
  id?: string;
};

const Detail = () => {
  const location = useLocation<LocationType>();
  const [visible, setVisible] = useState<boolean>(!new URLSearchParams(location.search).get('id'));
  const [data, setData] = useState<any>({});
  const [type, setType] = useState<'media' | 'network'>('media');

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
            change={() => {
              setVisible(true);
            }}
          />
        );
    }
  };

  return (
    <PageContainer>
      {visible ? (
        <Provider
          change={(param: any, typings: 'media' | 'network') => {
            setType(typings);
            setData(param);
            setVisible(false);
          }}
        />
      ) : (
        componentRender()
      )}
    </PageContainer>
  );
};

export default Detail;

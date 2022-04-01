import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import { useLocation } from 'umi';
import Access from './Access';
import Provider from './Provider';

type LocationType = {
  id?: string;
};

const Detail = () => {
  const location = useLocation<LocationType>();
  const [visible, setVisible] = useState<boolean>(!new URLSearchParams(location.search).get('id'));
  const [data, setData] = useState<any>({});

  return (
    <PageContainer className={'page-title-show'}>
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
          change={() => {
            setVisible(true);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Detail;

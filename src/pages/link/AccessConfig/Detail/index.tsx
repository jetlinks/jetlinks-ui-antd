import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import Access from './Access';
import Provider from './Provider';

const Detail = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [id, setId] = useState<any>({});

  return (
    <PageContainer>
      {visible ? (
        <Provider
          change={(data: string) => {
            setId(data);
            setVisible(false);
          }}
        />
      ) : (
        <Access
          data={id}
          change={() => {
            setVisible(true);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Detail;

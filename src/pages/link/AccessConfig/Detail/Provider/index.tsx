import { Button, Card, Col, Empty, Row } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface Props {
  change: (id: string) => void;
}

const Provider = (props: Props) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const handleSearch = () => {
    service.getProviders().then((resp) => {
      if (resp.status === 200) {
        setDataSource(resp.result);
      }
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Card style={{ padding: '20px' }}>
      {dataSource.length > 0 ? (
        <Row gutter={[16, 16]}>
          {dataSource.map((item) => (
            <Col key={item.name} span={12}>
              <Card style={{ width: '100%' }} hoverable>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: 'calc(100% - 70px)',
                    }}
                  >
                    <div className={styles.images}>{item.name}</div>
                    <div style={{ margin: '10px', width: 'calc(100% - 84px)' }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div className={styles.desc}>{item.description}</div>
                    </div>
                  </div>
                  <div style={{ width: '70px' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        props.change(item);
                      }}
                    >
                      接入
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default Provider;

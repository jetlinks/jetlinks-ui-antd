import { Button, Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface Props {
  data: any[];
  change: (data: any, type: 'media' | 'network') => void;
}

const Provider = (props: Props) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [mediaSource, setMediaSource] = useState<any[]>([]);

  useEffect(() => {
    const media: any[] = [];
    const data: any = [];
    (props?.data || []).map((item: any) => {
      if (item.id === 'fixed-media' || item.id === 'gb28181-2016') {
        media.push(item);
      } else {
        data.push(item);
      }
    });
    setDataSource(data);
    setMediaSource(media);
  }, [props.data]);

  return (
    <>
      <Card>
        <div className={styles.title}>自定义设备接入</div>
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
                      <div className={styles.desc}>{item?.description || '--'}</div>
                    </div>
                  </div>
                  <div style={{ width: '70px' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        props.change(item, 'network');
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
      </Card>
      <Card style={{ marginTop: 20 }}>
        <div className={styles.title}>视频类设备接入</div>
        <Row gutter={[16, 16]}>
          {mediaSource.map((item) => (
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
                      <div className={styles.desc}>{item.description || '--'}</div>
                    </div>
                  </div>
                  <div style={{ width: '70px' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        props.change(item, 'media');
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
      </Card>
    </>
  );
};

export default Provider;

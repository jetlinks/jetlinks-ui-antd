import { useEffect, useState } from 'react';
import { TitleComponent } from '@/components';
import { Button, Card, Col, Row } from 'antd';
import styles from './index.less';

interface Props {
  data: any[];
  change: (data: any, type: 'media' | 'network') => void;
}

const Provider = (props: Props) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    const media: any[] = [];
    const network: any[] = [];
    const cloud: any[] = [];
    const channel: any[] = [];
    (props?.data || []).map((item: any) => {
      if (item.id === 'fixed-media' || item.id === 'gb28181-2016') {
        media.push(item);
      } else if (item.id === 'OneNet' || item.id === 'Ctwing') {
        cloud.push(item);
      } else if (item.id === 'modbus-tcp' || item.id === 'opc-ua') {
        channel.push(item);
      } else {
        network.push(item);
      }
    });

    setDataSource([
      {
        type: 'network',
        list: [...network],
        title: '自定义设备接入',
      },
      {
        type: 'media',
        list: [...media],
        title: '视频类设备接入',
      },
      {
        type: 'cloud',
        list: [...cloud],
        title: '云平台接入',
      },
      {
        type: 'channel',
        list: [...channel],
        title: '通道类设备接入',
      },
    ]);
  }, [props.data]);

  return (
    <div>
      {dataSource.map((i) => (
        <Card key={i.type} style={{ marginTop: 20 }}>
          <TitleComponent data={i.title} />
          <Row gutter={[16, 16]}>
            {(i?.list || []).map((item: any) => (
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
                          props.change(item, i.type);
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
      ))}
    </div>
  );
};

export default Provider;

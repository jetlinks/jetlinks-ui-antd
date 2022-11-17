import { useEffect, useState } from 'react';
import { TitleComponent } from '@/components';
import { Button, Card, Col, Row, Tooltip } from 'antd';
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
    const edge: any[] = [];
    (props?.data || []).map((item: any) => {
      if (item.id === 'fixed-media' || item.id === 'gb28181-2016') {
        media.push(item);
      } else if (item.id === 'OneNet' || item.id === 'Ctwing') {
        cloud.push(item);
      } else if (item.id === 'modbus-tcp' || item.id === 'opc-ua') {
        channel.push(item);
      } else if (item.id === 'official-edge-gateway' || item.id === 'edge-child-device') {
        edge.push(item);
      } else {
        network.push(item);
      }
    });
    const list = [];
    if (network.length) {
      list.push({
        type: 'network',
        list: [...network],
        title: '自定义设备接入',
      });
    }
    if (media.length) {
      list.push({
        type: 'media',
        list: [...media],
        title: '视频类设备接入',
      });
    }
    if (cloud.length) {
      list.push({
        type: 'cloud',
        list: [...cloud],
        title: '云平台接入',
      });
    }
    if (channel.length) {
      list.push({
        type: 'channel',
        list: [...channel],
        title: '通道类设备接入',
      });
    }
    if (edge.length) {
      list.push({
        type: 'edge',
        list: [...edge],
        title: '官方接入',
      });
    }
    setDataSource([...list]);
  }, [props.data]);

  const backMap = new Map();
  backMap.set('mqtt-server-gateway', require('/public/images/access/mqtt.png'));
  backMap.set('websocket-server', require('/public/images/access/websocket.png'));
  backMap.set('modbus-tcp', require('/public/images/access/modbus.png'));
  backMap.set('coap-server-gateway', require('/public/images/access/coap.png'));
  backMap.set('tcp-server-gateway', require('/public/images/access/tcp.png'));
  backMap.set('Ctwing', require('/public/images/access/ctwing.png'));
  backMap.set('child-device', require('/public/images/access/child-device.png'));
  backMap.set('opc-ua', require('/public/images/access/opc-ua.png'));
  backMap.set('http-server-gateway', require('/public/images/access/http.png'));
  backMap.set('fixed-media', require('/public/images/access/video-device.png'));
  backMap.set('udp-device-gateway', require('/public/images/access/udp.png'));
  backMap.set('OneNet', require('/public/images/access/onenet.png'));
  backMap.set('gb28181-2016', require('/public/images/access/gb28181.png'));
  backMap.set('mqtt-client-gateway', require('/public/images/access/mqtt-broke.png'));
  backMap.set('edge-child-device', require('/public/images/access/child-device.png'));
  backMap.set('official-edge-gateway', require('/public/images/access/edge.png'));

  return (
    <div>
      {dataSource.map((i) => {
        if (i.list && i.list.length !== 0) {
          return (
            <Card key={i.type} style={{ marginTop: 20 }}>
              <TitleComponent data={i.title} />
              <Row gutter={[24, 24]}>
                {(i?.list || []).map((item: any) => (
                  <Col key={item.id} span={12}>
                    <div className={styles.provider}>
                      <div className={styles.box}>
                        <div className={styles.left}>
                          <div className={styles.images}>
                            <img src={backMap.get(item.id)} />
                          </div>
                          <div className={styles.context}>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div className={styles.desc}>
                              <Tooltip title={item?.description || ''}>
                                {item?.description || ''}
                              </Tooltip>
                            </div>
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
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          );
        } else {
          return <></>;
        }
      })}
    </div>
  );
};

export default Provider;

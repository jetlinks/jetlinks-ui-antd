import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { Button, Card, Col, Empty, Input, message, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/AccessConfig';
import styles from './index.less';
import PermissionButton from '@/components/PermissionButton';
import encodeQuery from '@/utils/encodeQuery';

export const ProcotoleMapping = new Map();
ProcotoleMapping.set('websocket-server', 'WebSocket');
ProcotoleMapping.set('http-server-gateway', 'HTTP');
ProcotoleMapping.set('udp-device-gateway', 'UDP');
ProcotoleMapping.set('coap-server-gateway', 'COAP');
ProcotoleMapping.set('mqtt-client-gateway', 'MQTT');
ProcotoleMapping.set('mqtt-server-gateway', 'MQTT');
ProcotoleMapping.set('tcp-server-gateway', 'TCP');
ProcotoleMapping.set('child-device', '');
ProcotoleMapping.set('OneNet', 'HTTP');
ProcotoleMapping.set('Ctwing', 'HTTP');
ProcotoleMapping.set('modbus-tcp', 'MODBUS_TCP');
ProcotoleMapping.set('opc-ua', 'OPC_UA');

interface Props {
  provider: any;
  data: string;
  prev: () => void;
  next: (data: string) => void;
}

const Protocol = (props: Props) => {
  const [procotolList, setProcotolList] = useState<any[]>([]);
  const [procotolCurrent, setProcotolCurrent] = useState<string>('');
  const protocolPermission = PermissionButton.usePermission('link/Protocol').permission;

  const queryProcotolList = (id?: string, params?: any) => {
    service.getProtocolList(ProcotoleMapping.get(id), params).then((resp) => {
      if (resp.status === 200) {
        setProcotolList(resp.result);
      }
    });
  };

  useEffect(() => {
    queryProcotolList(props.provider?.id);
  }, [props.provider]);

  useEffect(() => {
    setProcotolCurrent(props.data);
  }, [props.data]);

  return (
    <div>
      <div className={styles.search}>
        <Input.Search
          key={'protocol'}
          placeholder="请输入名称"
          onSearch={(value: string) => {
            queryProcotolList(
              props.provider?.id,
              encodeQuery({
                terms: {
                  name$LIKE: `%${value}%`,
                },
              }),
            );
          }}
          style={{ width: 500, margin: '20px 0' }}
        />
        <PermissionButton
          isPermission={protocolPermission.add}
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`link/Protocol`]);
            const tab: any = window.open(`${origin}/#${url}?save=true`);
            tab!.onTabSaveSuccess = (resp: any) => {
              if (resp.status === 200) {
                queryProcotolList(props.provider?.id);
              }
            };
          }}
          key="button"
          type="primary"
        >
          新增
        </PermissionButton>
      </div>
      {procotolList.length > 0 ? (
        <Row gutter={[16, 16]}>
          {procotolList.map((item) => (
            <Col key={item.id} span={8}>
              <Card
                className={styles.cardRender}
                style={{
                  width: '100%',
                  borderColor: procotolCurrent === item.id ? 'var(--ant-primary-color-active)' : '',
                }}
                hoverable
                onClick={() => {
                  setProcotolCurrent(item.id);
                }}
              >
                <div style={{ height: '45px' }}>
                  <div className={styles.title}>{item.name || '--'}</div>
                  <div className={styles.desc}>{item.description || '--'}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <span>
              暂无数据
              {getButtonPermission('link/Protocol', ['add']) ? (
                '请联系管理员进行配置'
              ) : (
                <Button
                  type="link"
                  onClick={() => {
                    const url = getMenuPathByCode(MENUS_CODE[`link/Protocol`]);
                    const tab: any = window.open(`${origin}/#${url}?save=true`);
                    tab!.onTabSaveSuccess = (resp: any) => {
                      if (resp.status === 200) {
                        queryProcotolList(props.provider?.id);
                      }
                    };
                  }}
                >
                  去新增
                </Button>
              )}
            </span>
          }
        />
      )}
      <Space style={{ marginTop: 20 }}>
        <Button style={{ margin: '0 8px' }} onClick={() => props.prev()}>
          上一步
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (!procotolCurrent) {
              message.error('请选择消息协议！');
            } else {
              props.next(procotolCurrent);
            }
          }}
        >
          下一步
        </Button>
      </Space>
    </div>
  );
};

export default Protocol;

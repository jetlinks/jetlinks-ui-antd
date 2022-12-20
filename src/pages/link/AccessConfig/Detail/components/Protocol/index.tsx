import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { Button, Card, Col, Input, Row, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/AccessConfig';
import styles from './index.less';
import PermissionButton from '@/components/PermissionButton';
import { ProtocolMapping } from '../../data';
import { onlyMessage } from '@/utils/util';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Store } from 'jetlinks-store';
import encodeQuery from '@/utils/encodeQuery';
import { Empty } from '@/components';

interface Props {
  provider: any;
  data: string;
  prev: () => void;
  next: (data: string) => void;
  view?: boolean;
  dt?: any;
}

const Protocol = (props: Props) => {
  const [protocolList, setProtocolList] = useState<any[]>([]);
  const [allProtocolList, setAllProtocolList] = useState<any[]>([]);
  const [protocolCurrent, setProtocolCurrent] = useState<string>('');
  const protocolPermission = PermissionButton.usePermission('link/Protocol').permission;

  const queryProtocolList = (id?: string, params?: any) => {
    service
      .getProtocolList(
        ProtocolMapping.get(id),
        encodeQuery({
          ...params,
          sorts: { createTime: 'desc' },
        }),
      )
      .then((resp) => {
        if (resp.status === 200) {
          setProtocolList(resp.result);
          setAllProtocolList(resp.result);
          Store.set('allProtocolList', resp.result);
        }
      });
  };

  useEffect(() => {
    queryProtocolList(props.provider?.id);
  }, [props.provider]);

  useEffect(() => {
    setProtocolCurrent(props.data);
  }, [props.data]);

  return (
    <div className={styles.protocol}>
      <div className={styles.alert}>
        <InfoCircleOutlined style={{ marginRight: 10 }} />
        使用选择的消息协议，对网络组件通信数据进行编解码、认证等操作
      </div>
      <div className={styles.search}>
        <Input.Search
          key={'protocol'}
          allowClear
          placeholder="请输入名称"
          onSearch={(value: string) => {
            if (value) {
              const list = allProtocolList.filter((i) => {
                return i?.name && i.name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
              });
              setProtocolList(list);
            } else {
              setProtocolList(allProtocolList);
            }
          }}
          style={{ width: 500, margin: '20px 0' }}
        />
        {!props.view && (
          <PermissionButton
            isPermission={protocolPermission.add}
            onClick={() => {
              const url = getMenuPathByCode(MENUS_CODE[`link/Protocol`]);
              const tab: any = window.open(`${origin}/#${url}?save=true`);
              tab!.onTabSaveSuccess = (resp: any) => {
                if (resp.status === 200) {
                  setProtocolCurrent(resp.result?.id);
                  queryProtocolList(props.provider?.id);
                }
              };
            }}
            key="button"
            type="primary"
          >
            新增
          </PermissionButton>
        )}
      </div>
      <div className={styles.content}>
        {protocolList.length ? (
          <Row gutter={[16, 16]}>
            {protocolList.map((item) => (
              <Col key={item.id} span={8}>
                <Card
                  className={classNames(
                    styles.cardRender,
                    protocolCurrent === item.id ? styles.checked : '',
                  )}
                  style={{
                    background: `url("/images/access-protocol.png") no-repeat`,
                    backgroundSize: '100% 100%',
                  }}
                  hoverable
                  onClick={() => {
                    if (!props.dt?.id) {
                      setProtocolCurrent(item.id);
                    }
                  }}
                >
                  <div style={{ height: '45px' }}>
                    <div className={styles.title}>
                      <Tooltip title={item.name}>{item.name}</Tooltip>
                    </div>
                    <div className={styles.desc}>
                      <Tooltip placement="topLeft" title={item.description}>
                        {item.description}
                      </Tooltip>
                    </div>
                  </div>
                  <div className={styles.checkedIcon}>
                    <div>
                      <CheckOutlined />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            style={{ marginTop: '10%', marginBottom: '10%' }}
            description={
              <span>
                暂无数据
                {getButtonPermission('link/Protocol', ['add']) ? (
                  '请联系管理员进行配置'
                ) : props.view ? (
                  ''
                ) : (
                  <Button
                    type="link"
                    onClick={() => {
                      const url = getMenuPathByCode(MENUS_CODE[`link/Protocol`]);
                      const tab: any = window.open(`${origin}/#${url}?save=true`);
                      tab!.onTabSaveSuccess = (resp: any) => {
                        if (resp.status === 200) {
                          setProtocolCurrent(resp.result?.id);
                          queryProtocolList(props.provider?.id);
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
      </div>
      <div className={styles.action}>
        <Space style={{ marginTop: 20 }}>
          <Button style={{ margin: '0 8px' }} onClick={() => props.prev()}>
            上一步
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (!protocolCurrent) {
                onlyMessage('请选择消息协议！', 'error');
              } else {
                props.next(protocolCurrent);
              }
            }}
          >
            下一步
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Protocol;

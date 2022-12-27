import styles from './index.less';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Input, Row, Tooltip } from 'antd';
import encodeQuery from '@/utils/encodeQuery';
import { Ellipsis, PermissionButton } from '@/components';
import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/AccessConfig';
import { NetworkTypeMapping, descriptionList } from '@/pages/link/AccessConfig/Detail/data';
import { onlyMessage } from '@/utils/util';
import { Store } from 'jetlinks-store';
import { Empty } from '@/components';

interface Props {
  next: (data: string) => void;
  data: string;
  provider: any;
  view?: boolean;
}

const Network = (props: Props) => {
  const [networkList, setNetworkList] = useState<any[]>([]);
  const networkPermission = PermissionButton.usePermission('link/Type').permission;
  const [networkCurrent, setNetworkCurrent] = useState<string>(props.data);

  const queryNetworkList = (id: string, params?: any) => {
    service.getNetworkList(NetworkTypeMapping.get(id), params).then((resp) => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
        Store.set('network', resp.result);
      }
    });
  };

  useEffect(() => {
    queryNetworkList(props.provider?.id, encodeQuery({ include: networkCurrent || '' }));
  }, [props.provider?.id]);

  useEffect(() => {
    setNetworkCurrent(props.data);
  }, [props.data]);

  return (
    <div className={styles.network}>
      <div className={styles.alert}>
        <InfoCircleOutlined style={{ marginRight: 10 }} />
        选择与设备通信的网络组件
      </div>
      <div className={styles.search}>
        <Input.Search
          key={'network'}
          placeholder="请输入名称"
          allowClear
          onSearch={(value: string) => {
            queryNetworkList(
              props.provider?.id,
              encodeQuery({
                include: networkCurrent || '',
                terms: {
                  name$LIKE: `%${value}%`,
                },
              }),
            );
          }}
          style={{ width: 500, margin: '20px 0' }}
        />
        {!props.view && (
          <PermissionButton
            isPermission={networkPermission.add}
            onClick={() => {
              const url = getMenuPathByCode(MENUS_CODE['link/Type/Detail']);
              const tab: any = window.open(
                `${origin}/#${url}?type=${NetworkTypeMapping.get(props.provider?.id) || ''}`,
              );
              tab!.onTabSaveSuccess = (value: any) => {
                if (value.status === 200) {
                  setNetworkCurrent(value.result?.id);
                  queryNetworkList(props.provider?.id, {
                    include: networkCurrent || '',
                  });
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
        {networkList.length ? (
          <Row gutter={[16, 16]}>
            {networkList.map((item) => (
              <Col key={item.id} span={8}>
                <Card
                  className={classNames(
                    styles.cardRender,
                    networkCurrent === item.id ? styles.checked : '',
                  )}
                  style={{
                    background: `url("/images/access-network.png") no-repeat`,
                    backgroundSize: '100% 100%',
                  }}
                  hoverable
                  onClick={() => {
                    if (!props.view) {
                      setNetworkCurrent(item.id);
                    }
                  }}
                >
                  <div className={styles.title}>
                    <Ellipsis title={item.name} tooltip={{ placement: 'topLeft' }} />
                  </div>
                  <div className={styles.cardContent}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        item.addresses?.length > 1 ? (
                          <div>
                            {[...item.addresses].map((i: any) => (
                              <div key={i.address}>
                                <Badge color={i.health === -1 ? 'red' : 'green'} />
                                {i.address}
                              </div>
                            ))}
                          </div>
                        ) : (
                          ''
                        )
                      }
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.addresses.slice(0, 1).map((i: any) => (
                          <div className={styles.item} key={i.address}>
                            <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                            {item.addresses?.length > 1 && '...'}
                          </div>
                        ))}
                      </div>
                    </Tooltip>
                    <Ellipsis
                      title={item?.description || descriptionList[props.provider?.id]}
                      tooltip={{ placement: 'topLeft' }}
                      titleClassName={styles.desc}
                    />
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
                {getButtonPermission('link/Type', ['add']) ? (
                  '请联系管理员进行配置'
                ) : (
                  <Button
                    type="link"
                    onClick={() => {
                      const url = getMenuPathByCode(MENUS_CODE['link/Type/Detail']);
                      const tab: any = window.open(
                        `${origin}/#${url}?type=${
                          NetworkTypeMapping.get(props.provider?.id) || ''
                        }`,
                      );
                      tab!.onTabSaveSuccess = (value: any) => {
                        if (value.status === 200) {
                          setNetworkCurrent(value.result?.id);
                          queryNetworkList(props.provider?.id, {
                            include: networkCurrent || '',
                          });
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
        <Button
          type="primary"
          onClick={() => {
            if (!!networkCurrent) {
              props.next(networkCurrent);
            } else {
              onlyMessage('请选择网络组件！', 'error');
            }
          }}
        >
          下一步
        </Button>
      </div>
    </div>
  );
};

export default Network;

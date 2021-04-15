import React, { useState, useContext, useEffect } from 'react';
import { List, Card, Tooltip, Icon } from 'antd';
import { router } from 'umi';
import encodeQueryParam from '@/utils/encodeParam';
import IconFont from '@/components/IconFont';
import styles from '../index.less';
import Edit from './edit';
import { TenantContext } from '../../../detail';
import Service from '../../../service';

interface Props {
  user: any;
}
const Product = (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const data = useContext(TenantContext);

  const service = new Service('tenant');

  const [pub, setPub] = useState(0);
  const [unPub, setUnPub] = useState(0);

  const getData = () => {
    service.assets
      .productCount(
        encodeQueryParam({
          terms: {
            id$assets: JSON.stringify({
              tenantId: data?.id,
              assetType: 'product',
              memberId: props.user,
            }),
            state: 1,
          },
        }),
      )
      .subscribe(resp => {
        setPub(resp);
      });
    service.assets
      .productCount(
        encodeQueryParam({
          terms: {
            id$assets: JSON.stringify({
              tenantId: data?.id,
              assetType: 'product',
              memberId: props.user,
            }),
            state: 0,
          },
        }),
      )
      .subscribe(resp => {
        setUnPub(resp);
      });
  };
  useEffect(() => {
    getData();
  }, [props.user]);
  return (
    <List.Item style={{ paddingRight: '10px' }}>
      <Card
        hoverable
        className={styles.card}
        actions={[
          <Tooltip title="查看">
            <Icon
              type="eye"
              onClick={() =>
                router.push({
                  pathname: `/device/product`,
                  search:
                    'iop=' +
                    JSON.stringify({
                      terms: {
                        id$assets: {
                          tenantId: data?.id,
                          assetType: 'product',
                          memberId: props.user,
                          // not: true,
                        },
                      },
                    }),
                })
              }
            />
          </Tooltip>,
          <Tooltip title="编辑">
            <Icon type="edit" onClick={() => setVisible(true)} />
          </Tooltip>,
        ]}
      >
        <Card.Meta
          avatar={<IconFont type="icon-chanpin" style={{ fontSize: 45 }} />}
          title={<a>产品</a>}
        />
        <div className={styles.cardInfo}>
          <div>
            <p>已发布</p>
            <p>{pub}</p>
          </div>
          <div>
            <p>未发布</p>
            <p>{unPub}</p>
          </div>
        </div>
      </Card>
      {visible && (
        <Edit
          data={data}
          user={props.user}
          close={() => {
            setVisible(false);
            getData();
          }}
        />
      )}
    </List.Item>
  );
};
export default Product;

import { onlyMessage } from '@/utils/util';
import { Button, Col, Row } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { service } from '..';
import styles from './index.less';

const AccountInit = () => {
  const [value, setValue] = useState<string>('');

  const viewMap = [
    {
      title: '设备接入视图',
      img: require('/public/images/home/device.png'),
      value: 'device',
    },
    {
      title: '运维管理视图',
      img: require('/public/images/home/ops.png'),
      value: 'ops',
    },
    {
      title: '综合管理视图',
      img: require('/public/images/home/comprehensive.png'),
      value: 'comprehensive',
    },
  ];
  useEffect(() => {
    service.queryViews().then((res) => {
      if (res.status === 200) {
        setValue(res.result?.content);
      }
    });
  }, []);

  return (
    <div className={styles.homeBox} style={{ height: '100%', width: '90%' }}>
      <Row gutter={24}>
        {viewMap.map((item) => (
          <Col
            span={6}
            key={item.value}
            onClick={() => {
              setValue(item.value);
            }}
          >
            <div className={classNames(styles.item, value === item.value ? styles.active : {})}>
              <img src={item.img} className={styles.item} />
            </div>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 48, marginRight: '25%' }}>
        <Button
          type="primary"
          onClick={() => {
            service
              .setViews({
                name: 'view',
                content: value,
              })
              .then((resp) => {
                if (resp.status === 200) {
                  onlyMessage('保存成功');
                }
              });
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
export default AccountInit;

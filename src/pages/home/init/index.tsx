import { Button, Col, Row } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { service } from '..';
import styles from './index.less';

interface Props {
  changeView: (view: any) => void;
}

const Init = (props: Props) => {
  const [value, setValue] = useState<string>('device');

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
  return (
    <div className={styles.homeBox}>
      <div className={styles.title}>请选择首页视图</div>

      <Row gutter={24}>
        {viewMap.map((item) => (
          <Col
            span={8}
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

      <div style={{ textAlign: 'center', marginTop: 48 }}>
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
                  props.changeView(value);
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
export default Init;

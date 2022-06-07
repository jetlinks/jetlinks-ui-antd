import { Button, Col, Radio, Row } from 'antd';
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
    <div>
      <div className={styles.title}>请选择首页视图</div>
      <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
        <Row gutter={24}>
          {viewMap.map((item) => (
            <Col span={8} key={item.value}>
              <div className={styles.item}>
                <img src={item.img} className={styles.item} />
                <Radio value={item.value}>{item.title}</Radio>
              </div>
            </Col>
          ))}
        </Row>
      </Radio.Group>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Button
          type="primary"
          onClick={() => {
            service
              .setView({
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

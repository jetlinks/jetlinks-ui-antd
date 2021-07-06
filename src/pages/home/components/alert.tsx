import React from 'react';
import Layout from '../items';
import styles from '../index.less';
import deviceStyle from './device.less';
import { Badge } from 'antd';

function Alert() {
  return (
    <div className={`${styles.item} ${styles.alert}`}>
      <Layout
        title='告警记录'
      >
        <div className={deviceStyle.content}>
          <div className={deviceStyle.top}>
            <img src={require('@/assets/home/alarm.png')} alt="" />
            <div>
              <div>总告警次数（次）</div>
              <h2>20</h2>
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="green" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>已处理</span>} />
            <div>
              20
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="red" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未处理</span>} />
            <div>
              20
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Alert;

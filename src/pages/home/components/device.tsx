import React from 'react';
import Layout from '../items';
import styles from '../index.less';
import deviceStyle from './device.less';
import { Badge } from 'antd';

function Device() {
  return (
    <div className={`${styles.item} ${styles.device}`}>
      <Layout
        title='设备接入'
      >
        <div className={deviceStyle.content}>
          <div className={deviceStyle.top}>
            <img src={require('@/assets/home/video.png')} alt="" />
            <div>
              <div>视频设备接入总数</div>
              <h2>20</h2>
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="green" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>当前在线设备</span>} />
            <div>
              20
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="red" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>离线设备</span>} />
            <div>
              20
            </div>
          </div>
        </div>
        <div className={deviceStyle.content}>
          <div className={deviceStyle.top}>
            <img src={require('@/assets/home/things.png')} alt="" />
            <div>
              <div>物联设备接入总数</div>
              <h2>20</h2>
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="green" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>当前在线设备</span>} />
            <div>
              20
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="#f50" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>离线设备</span>} />
            <div>
              20
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Device;

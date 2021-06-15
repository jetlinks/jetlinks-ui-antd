import React from 'react';
import Layout from '../items';
import styles from '../index.less';
import { Button, Descriptions, Result } from 'antd'

function Internet() {
  return (
    <div className={`${styles.item} ${styles.internet}`}>
      <Layout
        title='网络配置'
      >
        <div className={styles.networkPort}>
          <div className={styles.networkTitle}>
            <div>
              网口1
            </div>
            <Button type="primary">编辑</Button>
          </div>
          <div className={styles.networkContent}>
            <Descriptions column={2}>
              <Descriptions.Item span={2} label="状态">
                1
              </Descriptions.Item>
              <Descriptions.Item label="IP地址获取方式">手动配置</Descriptions.Item>
              <Descriptions.Item label="IP地址">192.168.1.1</Descriptions.Item>
              <Descriptions.Item label="子网掩码">255.255.255.0</Descriptions.Item>
              <Descriptions.Item label="网关">192.168.1.255</Descriptions.Item>
              <Descriptions.Item label="首选DNS服务器">59.59.59.59</Descriptions.Item>
              <Descriptions.Item label="首选DNS服务器">59.59.59.59</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={styles.networkPort}>
          <div className={styles.networkTitle}>
            <div>
              网口2
            </div>
            <Button type="primary">立即配置</Button>
          </div>
          <div className={styles.networkContent}>
            <Result
              icon={<img src={require('@/assets/noData.png')} alt="" />}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Internet;

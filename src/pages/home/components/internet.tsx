import React, { useState } from 'react';
import Layout from '../items';
import styles from '../index.less';
import { Button, Descriptions, Result } from 'antd'
import InternetModel from './model/InternetSetting';

function Internet() {

  const [internetVisible, setInternetVisible] = useState(false)
  const [title, setTitle] = useState('网口1')
  const [data, setData] = useState<object | undefined>(undefined)

  const openEditModel = (type: number) => {
    let title = '编辑网口' + type
    setTitle(title)
    setData({
      test: true,
      test2: 1,
      test3: '1',
      test4: '4',
      test5: '5',
      test6: '6',
      test7: '7'
    })
    setInternetVisible(true)
  }

  const openAddModel = (type: number) => {
    let title = '配置网口' + type
    setTitle(title)
    setData({
      test: true,
      test2: 1
    })
    setInternetVisible(true)
  }


  const InternetVisibleEvent = () => {
    setInternetVisible(false)
  }

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
            <Button type="primary" onClick={() => { openEditModel(1) }}>编辑</Button>
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
            <Button type="primary" onClick={() => { openAddModel(2) }}>立即配置</Button>
          </div>
          <div className={styles.networkContent}>
            <Result
              icon={<img src={require('@/assets/noData.png')} alt="" />}
            />
          </div>
        </div>
      </Layout>
      {/* 网络配置 */}
      <InternetModel
        title={title}
        data={data}
        visible={internetVisible}
        onOk={InternetVisibleEvent}
        onCancel={InternetVisibleEvent}
      />
    </div>
  );
}

export default Internet;

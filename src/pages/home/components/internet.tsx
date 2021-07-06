import React, { useState } from 'react';
import Layout from '../items';
import styles from '../index.less';
import { Button, Descriptions, Result } from 'antd'
import InternetModel from './model/InternetSetting';
import Service from './service';
import { useEffect } from 'react';

function Internet() {

  const service = new Service('edge/network')

  const [internetVisible, setInternetVisible] = useState(false)
  const [title, setTitle] = useState('网口1')
  const [data, setData] = useState<object | undefined>(undefined)
  const [network, setNetwork] = useState<any>({});

  const openEditModel = (type: number) => {
    let title = '编辑网口' + type
    setTitle(title)
    setData(network)
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

  useEffect(() => {
    service.getEdgeNetworkList().subscribe(resp => {
      setNetwork(resp);
    })
  }, []);

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
              <Descriptions.Item label="IP地址">{network.idAdd}</Descriptions.Item>
              <Descriptions.Item label="子网掩码">{network.mask}</Descriptions.Item>
              <Descriptions.Item label="网关">{network.gateWayAdd}</Descriptions.Item>
              <Descriptions.Item label="首选DNS服务器">{network.dns}</Descriptions.Item>
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

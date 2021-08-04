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
  const [network1, setNetwork1] = useState<any>({});
  const [network2, setNetwork2] = useState<any>({});

  const openEditModel = (type: number) => {
    let title = '编辑网口' + type
    setTitle(title)
    if(type === 0){
      setData(network1)
    }else{
      setData(network2)
    }
    setInternetVisible(true)
  }

  const InternetVisibleEvent = () => {
    setInternetVisible(false)
    
  }

  const getNetwork = () => {
    service.getEdgeNetworkList().subscribe(resp => {
      resp.map((item: any) => {
        if(item.ethName === 'enp2s0'){
          setNetwork1(item)
        }
        if(item.ethName === 'enp3s0'){
          setNetwork2(item)
        }
      })
    })
  }
  useEffect(() => {
    getNetwork()
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
            {
              network1 && Object.keys(network1).length > 0 && <Button type="primary" onClick={() => { openEditModel(0) }}>编辑</Button>
            }
          </div>
          <div className={styles.networkContent}>
            <Descriptions column={2}>
              <Descriptions.Item label="IP地址获取方式">{network1?.netWay || '---'}</Descriptions.Item>
              <Descriptions.Item label="IP地址">{network1?.ipAdd || '---'}</Descriptions.Item>
              <Descriptions.Item label="子网掩码">{network1?.mask || '---'}</Descriptions.Item>
              <Descriptions.Item label="网关">{network1?.gateWayAdd || '---'}</Descriptions.Item>
              {/* <Descriptions.Item label="首选DNS服务器">{network[0]?.dns || '---'}</Descriptions.Item> */}
            </Descriptions>
          </div>
        </div>
        <div className={styles.networkPort}>
          <div className={styles.networkTitle}>
            <div>
              网口2
            </div>
            {
              network2 && Object.keys(network2).length > 0 && <Button type="primary" onClick={() => { openEditModel(1) }}>编辑</Button>
            }
          </div>
          <div className={styles.networkContent}>
            {/* <Result
              icon={<img src={require('@/assets/noData.png')} alt="" />}
            /> */}
            <div className={styles.networkContent}>
              <Descriptions column={2}>
                <Descriptions.Item label="IP地址获取方式">{network2?.netWay || '---'}</Descriptions.Item>
                <Descriptions.Item label="IP地址">{network2?.ipAdd || '---'}</Descriptions.Item>
                <Descriptions.Item label="子网掩码">{network2?.mask || '---'}</Descriptions.Item>
                <Descriptions.Item label="网关">{network2?.gateWayAdd || '---'}</Descriptions.Item>
                {/* <Descriptions.Item label="首选DNS服务器">{network[1]?.dns || '---'}</Descriptions.Item> */}
              </Descriptions>
            </div>
          </div>
        </div>
      </Layout>
      {/* 网络配置 */}
      <InternetModel
        title={title}
        data={data}
        visible={internetVisible}
        onOk={() => {
          getNetwork()
          InternetVisibleEvent()
        }}
        onCancel={InternetVisibleEvent}
      />
    </div>
  );
}

export default Internet;

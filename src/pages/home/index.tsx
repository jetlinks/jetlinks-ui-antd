import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Internet from './components/internet';
import Alert from './components/alert';
import Basis from './components/basis';
import Device from './components/device';
import { Button, Icon } from 'antd'
import Echarts from './components/Echarts';
import AddressModel from './components/model/addressSetting';
import { getWebsocket } from '@/layouts/GlobalWebSocket';
import { geteWayInfo } from '@/services/edge';
import { useRequest } from 'ahooks';

function Home() {

  const [addressVisible, setAddressVisible] = useState(false)
  const deviceId = 'jetlinks-agent';
  const productId = 'edge-gateway';
  const [cpuUse, setCpuUse] = useState<number>(0);
  const [jvmUse, setJvmUse] = useState<number>(0);
  const [memoryUse, setMemoryUse] = useState<number>(0);
  const [diskUse, setDiskUse] = useState<number>(0);
  const [cpuTemperature, setCpuTemperature] = useState<number>(0);
  const [address, setAddress] = useState('192.168.1.1')

  const { data } = useRequest(geteWayInfo('20212223'))
  useEffect(() => {
    //   let propertiesWs = getWebsocket(
    //     `instance-info-property-${deviceId}-${productId}`,
    //     // `/edge-gateway-state/device/${productId}/properties/realTime`,
    //     `/dashboard/device/${productId}/properties/realTime`,
    //     {
    //       deviceId: deviceId,
    //       history: 0,
    //     },
    //   ).subscribe(resp => {
    //     const {payload} = resp;
    //     console.log(payload.value.property)
    //     // console.log(resp)
    //   })
    //   return () => {
    //     propertiesWs && propertiesWs.unsubscribe();
    //   };
  }, []);


  const AddressVisibleEvent = () => {
    setAddressVisible(false)
  }

  return (
    <div className={styles.home}>
      <div className={`${styles.layout} ${styles.item} ${styles.address}`}>
        <div>
          <img src={require('@/assets/home/setting.png')} alt="" />
          {
            address ?
              <>
                <span>
                  {`平台地址：${address}`}
                </span>
                <span style={{ color: '#52C41A', paddingLeft: 10, fontWeight: 400 }}>
                  <Icon type="check-circle" theme="filled" /> 连接成功
                </span>
              </>
              :
              '立刻配置平台地址'
          }
        </div>
        <Button type="primary" onClick={() => { setAddressVisible(true) }}>{address ? '编辑' : '立即配置'}</Button>
      </div>
      <div className={styles.layout}>
        <Internet />
        <Basis />
      </div>
      <div className={styles.layout}>
        <Device />
        <Alert />
      </div>
      <div className={`${styles.layout} ${styles.item} ${styles.status}`}>
        <Echarts title='CPU使用率' color="#FF4D4F" value={32.55} />
        <Echarts title='JVM使用率' color="#63DAAB" value={20} />
        <Echarts title='系统内存使用率' color="#FAAD14" value={0} />
        <Echarts title='磁盘使用率' color="#5B8FF9" value={10} />
        <Echarts title='CPU温度' color="#014D88" value={1} />
      </div>
      {/* 平台地址 */}
      <AddressModel
        visible={addressVisible}
        onOk={AddressVisibleEvent}
        onCancel={AddressVisibleEvent}
      />

    </div>
  );
}

export default Home;

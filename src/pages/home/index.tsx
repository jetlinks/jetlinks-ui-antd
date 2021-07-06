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

interface RealDataProps {
  cpuTemp: number;
  cpuUsage: number;
  diskUsage: number;
  jvmMemUsage: number;
  sysMemUsage: number;
}

function Home() {

  const [addressVisible, setAddressVisible] = useState(false)
  const deviceId = 'jetlinks-agent';
  const productId = 'edge-gateway';
  const [realData, setRealData] = useState<RealDataProps>({
    cpuTemp: 0,
    cpuUsage: 0,
    diskUsage: 0,
    jvmMemUsage: 0,
    sysMemUsage: 0
  });
  const [address, setAddress] = useState('192.168.1.1')

  // const { data, run } = useRequest(geteWayInfo,{
  //   manual: true
  // });

  useEffect(() => {
    // run('123456');
    
  }, []);

  useEffect(() => {
    let propertiesWs = getWebsocket(
      `instance-info-property-${deviceId}-${productId}`,
      `/edge-gateway-state/device/${productId}/properties/realTime`, //网关侧
      // `/dashboard/device/${productId}/properties/realTime`, //平台侧
      {
        deviceId: deviceId,
        history: 1,
      },
    ).subscribe(resp => {
      const { payload } = resp;
      setRealData({...payload});
    })
    return () => {
      propertiesWs && propertiesWs.unsubscribe();
    };
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
        <Echarts title='CPU使用率' color="#FF4D4F" value={realData.cpuUsage} />
        <Echarts title='JVM使用率' color="#63DAAB" value={realData.jvmMemUsage} />
        <Echarts title='系统内存使用率' color="#FAAD14" value={realData.sysMemUsage} />
        <Echarts title='磁盘使用率' color="#5B8FF9" value={realData.diskUsage} />
        <Echarts title='CPU温度' color="#014D88" value={realData.cpuTemp} />
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

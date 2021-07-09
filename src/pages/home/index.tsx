import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Internet from './components/internet';
import Alert from './components/alert';
import Basis from './components/basis';
import Device from './components/device';
import { Button, Icon } from 'antd'
import Echarts from './components/Echarts';
import AddressModel from './components/model/addressSetting';
import Service from './service';
import { getWebsocket } from '@/layouts/GlobalWebSocket';
interface RealDataProps {
  cpuTemp: number;
  cpuUsage: number;
  diskUsage: number;
  jvmMemUsage: number;
  sysMemUsage: number;
}

function Home() {

  const service = new Service('edge/network')
  const [addressVisible, setAddressVisible] = useState(false)
  const [info, setInfo] = useState<any>({});
  let propertiesWs: any;
  const [realData, setRealData] = useState<RealDataProps>({
    cpuTemp: 0,
    cpuUsage: 0,
    diskUsage: 0,
    jvmMemUsage: 0,
    sysMemUsage: 0
  });

  useEffect(() => {
    service.getEdgeInfo().subscribe(resp => {
      if (resp.status === 200) {
        setInfo(resp.result);
      }
    })
  }, []);

  const AddressVisibleEvent = () => {
    setAddressVisible(false)
  }

  useEffect(() => {
    if (info.deviceId && info.productId) {
      propertiesWs = getWebsocket(
        `instance-info-property-${info.deviceId}-${info.productId}`,
        `/edge-gateway-state/device/${info.productId}/properties/realTime`, //网关侧
        {
          deviceId: info.deviceId,
          history: 1,
        },
      ).subscribe(resp => {
        const { payload } = resp;
        setRealData({ ...payload });
      })
    }

    return () => {
      propertiesWs && propertiesWs.unsubscribe();
    };
  }, [info]);

  return (
    <div className={styles.home}>
      <div className={`${styles.layout} ${styles.item} ${styles.address}`}>
        <div>
          <img src={require('@/assets/home/setting.png')} alt="" />
          {
            info.host ?
              <>
                <span>
                  {`平台地址：${info.host}`}
                </span>
                {
                  info.connected && (
                    <span style={{ color: '#52C41A', paddingLeft: 10, fontWeight: 400 }}>
                      <Icon type="check-circle" theme="filled" /> 连接成功
                    </span>
                  )
                }
              </>
              :
              '立刻配置平台地址'
          }
        </div>
        <Button type="primary" onClick={() => { setAddressVisible(true) }}>{info.host ? '编辑' : '立即配置'}</Button>
      </div>
      <div className={styles.layout}>
        <Internet />
        <Basis data={info} />
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
        data={info.host}
        visible={addressVisible}
        onOk={AddressVisibleEvent}
        onCancel={AddressVisibleEvent}
      />

    </div>
  );
}

export default Home;


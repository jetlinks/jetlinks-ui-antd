import React, { useState } from 'react';
import styles from './index.less';
import Internet from './components/internet';
import Alert from './components/alert';
import Basis from './components/basis';
import Device from './components/device';
import { Button } from 'antd'
import Echarts from './components/Echarts';
import AddressModel from './components/model/addressSetting';

function Home() {

  const [addressVisible, setAddressVisible] = useState(false)


  const AddressVisibleEvent = () => {
    setAddressVisible(false)
  }

  return (
    <div className={styles.home}>
      <div className={`${styles.layout} ${styles.item} ${styles.address}`}>
        <div>
          <img src={require('@/assets/home/setting.png')} alt="" />
          立刻配置平台地址
        </div>
        <Button type="primary" onClick={() => { setAddressVisible(true) }}>立即配置</Button>
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

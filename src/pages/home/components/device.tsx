import React, { useEffect, useState } from 'react';
import Layout from '../items';
import styles from '../index.less';
import deviceStyle from './device.less';
import { Badge } from 'antd';
import Service from './service';

function Device() {

  const service = new Service('edge/network');
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [deviceOfflineCount, setDeviceOfflineCount] = useState<number>(0);
  const [deviceOnlineCount, setDeviceOnlineCount] = useState<number>(0);
  const [videoCount, setVideoCount] = useState<number>(0);
  const [videoOnlineCount, setVideoOnlineCount] = useState<number>(0);
  const [videoOfflineCount, setVideoOfflineCount] = useState<number>(0);


  useEffect(() => {
    service.getDeviceCount({
      "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" },
          { "column": "productId", "value": "GB28181-PRO", "termType": "not" }
        ]
    }).subscribe(resp => {
      if (resp.status === 200) {
        setDeviceCount(resp.result[0])
      }
    })
    service.getDeviceCount({
      "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" },
          { "column": "state", "value": "online" },
          { "column": "productId", "value": "GB28181-PRO", "termType": "not" }
        ]
    }).subscribe(resp => {
      if (resp.status === 200) {
        setDeviceOnlineCount(resp.result[0])
      }
    })
    service.getDeviceCount({
      "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" },
          { "column": "state", "value": "offline" },
          { "column": "productId", "value": "GB28181-PRO", "termType": "not" }
        ]
    }).subscribe(resp => {
      if (resp.status === 200) {
        setDeviceOfflineCount(resp.result[0])
      }
    })
    service.getDeviceCount(
      {"terms":[
        {"column": "productId", "value": "onvif-media-device" ,"type":"or"},
        {"column": "productId", "value": "GB28181-PRO","type":"or"}
        ]
        } 
    ).subscribe(resp => {
      if (resp.status === 200) {
        setVideoCount(resp.result[0])
      }
    })
    service.getDeviceCount(
      {
        terms: [
          { column: "productId", value: "onvif-media-device" ,"type":"or"},
          { column: "state", value: "online" },
          {"column": "productId", "value": "GB28181-PRO","type":"or"}
        ]
      }
    ).subscribe(resp => {
      if (resp.status === 200) {
        setVideoOnlineCount(resp.result[0])
      }
    })
    service.getDeviceCount(
      {
        "terms": [
          { "column": "productId", "value": "onvif-media-device" ,"type":"or"},
          {"column": "state", "value": "offline","type":"and"},
          {"column": "productId", "value": "GB28181-PRO","type":"or"},
          {"column": "state", "value": "offline","type":"and"}
          
        ]
      }
    ).subscribe(resp => {
      if (resp.status === 200) {
        setVideoOfflineCount(resp.result[0])
      }
    })
  }, []);

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
              <h2>{videoCount}</h2>
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="green" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>当前在线设备</span>} />
            <div>
              {videoOnlineCount}
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="red" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>离线设备</span>} />
            <div>
              {videoOfflineCount}
            </div>
          </div>
        </div>
        <div className={deviceStyle.content}>
          <div className={deviceStyle.top}>
            <img src={require('@/assets/home/things.png')} alt="" />
            <div>
              <div>物联设备接入总数</div>
              <h2>{deviceCount}</h2>
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="green" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>当前在线设备</span>} />
            <div>
              {deviceOnlineCount}
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="#f50" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>离线设备</span>} />
            <div>
              {deviceOfflineCount}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Device;

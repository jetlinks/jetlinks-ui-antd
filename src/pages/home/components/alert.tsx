import React from 'react';
import Layout from '../items';
import styles from '../index.less';
import deviceStyle from './device.less';
import { Badge } from 'antd';
import Service from './service';
import { useEffect } from 'react';
import { useState } from 'react';

function Alert() {
  const service = new Service('edge/network');
  const [count, setCount] = useState<number>(0);
  const [newerCount, setNewerCount] = useState<number>(0);
  const [solveCount, setSolveCount] = useState<number>(0);

  useEffect(() => {
    service.getAlarmsCount({}).subscribe(resp => {
      if(resp.status === 200){
        setCount(resp.result[0]);
      }
    })
    service.getAlarmsCount({
      "terms":
        [
          { "column": "state", "value": "newer" }
        ]
    }).subscribe(resp => {
      if(resp.status === 200){
        setNewerCount(resp.result[0]);
      }
    })
    service.getAlarmsCount({
      "terms":
        [
          { "column": "state", "value": "solve" }
        ]
    }).subscribe(resp => {
      if(resp.status === 200){
        setSolveCount(resp.result[0]);
      }
    })
  }, []);

  return (
    <div className={`${styles.item} ${styles.alert}`}>
      <Layout
        title='告警记录'
      >
        <div className={deviceStyle.content}>
          <div className={deviceStyle.top}>
            <img src={require('@/assets/home/alarm.png')} alt="" />
            <div>
              <div>总告警次数</div>
              <h2>{count}</h2>
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="green" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>已处理</span>} />
            <div>
              {solveCount}
            </div>
          </div>
          <div className={deviceStyle.bottom}>
            <Badge color="red" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未处理</span>} />
            <div>
              {newerCount}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Alert;

import React, { useState, useCallback, useEffect } from 'react';
import Layout from '../items';
import styles from '../index.less';
import { Descriptions, Input, Button } from 'antd';
import Service from './service';

interface Props {
  data: any;
}

function Basis(props: Props) {

  const service = new Service('edge/network')
  const [isUpdate, setIsUpdate] = useState(false)
  const [value, setValue] = useState('重庆市茶园新区')
  const [input, setInput] = useState('重庆市茶园新区')
  const [info, setInfo] = useState<any>({});


  const updateValue = useCallback(
    (type) => {
      if (type) {
        setValue(input)
      } else {
        setInput(value)
      }
      setIsUpdate(false)
    },
    [input],
  )

  useEffect(() => {
    if (props.data) {
      setInfo(props.data);
      setValue(props.data.geoAdder);
      setInput(props.data.geoAdder);
    }
  }, [props.data]);

  return (
    <div className={`${styles.item} ${styles.basis}`}>
      <Layout
        title='基础信息'
      >
        <Descriptions column={1} bordered size="middle" style={{ height: '241px', width: '100%' }}>
          <Descriptions.Item label="设备名称">{info.edgeName}</Descriptions.Item>
          <Descriptions.Item label="设备ID">{info.deviceId}</Descriptions.Item>
          <Descriptions.Item label="固件版本">{info.firmwareVer}</Descriptions.Item>
          <Descriptions.Item label="操作系统">{info.osInfo}</Descriptions.Item>
          <Descriptions.Item label="地址">{
            isUpdate ?
              <div>
                <Input style={{ width: 'calc(100% - 88px)' }} value={input} onChange={(e) => { setInput(e.target.value) }} />
                <Button type="link" style={{ fontSize: 16 }} onClick={() => { updateValue(false) }}>×</Button>
                <Button type="link" style={{ fontSize: 16 }} onClick={() => { updateValue(true) }}>√</Button>
              </div> :
              <>
                {value} <img src={require('@/assets/home/update.png')} style={{ marginLeft: 6 }} onClick={() => {
                  setIsUpdate(true)
                }} />
              </>
          }</Descriptions.Item>
        </Descriptions>
      </Layout>
    </div>
  );
}

export default Basis;

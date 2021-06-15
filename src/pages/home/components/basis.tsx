import React, { useState, useCallback } from 'react';
import Layout from '../items';
import styles from '../index.less';
import { Descriptions, Input, Button } from 'antd';

function Basis() {

  const [isUpdate, setIsUpdate] = useState(false)
  const [value, setValue] = useState('重庆市茶园新区')
  const [input, setInput] = useState('重庆市茶园新区')


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

  return (
    <div className={`${styles.item} ${styles.basis}`}>
      <Layout
        title='基础信息'
      >
        <Descriptions column={1} bordered size="middle" style={{ height: '241px', width: '100%' }}>
          <Descriptions.Item label="设备名称">边缘网关-pi-test</Descriptions.Item>
          <Descriptions.Item label="设备ID">12345</Descriptions.Item>
          <Descriptions.Item label="固件版本">1.2.1</Descriptions.Item>
          <Descriptions.Item label="操作系统">windows</Descriptions.Item>
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

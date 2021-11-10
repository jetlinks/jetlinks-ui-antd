import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { AtSegmentedControl, AtDivider, AtCard } from 'taro-ui';
import './index.less'

const Detail = () => {

  const [current, setCurrent] = useState<any>(0);

  useEffect(() => {
    const props = Taro.getCurrentInstance().router.params
    console.log(props)
  }, [])

  return (
    <View>
      <View className='tab'>
        <AtDivider height='50' />
        <AtSegmentedControl
          current={current}
          fontSize={40}
          values={['实例信息', '设备告警']}
          onClick={(value) => {
            console.log(value)
            setCurrent(value)
          }}
        />
        {
          current === 0 && <View>
            <AtDivider content='设备信息' />
            <AtCard
              extra='在线'
              title={`设备名称`}
            >
              <View className='item'>设备类型：{ }</View>
              <View className='item'>所属机构: { }</View>
              <View className='item'>连接协议:{ }</View>
              <View className='item'>消息协议: { }</View>
              <View className='item'>IP地址:{ }</View>
              <View className='item'>创建时间: { }</View>
              <View className='item'>注册时间:{ }</View>
              <View className='item'>最后上线时间: { }</View>
              <View className='item'>说明: { }</View>
            </AtCard>
          </View>
        }
        {
          current === 1 && <View>设备告警</View>
        }
      </View>
    </View>
  )
};
export default Detail;

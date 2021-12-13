import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro, { useDidHide, useReady, useDidShow } from '@tarojs/taro';
import DevicePie from '../../components/charts/devicePie';
import Alarm from '../../components/charts/alarm';
import Status from '../../components/charts/status';
import './index.less';
import { getWebSocket } from '../../utils/websocket'

const Index = () => {
  let updata = null;
  // const [num,setNum] = useState<any>();
  const [data, setData] = useState<any>([
    {
      x: '1',
      y: 85
    }
  ])
  const [data1, setData1] = useState<any>([
    {
      x: '1',
      y: 85
    }
  ])
  const deviceData = [{
    name: '设备总数',
    percent: 83,
    a: '1'
  }, {
    name: '当前在线',
    percent: 60,
    a: '1'
  }, {
    name: '未激活',
    percent: 14,
    a: '1'
  }];

  const alarmData = [{
    year: '11.26',
    sales: 145
  }, {
    year: '11.27',
    sales: 121
  }, {
    year: '11.28',
    sales: 100
  }, {
    year: '11.29',
    sales: 97
  }, {
    year: '11.30',
    sales: 85
  }];






  useEffect(() => {
    // console.log(11111111)
  }, [])


  useReady(() => {

  })
  useDidShow(() => {

    getWebSocket(
      `home-page-statistics-cpu-realTime`,
      `/dashboard/systemMonitor/cpu/usage/realTime`,
      {
        params: {
          'history': 1,
        },
      },
    ).then((res: any) => {
      console.log(res)

    })

  })

  useDidHide(() => {

  })


  return (

    <View className='view'>
      <View className='device'>
        <View className='title'>设备统计</View>
        <View className='device-pie'>
          <DevicePie data={deviceData} />
        </View>
      </View>

      <View className='alarm'>
        <View className='title'>告警统计</View>
        <View className='alarmChart'>
          <Alarm data={alarmData} />
        </View>
        <View className='alarmNumber' style={{ fontSize: 14 }}>
          <View style={{ marginLeft: '25px', paddingBottom: 5 }}>今日告警数：11</View>
          <View className='at-row  at-row__justify--center'>
            <View className='at-col at-col-5'>已处理数：11</View>
            <View className='at-col at-col-5'>未处理数：22</View>
          </View>
        </View>
      </View>

      <View className='state'>
        <View className='title'>实时状态</View>
        <View className='statePie'>
          <View style={{ width: '50%' }}> <Status data={data} title='CPU使用率' id='cpu' /></View>
          <View style={{ width: '50%' }}> <Status data={data1} title='JVM使用率' id='jvm' /></View>
        </View>
      </View>

    </View>

  );
};
export default Index;

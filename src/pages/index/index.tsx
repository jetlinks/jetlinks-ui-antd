import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro'
import F2 from '@antv/f2';
import Pie from '../../components/charts/pie';
import DevicePie from '../../components/charts/devicePie'
import './index.less';

const Index = () => {

  const deviceData = [{
    name: '设备总数',
    percent: 83.59,
    a: '1'
  }, {
    name: '当前在线',
    percent: 2.17,
    a: '1'
  }, {
    name: '未激活',
    percent: 14.24,
    a: '1'
  }];
  const data1 = [{
    x: '1',
    cpu: 60
  }];

  useEffect(() => {
  }, [])


  return (

    <View className='view'>
      {/* <View style={{ width: '100%', height: 200 }}><CanvasF2 id='myChart' style={{ width: '100%', height: '100%' }} onInit={initChart} /></View>
      <View style={{ width: '100%', height: 200 }}>
        <Pie data={data1} />
      </View> */}
      <View className='device'>
        <View className='title'>设备统计</View>
        <View className='device-pie'>
          <DevicePie data={deviceData} />
          {/* <Pie data={data1} /> */}
        </View>
      </View>

      <View className='alarm'>
        <View className='title'>告警统计</View>
        <View></View>
      </View>

      <View className='state'>
        <View className='title'>实时状态</View>
        <View></View>
      </View>

    </View>

  );
};
export default Index;

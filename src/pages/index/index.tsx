import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { AtButton, AtList, AtListItem } from 'taro-ui';
import Service from './service';
import encodeQuery from '../../utils/encodeQuery';
import Taro ,{useTabItemTap}from "@tarojs/taro";


const Index = () => {
  const [data, setData] = useState<any>([]);
  const [params, setParams] = useState<any>({
    pageSize: 10,
    sorts: { field: 'name', order: 'desc' }
  })

  const getList = (data: any) => {
    Service.getlist(encodeQuery(data)).then((res: any) => {
      setData(res.data.result.data)
    }).catch(err => {
    })
  }


  useEffect(() => {
    const msg = JSON.stringify({
      id: "instance-info-property-yan-edge-gateway-cpuUsage-jvmMemUsage-sysMemUsage-diskUsage-cpuTemp-11231",
      topic: "/dashboard/device/edge-gateway/properties/realTime",
      type: "sub",
      parameter: {
        deviceId: "yan",
        history: 1,
        properties: ["cpuUsage", "jvmMemUsage", "sysMemUsage", "diskUsage", "cpuTemp", "11231"]
      }
    });
    Taro.connectSocket({
      url: `ws://demo.jetlinks.cn/jetlinks/messaging/7ab4c7232bf6580afd2f4586d368be0f?:X_Access_Token=7ab4c7232bf6580afd2f4586d368be0f`
    }).then((res) => {
      //成功打开发送消息
      res.onOpen(() => {
        console.log('连接成功')
        // res.send({ data: msg })
      })
      //监听
      res.onMessage((msg) => {
        // console.log(msg)
      })
    })

  }, []);

  
  return (
    <View className='index'>
      <AtList>
        <AtListItem
          title='测试'
          note='测试'
          extraText='详细信息'
          arrow='right'
          iconInfo={{ size: 25, color: '#FF4949', value: 'bookmark', }}
        />
        {

          data.map(item =>
          (
            <AtListItem
              key={item.id}
              title={item.name}
              note={item.username}
              extraText='详细信息'
              arrow='right'
              iconInfo={{ size: 25, color: '#FF4949', value: 'bookmark', }}
            />
          ))
        }
      </AtList>

      <AtButton onClick={() => getList(params)} type='secondary' circle>
        加载数据
      </AtButton>
    </View>
  );
};
export default Index;

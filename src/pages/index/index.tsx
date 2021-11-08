import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { AtButton, AtList, AtListItem } from 'taro-ui';

import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
import 'taro-ui/dist/style/components/button.scss'; // 按需引入
import './index.less';

const Index = () => {
  const [data, setData] = useState<any>([]);
  const getData=()=>{
    Taro.request({
      url: 'https://demo.jetlinks.cn/jetlinks/user/_query?pageSize=10',
      header: {
        'x-access-token': '7ab4c7232bf6580afd2f4586d368be0f'
      }
    })
      .then(res => {
        console.log(res.data?.result?.data);
        
        setData(res.data?.result?.data);
      })
      .catch(() => {
        Taro.showToast({
          title: '载入远程数据错误'
        });
      });
  }
  useEffect(() => {
    console.log(data.result,'result');
    
    getData();
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
        
        data.map(item=>
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

      <AtButton onClick={()=>getData()} type='secondary' circle>
        加载数据
      </AtButton>
    </View>
  );
};
export default Index;

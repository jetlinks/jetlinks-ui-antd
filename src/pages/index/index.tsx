import { View } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { AtButton, AtList, AtListItem } from 'taro-ui';
import Service from './service';
import encodeQuery from '../../utils/encodeQuery';

import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
import 'taro-ui/dist/style/components/button.scss'; // 按需引入
import './index.less';

const Index = () => {
  const [data, setData] = useState<any>([]);
  const [params,setParams] = useState<any>({
    pageSize:10,
    sorts: { field: 'name', order: 'desc' }
  })

  const getList = (data:any) =>{
    Service.getlist(encodeQuery(data)).then((res:any)=>{
      setData(res.data.result.data)
    }).catch(err => {
    })
  }
  


  useEffect(() => {
    // getList({
    //   pageSize:10
    // });
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

      <AtButton onClick={()=>getList(params)} type='secondary' circle>
        加载数据
      </AtButton>
    </View>
  );
};
export default Index;

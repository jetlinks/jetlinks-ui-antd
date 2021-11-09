import { View } from "@tarojs/components";
import { AtSearchBar, AtTabs, AtTabsPane, AtMessage, AtCard, AtDivider } from 'taro-ui'
import React, { useEffect, useState } from "react";
import Service from "./service";
import encodeQuery from '../../utils/encodeQuery';

const Device = () => {

  const [searchData, setSearchData] = useState<string>('');
  const [current, setCurrent] = useState<any>(0);
  const [data, setData] = useState<any>([]);
  const [searchParam, setSearchParam] = useState<any>({
    pageSize: 10
  });


  const statusMap = new Map();
  statusMap.set('online', '在线');
  statusMap.set('offline', '离线');
  statusMap.set('notActive', '未启用');
  statusMap.set('all', '全部');

  const tabList = [
    { title: '全部' },
    { title: '在线' },
    { title: '离线' },
    { title: '未启用' }
  ]

  //获取设备列表
  const getDeviceList = (params: any) => {
    Service.getDeviceList(encodeQuery(params))
      .then((res: any) => {
        setData(res.data.result.data)
      })
      .catch(err => <AtMessage>{err}</AtMessage>)
  }

  useEffect(() => {
    getDeviceList(searchParam)
  }, [])

  return (
    <View>
      <AtSearchBar
        value={searchData}
        onChange={(value) => {
          setSearchData(value)
          setSearchParam({
            ...searchParam,
            terms: {
              "name$LIKE": value
            }
          })
        }}
        onActionClick={() => {
          getDeviceList(searchParam)
        }}
      />

      <AtTabs
        current={current}
        tabList={tabList}
        onClick={(value) => {
          setCurrent(value)
          console.log(value)
        }}
      >
        <AtTabsPane index={0} current={current}>
          <View>
            {
              data.map((item: any) => (
                <View style={{paddingTop:10}}>
                  <AtCard
                  note={`ID${item.id}`}
                  extra={item.state.text}
                  title={item.name}
                  thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
                >
                  产品信息：{item.productName}
                </AtCard>
                </View>
              ))
            }
          </View>
        </AtTabsPane>
        <AtTabsPane index={1} current={current}>2</AtTabsPane>
        <AtTabsPane index={2} current={current}>3</AtTabsPane>
        <AtTabsPane index={3} current={current}>4</AtTabsPane>
      </AtTabs>
    </View>
  )
}
export default Device;

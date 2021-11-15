import { View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro"
import { AtSearchBar, AtTabs, AtTabsPane, AtMessage, AtCard, AtButton } from 'taro-ui'
import React, { useEffect, useState } from "react";
import Service from "./service";
import encodeQuery from '../../utils/encodeQuery';

const Device = () => {

  const [searchData, setSearchData] = useState<string>('');
  const [current, setCurrent] = useState<any>(0);
  const [data, setData] = useState<any>([]);
  const [searchParam, setSearchParam] = useState<any>({
    pageIndex: 0,
    pageSize: 10,
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
    setSearchParam(params)
    Service.getDeviceList(encodeQuery(params))
      .then((res: any) => {
        setData(res.data.result.data)
      })
      .catch(err => <AtMessage>{err}</AtMessage>)
  }

  //状态样式
  const extraStyle = (data: any) => {
    if (data === '离线') {
      return { color: 'red' }
    }
    if (data === '在线') {
      return { color: 'green' }
    }
    if (data === '未启用') {
      return { color: 'volcano' }
    }
  }
  //切换标签  value:tabindex data:searchdata
  const changeTab = (value: number, data?: string) => {
    const params ={
      pageIndex: 0,
      pageSize: 10,
    }
    switch (value) {
      case 0: getDeviceList({
        ...params,
        terms: {
          "name$LIKE": data
        }
      }); break;
      case 1: getDeviceList({
        ...params,
        terms: {
          "state": 'online',
          "name$LIKE": data
        }
      }); break;
      case 2: getDeviceList({
        ...params,
        terms: {
          "state": 'offline',
          "name$LIKE": data
        }
      }); break;
      case 3: getDeviceList({
        ...params,
        terms: {
          "state": 'notActive'
          , "name$LIKE": data
        }
      }); break;
    }
  }

  //触底刷新
  useReachBottom(() => {
    if (data && data.length >= 10) {
      const newSearchParam = {
        ...searchParam,
        pageIndex: searchParam.pageIndex + 1,
        pageSize: 10,
      }
      Service.getDeviceList(encodeQuery(newSearchParam))
        .then((res: any) => {
          const newData = res.data.result.data;
          data.push(...newData)
          setSearchParam(newSearchParam)
        })
    }
  })

  useEffect(() => {
    getDeviceList(searchParam)
  }, [])



  return (
    <View>
      <AtSearchBar
        value={searchData}
        onChange={(value) => {
          setSearchData(value)
        }}
        onActionClick={() => {
          changeTab(current, searchData)
        }}
        onClear={() => {
          setSearchData('')
          changeTab(current)
        }}
      />

      <AtTabs
        current={current}
        tabList={tabList}
        onClick={(value) => {
          setCurrent(value)
          changeTab(value)
          setSearchData('')
        }}
      >
        <AtTabsPane index={0} current={current}>
          <View>
            {
              data.map((item: any) => (
                <View style={{ paddingTop: 10, }}>
                  <AtCard
                    note={`ID：${item.id}`}
                    extra={` ${item.state.text} `}
                    extraStyle={extraStyle(item.state.text)}
                    title={item.name}
                    thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/pages/device/detail/index?id=${item.id}`
                      })
                    }}
                  >
                    产品信息：{item.productName}
                  </AtCard>
                </View>
              ))
            }
          </View>
        </AtTabsPane>
        <AtTabsPane index={1} current={current}>
          {
            data.map((item: any) => (
              <View style={{ paddingTop: 10, }}>
                <AtCard
                  note={`ID：${item.id}`}
                  extra={` ${item.state.text} `}
                  extraStyle={extraStyle(item.state.text)}
                  title={item.name}
                  thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/device/detail/index?id=${item.id}`
                    })
                  }}
                >
                  产品信息：{item.productName}
                </AtCard>
              </View>
            ))
          }
        </AtTabsPane>
        <AtTabsPane index={2} current={current}>
          {
            data.map((item: any) => (
              <View style={{ paddingTop: 10, }}>
                <AtCard
                  note={`ID：${item.id}`}
                  extra={` ${item.state.text} `}
                  extraStyle={extraStyle(item.state.text)}
                  title={item.name}
                  thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/device/detail/index?id=${item.id}`
                    })
                  }}
                >
                  产品信息：{item.productName}
                </AtCard>
              </View>
            ))
          }
        </AtTabsPane>
        <AtTabsPane index={3} current={current}>
          {
            data.map((item: any) => (
              <View style={{ paddingTop: 10, }}>
                <AtCard
                  note={`ID：${item.id}`}
                  extra={` ${item.state.text} `}
                  extraStyle={extraStyle(item.state.text)}
                  title={item.name}
                  thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/device/detail/index?id=${item.id}`
                    })
                  }}
                >
                  产品信息：{item.productName}
                </AtCard>
              </View>
            ))
          }
        </AtTabsPane>
      </AtTabs>
    </View>
  )
}
export default Device;

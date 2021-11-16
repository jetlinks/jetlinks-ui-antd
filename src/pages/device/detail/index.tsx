import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { AtSegmentedControl, AtDivider, AtCard, AtList, AtListItem } from 'taro-ui';
import Service from "../service";
import encodeQuery from '../../../utils/encodeQuery';
import './index.less';
import FormatTime from "../../../utils/formatDate";
import Model from "./model";

const Detail = () => {

  const [current, setCurrent] = useState<number>(0);
  const [data, setData] = useState<any>({});
  const [alarmData, setAlarmData] = useState<any>({});
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [modelData, setModelData] = useState<any>({});
  const [searchParam, setSearchParam] = useState<any>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [id, setId] = useState<string>('')

  const extraStyle = (data: any) => {
    if (data === '离线' || data === 'newer') {
      return { color: 'red' }
    }
    if (data === '在线' || data === 'solve') {
      return { color: 'green' }
    }
    if (data === '未启用') {
      return { color: 'volcano' }
    }
  }

  //获取设备信息
  const getInfo = (id: string) => {
    Service.getInfo(id).then((res: any) => {
      setData(res.data.result)
    })
  }
  //获取告警
  const getAlarmLog = (params: any) => {
    setSearchParam(params)
    Service.getAlarmLog(encodeQuery(params)).then((res: any) => {
      setAlarmData(res.data.result.data)
      console.log(res.data.result)
    })
  }

  //触底刷新
  useReachBottom(() => {
    if (alarmData && alarmData.length >= 10 && current === 1) {
      const newSearchParam = {
        ...searchParam,
        pageIndex: searchParam.pageIndex + 1,
        pageSize: 10,
      }
      Service.getAlarmLog(encodeQuery(newSearchParam))
        .then((res: any) => {
          const newData = res.data.result.data;
          alarmData.push(...newData)
          setSearchParam(newSearchParam)
        })
    }
  })

  useEffect(() => {
    const props = Taro.getCurrentInstance().router.params
    if (props.id) {
      getInfo(props.id)
      setId(props.id)
      getAlarmLog({
        ...searchParam,
        sorts: {
          order: 'descend',
          field: 'alarmTime',
        },
        terms: {
          deviceId: props.id
        }
      })
    }
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
            setCurrent(value)
          }}
        />
        {
          //实例信息
          current === 0 && <View>
            <AtDivider content='设备信息' />
            <AtCard
              extra={data?.state?.text}
              extraStyle={extraStyle(data?.state?.text)}
              title={data.name}
            >
              <View className='item'>
                <View>设备类型：</View>
                <View className='itemText'>{data.deviceType?.text || '/'}</View>
              </View>
              <View className='item'>
                <View>所属机构：</View>
                <View className='itemText'>{data.orgName || '/'}</View>
              </View>
              <View className='item'>
                <View>连接协议：</View>
                <View className='itemText'>{data.transport || '/'}</View>
              </View>

              <View className='item'>
                <View>消息协议</View>
                <View className='itemText'>{data.protocol || data.protocolName}</View>
              </View>
              <View className='item'>
                <View>IP地址</View>
                <View className='itemText'>{data.address || '/'}</View>
              </View>
              <View className='item'>
                <View>创建时间</View>
                <View className='itemText'>{FormatTime(data.createTime, 'Y-M-D h:m:s') || '/'}</View>
              </View>
              <View className='item'>
                <View>注册时间</View>
                <View className='itemText'>{FormatTime(data.registerTime, 'Y-M-D h:m:s') || '/'}</View>
              </View>
              <View className='item'>
                <View>最后上线时间</View>
                <View className='itemText'>{FormatTime(data.onlineTime, 'Y-M-D h:m:s') || '/'}</View>
              </View>
              <View className='item'>
                <View>说明</View>
                <View className='itemText'>{data.describe || data.description || '/'}</View>
              </View>
            </AtCard>
            <AtDivider content='运行状态' />
            <AtList>
              <AtListItem title='CPU使用率' extraText='33' />
              <AtListItem title='JVM内存使用率' extraText='44' />
              <AtListItem title='系统内存使用率' extraText='22' />
              <AtListItem title='磁盘使用率' extraText='42' />
              <AtListItem title='CPU温度' extraText='24' />
            </AtList>
            <AtDivider />
          </View>
        }
        {
          //设备告警
          current === 1 && <View style={{display:'flex',justifyContent:'center'}}>
            {
              alarmData.length !== 0 ?
                alarmData.map((item: any) => (
                  <View style={{ paddingTop: 10 }}>
                    <AtCard
                      note={`告警时间:${FormatTime(item.alarmTime, 'Y-M-D h:m:s')}`}
                      extra={item.state === 'solve' ? '已处理' : '未处理'}
                      title={`告警名称:${item.alarmName}`}
                      extraStyle={extraStyle(item.state)}
                      onClick={() => {
                        setIsOpened(true)
                        setModelData(item)
                      }}
                    >
                      <View className='item'>
                        <View>设备ID：</View>
                        <View className='itemText'>{item.deviceId}</View>
                      </View>
                      <View className='item'>
                        <View>设备名称：</View>
                        <View className='itemText'>{item.deviceName}</View>
                      </View>
                    </AtCard>
                  </View>
                ))
                : <View className='itemNone'>
                  暂无数据
                </View>
            }
          </View>
        }
      </View>
      {
        isOpened && <Model
          close={() => {
            setIsOpened(false)
            getAlarmLog({
              pageIndex: 0,
              pageSize: 10,
              sorts: {
                order: 'descend',
                field: 'alarmTime',
              },
              terms: {
                deviceId: id
              }
            })
          }}
          data={modelData}
        />
      }
    </View>
  )
};
export default Detail;

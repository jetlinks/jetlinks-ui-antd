import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import {  AtList, AtListItem } from 'taro-ui';

interface Props{
    data:any;
}

const Status: React.FC<Props> = (props) =>  {

    useEffect(()=>{
        // const properties=JSON.parse(props?.data)
        // console.log(properties)
        // const json = props.data
        // const properties = JSON.parse(json)
        // console.log(properties)
    },[])

    return (
        <View>
            <AtList>
              <AtListItem title='CPU使用率' extraText='33' onClick={()=>{
                  const json = props.data
                  const properties = JSON.parse(json)
                  console.log(properties)
              }}/>
              <AtListItem title='JVM内存使用率' extraText='44' />
              <AtListItem title='系统内存使用率' extraText='22' />
              <AtListItem title='磁盘使用率' extraText='42' />
              <AtListItem title='CPU温度' extraText='24' />
            </AtList>
        </View>
    )
}
export default Status;
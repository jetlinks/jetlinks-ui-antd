import React from 'react';
import {InputNumber} from "antd";

const TimeOut = (props: any) => {
  return (
      <>
        <InputNumber {...props} style={{ width: 'calc(100% - 30px)'}} placeholder={'请输入'} min={0} max={999999} />
        <span style={{ paddingLeft: 8 }}>ms</span>
      </>
    )
}
export default TimeOut

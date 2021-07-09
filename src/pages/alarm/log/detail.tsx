import React from 'react';
import { Modal, Icon } from 'antd';

interface Props {
  visible?: boolean
  data?: object
  datalist:any
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function Detail(props: Props) {
const { onOk, ...extra } = props
  const OnOk = () => {
    if (props.onOk) {
      console.log(props.data)
      props.onOk()
    }
  }
const  content=JSON.stringify(props.datalist.alarmData, null, 2)
  return (
    <Modal
      title='详情'
      onOk={OnOk}
      {...extra}
      width='570px'
    >
      <div style={{color:'#000000'}}>
        <div>
            <p style={{fontSize:14,fontWeight:400}}>告警数据<Icon type="question-circle-o" style={{paddingLeft: 10}}/></p>
            <div><pre>{content}</pre></div>
        </div>
        <div style={{marginTop:10}}>
            <div
                style={{display:'flex',justifyItems:'center'}}
            >处理结果：{props.datalist.state !=='solve' ? <div style={{color:'#FF4D4F'}}>-</div>:<div style={{color:'#52C41A'}}>{props.datalist.description}</div>} </div>
        </div>
      </div>
    </Modal>
  );
}

export default Detail;

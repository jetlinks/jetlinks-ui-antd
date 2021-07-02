import React from 'react';
import { Modal, Icon } from 'antd';
import { useState } from 'react';

interface Props {
  visible?: boolean
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function Detail(props: Props) {
const [show, setShow] = useState(false)
  const { onOk, ...extra } = props

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title='详情'
      onOk={OnOk}
      {...extra}
      width='570px'
    >
      <div style={{height:332,color:'#000000'}}>
        <div>
            <p style={{fontSize:14,fontWeight:400}}>告警数据<Icon type="question-circle-o" style={{paddingLeft: 10}}/></p>
            <div>[***************]</div>
        </div>
        <div style={{marginTop:10}}>
            <div
                style={{display:'flex',justifyItems:'center'}}
            >处理结果：{show ? <div style={{color:'#FF4D4F'}}>未处理</div>:<div style={{color:'#52C41A'}}>已处理</div>} </div>
        </div>
      </div>
    </Modal>
  );
}

export default Detail;

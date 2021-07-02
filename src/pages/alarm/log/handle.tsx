import React from 'react';
import { Modal, Input } from 'antd';
import { useState } from 'react';

interface Props {
  visible?: boolean
  data?: object
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

function Handle(props: Props) {
  const { onOk, ...extra } = props

  const OnOk = () => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }

  return (
    <Modal
      title='告警处理结果'
      onOk={OnOk}
      {...extra}
      width='570px'
    >
      <div>
          <div style={{paddingBottom:10}}>处理结果</div>
          <Input.TextArea placeholder='请输入处理结果' rows={10} />
      </div>
    </Modal>
  );
}

export default Handle;

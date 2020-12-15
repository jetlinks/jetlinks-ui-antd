import { Modal, Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState } from 'react';

interface Props extends FormComponentProps {
    close: Function,
    save: Function
}
const Add: React.FC<Props> = props => {
    const [node, setNode] = useState('');

    return (
        <Modal
            title='新增'
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => {
                props.save(node)
            }}
            style={{ marginTop: '-3%' }}
            width="50%"
            onCancel={() => props.close()}
        >
            <p style={{display: 'flex', justifyContent: "center", alignItems: "center"}}>
               <label>serverId: </label><Input placeholder="请输入" onChange={(e) => {
                    setNode(e.target.value)
                }} />
            </p>
        </Modal>
    )
}

export default Form.create<Props>()(Add);

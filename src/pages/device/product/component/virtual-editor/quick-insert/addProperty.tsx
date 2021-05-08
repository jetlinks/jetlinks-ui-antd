import React, { useEffect, useState } from "react";
import { Modal, Radio } from "antd";

interface Props {
    close: Function;
    ok: Function;
    data: any;
}

const PropertyComponent: React.FC<Props> = (props) => {

    const radioStyle = {
        display: 'block',
        height: '40px',
        lineHeight: '40px',
    };
    const [value, setValue] = useState<string>(`$recent("${props.data.id}")`);

    return (
        <Modal
            visible
            width={650}
            title="请选择使用值"
            onCancel={() => {props.close()}}
            onOk={() => {
                props.ok(value)
            }}
        >
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Radio.Group onChange={(e) => {
                    setValue(e.target.value);
                }} value={value}>
                    <Radio style={radioStyle} value={`$recent("${props.data.id}")`}>
                        <span>
                            <span style={{marginRight: '10px'}}>$recent 实时值</span>
                            <span style={{color: 'lightgray'}}>（实时值为空时获取上一有效值补齐，实时值不为空则使用实时值）</span>
                        </span>
                    </Radio>
                    <Radio style={radioStyle} value={`$lastState("${props.data.id}")`}>
                        <span>
                            <span style={{marginRight: '10px'}}>上一值</span>
                            <span style={{color: 'lightgray'}}>（实时值的上一有效值）</span>
                        </span>
                    </Radio>
                </Radio.Group>
            </div>
        </Modal>
    );
}
export default PropertyComponent;
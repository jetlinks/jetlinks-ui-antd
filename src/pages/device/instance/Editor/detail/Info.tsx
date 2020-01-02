import React from "react";
import { Card, Descriptions } from "antd";
import { DeviceInstance } from "../../data";

interface Props {
    data: Partial<DeviceInstance>;
}
interface State {

}
const Info: React.FC<Props> = (props) => {

    return (
        <div>
            <Card
                style={{ marginBottom: 20 }}
                title='基本信息'
            >
                <Descriptions>
                    <Descriptions.Item label="设备名称">
                        {props.data.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="设备类型">
                        {props.data.productName}
                    </Descriptions.Item>
                    <Descriptions.Item label="设备类型">
                        {props.data.deviceType}
                    </Descriptions.Item>
                    <Descriptions.Item label="链接协议">
                        {props.data.transportProtocol}
                    </Descriptions.Item>
                    <Descriptions.Item label="消息协议">
                        {props.data.messageProtocol}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions column={24}>
                    <Descriptions.Item label="描述">
                        {props.data.describe}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}

export default Info;

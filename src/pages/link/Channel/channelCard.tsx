import { Badge } from "antd";
import classNames from "classnames";
import { useState } from "react";
import './index.less'
interface Props {
    actions: any;
    onClick: Function;
    active: boolean;
    data: any;
    defaultActiveKey?: any;
}

const ChannelCard = (props: Props) => {
    const [actions, setActions] = useState<boolean>(false)
    const connectImg = require('/public/images/channel/connect.png')
    const disconnectImg = require('/public/images/channel/disconnect.png')

    return (
        <div
            className={
                classNames("channel-card",
                    {
                        active: props.active,
                        connect: props.data.status === 'connect',
                        disconnect: props.data.status === 'disconnect'
                    }
                )}
            onMouseEnter={() => { setActions(true) }}
            onMouseLeave={() => { setActions(false) }}
        >
            <div
                className="channel-card-top"
                onClick={() => { props.onClick() }}
            >
                <div className="card-top-img"> <img src={props.data.status === 'connect' ? connectImg : disconnectImg} /></div>
                <div className="card-top-name">这里是通道名称</div>
                <div className="card-top-status">
                    {props.data.status === 'connect' ?
                        <Badge status="processing" color={'green'} text={'正常'} /> :
                        <Badge status="processing" color={'red'} text={'禁用'} />}
                </div>
            </div>
            {
                actions && <div className="channel-card-actions">
                    {props.actions}
                </div>
            }

        </div>
    )
}
export default ChannelCard;
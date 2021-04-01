import React from 'react';
import { Card, Tabs } from 'antd';
import CompositeGateway from './composit-gateway';
import Device from './device';

interface Props{
    device: any
}

const Network: React.FC<Props> = props => {

    return (
        <Card>
            <Tabs defaultActiveKey="1" tabPosition="top" type="card">
                    <Tabs.TabPane tab="复合网关" key="1">
                        <CompositeGateway device={props.device}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="设备管理" key="2">
                        <Device device={props.device}/>
                    </Tabs.TabPane>
                </Tabs>
        </Card>
    )
};

export default Network;

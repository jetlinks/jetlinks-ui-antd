import React, { useState } from 'react';
import { Card, Spin, Tabs } from 'antd';
import RuleInstance from './instatnce';
import Scene from './scene';

interface Props{
    device: any
}

const RuleEngine: React.FC<Props> = props => {

    const [spinning, setSpinning] = useState(false);

    return (
        <Card>
            <Spin spinning={spinning}>
                <Tabs defaultActiveKey="1" tabPosition="top" type="card">
                    <Tabs.TabPane tab="规则实例" key="1">
                        <RuleInstance device={props.device}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="场景联动" key="2">
                        <Scene device={props.device}/>
                    </Tabs.TabPane>
                </Tabs>
            </Spin>
        </Card>
    )
};

export default RuleEngine;

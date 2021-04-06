import React, { useState } from 'react';
import { Card, Spin, Tabs } from 'antd';
import Add from './add';
import MediaCascade from './cascade';
import Basic from './basic';

interface Props{
    device: any
}

const Video: React.FC<Props> = props => {

    const [spinning, setSpinning] = useState(false);

    return (
        <Card>
            <Spin spinning={spinning}>
                <Tabs defaultActiveKey="1" tabPosition="top" type="card">
                    <Tabs.TabPane tab="视频设备" key="1">
                        <Add device={props.device}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="国标级联" key="2">
                        <MediaCascade device={props.device}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="流媒体服务" key="3">
                        <Basic device={props.device}/>
                    </Tabs.TabPane>
                </Tabs>
            </Spin>
        </Card>
    )
};

export default Video;

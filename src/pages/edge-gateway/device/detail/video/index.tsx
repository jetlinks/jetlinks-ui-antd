import React from 'react';
import { Card, Tabs } from 'antd';
import Add from './add';
import MediaCascade from './cascade';
import Basic from './basic';

interface Props{
    device: any,
    edgeTag: boolean,
}

const Video: React.FC<Props> = props => {

    return (
        <Card>
            <div>
                <Tabs defaultActiveKey="1" tabPosition="top" type="card">
                    <Tabs.TabPane tab="视频设备" key="1">
                        <Add device={props.device} edgeTag={props.edgeTag}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="国标级联" key="2">
                        <MediaCascade device={props.device}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="流媒体服务" key="3">
                        <Basic device={props.device}/>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Card>
    )
};

export default Video;

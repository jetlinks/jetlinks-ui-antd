import {PageHeaderWrapper} from "@ant-design/pro-layout"
import {Card, Tabs} from 'antd';
import React from "react";
import GatewayInfo from "@/pages/media/gateway/save/index";
import MediaServer from "@/pages/media/media-server/save/index"

interface Props {

}

const MediaDevice: React.FC<Props> = () => {

  return (
    <PageHeaderWrapper title="基本配置">
      <Card style={{width: '60%',marginLeft:'20%'}}>
        <Tabs>
          <Tabs.TabPane tab="流媒体服务配置" key="MediaServer">
            <MediaServer loading={true}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="信令服务配置" key="GatewayInfo">
            <GatewayInfo loading={true}/>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
};
export default MediaDevice;

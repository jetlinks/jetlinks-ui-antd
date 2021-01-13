import {PageHeaderWrapper} from "@ant-design/pro-layout"
import {Card, Col, Row} from "antd";
import React from "react";
import GatewayInfo from "@/pages/media/gateway/save/index";
import MediaServer from "@/pages/media/media-server/save/index"

interface Props {

}

const MediaDevice: React.FC<Props> = () => {

  return (
    <PageHeaderWrapper title="基本配置">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="信令服务配置">
            <GatewayInfo/>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="流媒体服务配置">
            <MediaServer/>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
};
export default MediaDevice;

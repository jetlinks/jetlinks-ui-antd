import React, { Suspense } from "react";
import { GridContent } from "@ant-design/pro-layout";
import PageLoading from "@/pages/analysis/components/PageLoading";
import IntroduceTenant from "@/pages/analysis/components/Tenant/TenantTop/IntroduceTenant";
import { Col, Row } from "antd";
import TenantDevice from "@/pages/analysis/components/Tenant/TenantDevice";
import TenantAlarm from "@/pages/analysis/components/Tenant/TenantAlarm";


interface Props {

}

const TenantAnalysis: React.FC<Props> = (props) => {
  return (
    <GridContent>
      <React.Fragment>
        <Suspense fallback={<PageLoading />}>
          <IntroduceTenant />
        </Suspense>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TenantDevice />
            </Suspense>
          </Col>
          {/* <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TenantAlarm />
            </Suspense>
          </Col> */}
        </Row>
      </React.Fragment>
    </GridContent>
  );
};
export default TenantAnalysis;

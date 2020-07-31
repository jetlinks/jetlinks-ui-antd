import React, {Suspense} from "react";
import {GridContent} from "@ant-design/pro-layout";
import PageLoading from "@/pages/analysis/components/PageLoading";
import IntroduceTenant from "@/pages/analysis/components/Tenant/IntroduceTenant";


interface Props {

}

const TenantAnalysis: React.FC<Props> = (props) => {
  return (
    <GridContent>
      <React.Fragment>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceTenant/>
        </Suspense>
      </React.Fragment>
    </GridContent>
  );
};
export default TenantAnalysis;

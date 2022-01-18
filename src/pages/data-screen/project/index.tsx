import React from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {getAccessToken} from '@/utils/authority';

const Screen = () => {

  const token = getAccessToken();

  return (
    <PageHeaderWrapper title="项目管理">
      <iframe
        style={{width: '100%', height: '800px'}}
        src={`http://117.78.17.29/jetlinks-view/api/implant/v3/project/${token}`}
        frameBorder="0">
      </iframe>
    </PageHeaderWrapper>
  )
};

export default Screen;

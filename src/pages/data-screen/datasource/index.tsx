import React, { useEffect, useState } from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {getAccessToken} from '@/utils/authority';
import api from '@/services'
import { message } from "antd";

const DataSource = () => {

  const token = getAccessToken();
  const [url, setUrl] = useState('');

  useEffect(() => {
    // 获取跳转url
    api.screen.getUrl().then((res) => {
      if(res.status === 200){
        if(res.result.urls['big-screen-datasource'] !== ''){
          setUrl(res.result.urls['big-screen-datasource'] )
        }else{
          message.error('配置错误,请联系管理员');
        }
      }
    });
  }, []);

  return (
    <PageHeaderWrapper title="数据源管理">
      <iframe
        style={{width: '100%', height: '800px'}}
        src={`${url.replace('{token}', token)}`}
        frameBorder="0">
      </iframe>
    </PageHeaderWrapper>
  )
};

export default DataSource;

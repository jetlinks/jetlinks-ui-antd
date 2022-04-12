// 视频分屏
import { PageContainer } from '@ant-design/pro-layout';
import { Card, message } from 'antd';
import LeftTree from './tree';
import { ScreenPlayer } from '@/components';
import { ptzStart, ptzStop, ptzTool } from './service';
import { useState } from 'react';
import './index.less';

const SplitScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [url, setUrl] = useState('');

  const mediaStart = async (dId: string, cId: string) => {
    setChannelId(dId);
    setDeviceId(cId);
    const resp = await ptzStart(dId, cId);
    if (resp.status === 200) {
      setUrl(resp.result.mp4);
    } else {
      message.error(resp.result);
    }
  };

  return (
    <PageContainer>
      <Card>
        <div className="split-screen">
          <LeftTree onSelect={mediaStart} />
          <div className="right-content">
            <ScreenPlayer
              id={deviceId}
              url={url}
              channelId={channelId}
              onMouseUp={(id, cId) => {
                ptzStop(id, cId);
              }}
              onMouseDown={(id, cId, type) => {
                ptzTool(id, cId, type, 90);
              }}
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
export default SplitScreen;

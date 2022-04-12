// 视频分屏
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import LeftTree from './tree';
import { ScreenPlayer } from '@/components';
import { ptzStop, ptzTool } from './service';
import { useRef, useState } from 'react';
import { ptzStart } from './service';
import './index.less';

const SplitScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const [channelId, setChannelId] = useState('');
  const player = useRef<any>(null);

  const mediaStart = async (dId: string, cId: string) => {
    setChannelId(cId);
    setDeviceId(dId);
    const url = ptzStart(dId, cId, 'mp4');
    player.current?.replaceVideo(dId, cId, url);
  };

  return (
    <PageContainer>
      <Card>
        <div className="split-screen">
          <LeftTree onSelect={mediaStart} />
          <div className="right-content">
            <ScreenPlayer
              ref={player}
              id={deviceId}
              channelId={channelId}
              onMouseUp={(id, cId) => {
                ptzStop(id, cId);
              }}
              onMouseDown={(id, cId, type) => {
                ptzTool(id, cId, type);
              }}
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
export default SplitScreen;

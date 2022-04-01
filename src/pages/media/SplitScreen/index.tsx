// 视频分屏
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import LeftTree from './tree';
import { ScreenPlayer } from '@/components';
import { ptzStop, ptzTool } from './service';
import { useState } from 'react';
import './index.less';

const SplitScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const [channelId] = useState('');
  const [url] = useState('');

  return (
    <PageContainer>
      <Card>
        <div className="split-screen">
          <LeftTree
            onSelect={(id) => {
              setDeviceId(id);
            }}
          />
          <div className="right-content">
            <ScreenPlayer
              id={deviceId}
              url={url}
              channelId={channelId}
              onMouseLeave={(id, cId) => {
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

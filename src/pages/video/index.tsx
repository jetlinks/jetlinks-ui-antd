import React from 'react';
import TabsPage from '@/components/TabsPage';
import Configuration from './configuration';
import Device from './device';
import Cascade from './cascade';

const { TabsPane } = TabsPage

function Video() {
  return (
    <div style={{ height: '100%' }}>
      <TabsPage>
        <TabsPane title='国标配置' key='/configuration' International='National standard configuration' img={require('@/assets/video/guobiao.png')}>
          <Configuration />
        </TabsPane>
        <TabsPane title='视频设备' key='/device' International='Video equipment' img={require('@/assets/video/shebei.png')}>
          <Device />
        </TabsPane>
        <TabsPane title='国标级联' key='/cascade' International='National standard cascade' img={require('@/assets/video/jilian.png')}>
          <Cascade />
        </TabsPane>
      </TabsPage>
    </div>
  );
}

export default Video;

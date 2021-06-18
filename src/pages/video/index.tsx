import React from 'react';
import TabsPage from '@/components/TabsPage';
import Configuration from './configuration';
import Devicce from './device';
import Cascade from './cascade';

const { TabsPane } = TabsPage

function Video() {
  return (
    <div style={{ height: '100%' }}>
      <TabsPage>
        <TabsPane title='国标配置' key={1} International='National standard configuration' img={require('@/assets/video/guobiao.png')}>
          <Configuration />
        </TabsPane>
        <TabsPane title='视频设备' key={2} International='Video equipment' img={require('@/assets/video/shebei.png')}>
          <Devicce />
        </TabsPane>
        <TabsPane title='国标级联' key={3} International='National standard cascade' img={require('@/assets/video/jilian.png')}>
          <Cascade />
        </TabsPane>
      </TabsPage>
    </div>
  );
}

export default Video;

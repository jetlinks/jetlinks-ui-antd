import React from 'react';
import TabsPage from '@/components/TabsPage';

const { TabsPane } = TabsPage

function Video() {
  return (
    <div>
      <TabsPage>
        <TabsPane title='国标配置' key={1} International='National standard configuration' img={require('@/assets/video/guobiao.png')}>
          <div>
            测试1
          </div>
        </TabsPane>
        <TabsPane title='视频设备' key={2} International='Video equipment' img={require('@/assets/video/shebei.png')}>
          <div>
            测试2
          </div>
        </TabsPane>
        <TabsPane title='国标级联' key={3} International='National standard cascade' img={require('@/assets/video/jilian.png')}>
          <div>
            测试3
          </div>
        </TabsPane>
      </TabsPage>
    </div>
  );
}

export default Video;

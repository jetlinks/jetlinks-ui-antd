import React from 'react';
import TabsPage from '@/components/TabsPage';
import Setting from './setting';
import Records from './records';

const { TabsPane } = TabsPage

function Rule() {
  return (
    <div style={{ height: '100%' }}>
      <TabsPage>
        <TabsPane title='规则引擎配置' key='/setting' International='National standard configuration' img={require('@/assets/video/guobiao.png')}>
          <Setting />
        </TabsPane>
        <TabsPane title='规则引擎记录' key='/device' International='Video equipment' img={require('@/assets/video/shebei.png')}>
          <Records />
        </TabsPane>
      </TabsPage>
    </div>
  );
}

export default Rule;

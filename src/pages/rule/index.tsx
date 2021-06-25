import React from 'react';
import TabsPage from '@/components/TabsPage';
import Setting from './setting';
import Records from './records';

const { TabsPane } = TabsPage

function Rule() {
  return (
    <div style={{ height: '100%' }}>
      <TabsPage>
        <TabsPane title='规则引擎配置' key='/setting' International='Rules engine setting' img={require('@/assets/rule/top1.png')}>
          <Setting />
        </TabsPane>
        <TabsPane title='规则引擎记录' key='/device' International='Rules engine records' img={require('@/assets/rule/top2.png')}>
          <Records />
        </TabsPane>
      </TabsPage>
    </div>
  );
}

export default Rule;

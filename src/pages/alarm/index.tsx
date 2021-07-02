import React from 'react';
import TabsPage from '@/components/TabsPage';
import Setting from './setting';
import Log from './log';

const { TabsPane } = TabsPage

function Alarm() {
  return (
    <div style={{ height: '100%' }}>
      <TabsPage>
        <TabsPane title='告警配置' key='/setting' International='Alarm setting' img={require('@/assets/alarm/alarm.png')}>
          <Setting />
        </TabsPane>
        <TabsPane title='告警记录' key='/log' International='Alarm Log' img={require('@/assets/alarm/log.png')}>
          <Log />
        </TabsPane>
      </TabsPage>
    </div>
  );
}

export default Alarm;

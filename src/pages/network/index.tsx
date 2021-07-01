import React from 'react';
import TabsPage from '@/components/TabsPage';
import Material from './material';
import Device from './device';

function Network() {

  return (
    <div>
      <TabsPage>
        <TabsPage title='物管理' key={1} International='Material management' img={require('@/assets/network/wuguanli.png')}>
          <Material />
        </TabsPage>
        <TabsPage title='设备管理' key={2} International='Device management' img={require('@/assets/network/shebeiguanli.png')}>
          <Device />
        </TabsPage>
      </TabsPage>
    </div>
  );
}

export default Network;

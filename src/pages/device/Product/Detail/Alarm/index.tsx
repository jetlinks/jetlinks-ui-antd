import { Tabs } from 'antd';
import Setting from '@/pages/device/Product/Detail/Alarm/Setting';
import Record from '@/pages/device/Product/Detail/Alarm/Record';

const Alarm = () => {
  return (
    <Tabs>
      <Tabs.TabPane key="setting" tab="告警设置">
        <Setting />
      </Tabs.TabPane>
      <Tabs.TabPane key="record" tab="告警记录">
        <Record />
      </Tabs.TabPane>
    </Tabs>
  );
};
export default Alarm;

import { Tabs } from 'antd';
import Setting from '@/pages/device/Product/Detail/Alarm/Setting';
import Record from '@/pages/device/Product/Detail/Alarm/Record';
import { useIntl } from '@@/plugin-locale/localeExports';

const Alarm = () => {
  const intl = useIntl();
  return (
    <Tabs>
      <Tabs.TabPane
        key="setting"
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.alarm',
          defaultMessage: '告警设置',
        })}
      >
        <Setting />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="record"
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.alarmLog',
          defaultMessage: '告警记录',
        })}
      >
        <Record />
      </Tabs.TabPane>
    </Tabs>
  );
};
export default Alarm;

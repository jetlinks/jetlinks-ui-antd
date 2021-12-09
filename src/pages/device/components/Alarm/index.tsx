import { Tabs } from 'antd';
import Setting from './Setting';
import Record from './Record';
import { useIntl } from '@@/plugin-locale/localeExports';
import Service from './service';

interface Props {
  type: 'product' | 'device';
}

export const service = new Service();

const Alarm = (props: Props) => {
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
        <Setting type={props.type} />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="record"
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.alarmLog',
          defaultMessage: '告警记录',
        })}
      >
        <Record type={props.type} />
      </Tabs.TabPane>
    </Tabs>
  );
};
export default Alarm;

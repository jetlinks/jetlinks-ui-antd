import type { AlarmRecord } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';

const Record = () => {
  const intl = useIntl();
  const columns: ProColumns<AlarmRecord>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.alarmLog.deviceId',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.alarmLog.deviceName',
        defaultMessage: '设备ID',
      }),
      dataIndex: 'deviceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.time',
        defaultMessage: '告警时间',
      }),
      dataIndex: 'alarmTime',
      defaultSortOrder: 'descend',
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.alarm.status',
        defaultMessage: '处理状态',
      }),
      dataIndex: 'state',
    },
  ];

  return <ProTable columns={columns} rowKey="id" search={false} />;
};
export default Record;

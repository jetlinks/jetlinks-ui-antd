import type { AlarmRecord } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { service } from '@/pages/device/components/Alarm';
import { useParams } from 'umi';

interface Props {
  type: 'device' | 'product';
}

const Record = (props: Props) => {
  const { type } = props;
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
      valueType: 'dateTime',
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

  const params = useParams<{ id: string }>();
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      request={(param) => service.record(param)}
      pagination={{
        pageSize: 10,
      }}
      defaultParams={{
        [`${type}Id`]: params.id,
      }}
      search={false}
    />
  );
};
export default Record;

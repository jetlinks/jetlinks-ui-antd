import type { AlarmRecord } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';

const Record = () => {
  const columns: ProColumns<AlarmRecord>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      defaultSortOrder: 'descend',
      sorter: true,
    },
    {
      title: '处理状态',
      dataIndex: 'state',
    },
  ];

  return <ProTable columns={columns} rowKey="id" search={false} />;
};
export default Record;

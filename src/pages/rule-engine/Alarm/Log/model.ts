import { model } from '@formily/reactive';
import type { ProColumns } from '@jetlinks/pro-table';

export const AlarmLogModel = model<{
  tab: string;
  current: Partial<AlarmLogItem>;
  solveVisible: boolean;
  logVisible: boolean;
  defaultLevel: {
    level: number;
    title: string;
  }[];
  columns: ProColumns<AlarmLogHistoryItem>[];
}>({
  tab: 'all',
  current: {},
  solveVisible: false,
  logVisible: false,
  defaultLevel: [],
  columns: [
    {
      dataIndex: 'alarmTime',
      title: '告警时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'alarmConfigName',
      title: '告警名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'description',
      title: '说明',
      hideInSearch: true,
    },
    {
      dataIndex: 'action',
      title: '操作',
      hideInSearch: true,
      valueType: 'option',
    },
  ],
});

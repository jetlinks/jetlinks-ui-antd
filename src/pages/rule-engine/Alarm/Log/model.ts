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
  tab: 'product',
  current: {},
  solveVisible: false,
  logVisible: false,
  defaultLevel: [],
  columns: [
    {
      dataIndex: 'alarmTime',
      title: '告警时间',
    },
    {
      dataIndex: 'alarmName',
      title: '告警名称',
    },
    {
      dataIndex: 'description',
      title: '说明',
    },
    {
      dataIndex: 'action',
      title: '操作',
    },
  ],
});

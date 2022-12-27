type AlarmLogItem = {
  id?: string;
  name: string;
  alarmConfigId: string;
  alarmName: string;
  targetType: string;
  targetName: string;
  targetTypeName: string;
  alarmDate: number;
  level: number;
  description?: string;
  state: Record<string, any>;
  alarmTime?: number | string;
};

type AlarmLogSolveHistoryItem = {
  id: string;
  alarmId: string;
  alarmRecordId: string;
  handleType: string;
  description: string;
  creatorId?: string;
  createTime: number;
};

type AlarmLogHistoryItem = {
  id: string;
  alarmId: string;
  alarmConfigId: string;
  alarmConfigName: string;
  alarmRecordId: string;
  level: number;
  description: string;
  alarmTime?: number;
  targetType: string;
  targetName: string;
  targetId: string;
  alarmInfo: string;
};

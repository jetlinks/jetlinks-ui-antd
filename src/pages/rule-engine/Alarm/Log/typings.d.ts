type AlarmLogItem = {
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
};

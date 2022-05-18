type NotifitionSubscriptionItem = {
  id?: string;
  subscribeName: string;
  topicProvider: string;
  topicConfig: {
    alarmConfigId: string;
    alarmConfigName: string;
  };
};

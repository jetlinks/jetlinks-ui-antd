export const WebsocketTopic = {
  CPURealTime: {
    id: 'analysis-cpu-realtime',
    topic: '/dashboard/systemMonitor/cpu/usage/realTime',
  },
  JVMRealTime: {
    id: 'analysis-jvm-realTime',
    topic: '/dashboard/jvmMonitor/memory/info/realTime',
  },
};
export default WebsocketTopic;

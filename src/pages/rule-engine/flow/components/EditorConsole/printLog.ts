import PubSub from 'pubsub-js';

export interface LogItem {
    level: string;
    content: string;
}

const printLog = (log: LogItem) => {
    // PubSub.unsubscribe("rule-engine-log");
    PubSub.publish('rule-engine-log', log);

}
export default printLog;
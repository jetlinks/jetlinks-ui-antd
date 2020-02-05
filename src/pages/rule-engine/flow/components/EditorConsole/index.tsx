import { Tabs, Icon, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import printLog, { LogItem } from './printLog';
import apis from '@/services';

interface Props {}

interface State {
  logs: string[];
  htmlLog: string;
}

const EditorConsole: React.FC<Props> = () => {
  const initState: State = {
    logs: [],
    htmlLog: '',
  };
  const [logs, setLogs] = useState(initState.logs);
  const [htmlLog, setHtmlLog] = useState(initState.htmlLog);

  useEffect(() => {
    PubSub.subscribe('rule-engine-log', (topic: any, data: LogItem) => {
      logs.push(
        data.level === 'error'
          ? `<pre style="color:Red">${data.content}</pre>`
          : `<pre >${data.content}</pre>`,
      );
      setLogs(logs);
      setHtmlLog(logs.join(''));
    });
    return () => {
      PubSub.unsubscribe('rule-engine-log');
    };
  });

  const debugSessionId = localStorage.getItem('ruleEngineDebugSessionId');

  const closeSession = () => {
    if (debugSessionId) {
      window.clearTimeout();
      apis.ruleEngine
        .closeDebug(debugSessionId)
        .then(response => {
          if (response.status === 200) {
            printLog({ level: 'info', content: `关闭会话：${debugSessionId}` });
          } else {
            printLog({ level: 'error', content: `关闭会话失败${response.message}` });
          }
          localStorage.removeItem('ruleEngineDebugSessionId');
        })
        .catch(() => {});
    }
    // 发布事件停止调试
    PubSub.publish('rule-engine-close-session', {});
  };

  return (
    <Tabs
      defaultActiveKey="logs"
      size="small"
      tabBarExtraContent={
        <div style={{ marginRight: 20 }}>
          <a
            onClick={() => {
              closeSession();
            }}
          >
            结束调试
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setHtmlLog('');
              setLogs([]);
            }}
          >
            清空
          </a>
        </div>
      }
    >
      <Tabs.TabPane
        key="logs"
        style={{ height: 150, overflow: 'auto' }}
        tab={
          <span>
            <Icon type="code" />
            日志
          </span>
        }
      >
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlLog }}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};
export default EditorConsole;

import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import loadable from '@loadable/component';
import PubSub from 'pubsub-js';
import printLog from '../EditorConsole/printLog';
import apis from '@/services';
import { getAccessToken } from '@/utils/authority';
// import { NodeProps } from "./data";
import styles from './index.less';
import { wrapAPI } from '@/utils/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';


interface Props extends FormComponentProps {
  expandItem?: any[];
  type: string;
  model: any;
  saveModel: Function;
}
interface State {
  paramVisible: boolean;
  polling: boolean;
  runningNode: string[];
  currentItem: any;
  runParam: any;
  contexts: string[];
  editVisible: boolean;
}

const BasicNode: React.FC<Props> = props => {
  // const { model: { executor }, model, form: { getFieldDecorator }, form } = props;
  const {
    model,
    form: { getFieldDecorator },
    form,
  } = props;

  const initState: State = {
    paramVisible: false,
    polling: false,
    runningNode: [],
    currentItem: props.model,
    runParam: '',
    contexts: [],
    editVisible: false,
  };

  const [editVisible, setEditVisible] = useState(initState.editVisible);
  const [paramVisible, setParamVisible] = useState(initState.paramVisible);
  const [polling, setPolling] = useState(initState.polling);
  const [runningNode, setRunningNode] = useState(initState.runningNode);
  const [currentItem] = useState(initState.currentItem);
  const [debugSessionId, setDebugSessionId] = useState(
    localStorage.getItem('ruleEngineDebugSessionId'),
  );
  const [runParam, setRunParam] = useState(initState.runParam);

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
        .catch(() => { });
    }
  };

  const timingPollLog = () => {
    if (debugSessionId === null) return;
    if (polling) return;
    setPolling(true);
    const es = new EventSourcePolyfill(
      wrapAPI(
        `/jetlinks/rule-engine/debug/${debugSessionId}/logs/?:X_Access_Token=${getAccessToken()}`,
      ),
    );
    es.onmessage = (ev: any) => {
      const log = JSON.parse(ev.data);
      if (log.type === 'log') {
        printLog({ level: 'error', content: log.message.message });
      } else {
        printLog({ level: 'error', content: log.message });
      }
    };
    es.onerror = () => {
      closeSession();
      es.close();
      setPolling(false);
    };
  };

  useEffect(() => {
    if (debugSessionId) {
      printLog({ level: 'info', content: `当前会话:${debugSessionId}` });
      apis.ruleEngine
        .debugContext(debugSessionId)
        .then(response => {
          if (response.status === 200) {
            setRunningNode(response.result);
          }
        })
        .catch(() => { });
      timingPollLog();
    }

    // PubSub.subscribe('rule-engine-close-session', (topic: any, data: {}) => {
    PubSub.subscribe('rule-engine-close-session', () => {
      setRunningNode([]);
    });
    return () => {
      PubSub.unsubscribe('rule-engine-close-session');
    };
  }, []);

  const basicForm: any[] = [
    {
      label: '节点ID',
      key: 'id',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      options: {
        initialValue: model.id,
      },
      component: <Input readOnly />,
    },
    {
      label: '节点类型',
      key: 'executor',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      options: {
        initialValue: model.executor,
      },
      component: <Input readOnly />,
    },
    {
      label: '节点名称',
      key: 'label',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      options: {
        initialValue: model.label,
      },
      component: <Input />,
    },
    {
      label: '大小',
      key: 'size',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      options: {
        initialValue: model.size,
      },
      component: <Input />,
    },
    {
      label: '颜色',
      key: 'color',
      styles: {
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      options: {
        initialValue: model.color,
      },
      component: <Input />,
    },
  ];

  const inlineFormItemLayout = {
    labelCol: {
      sm: { span: 10 },
    },
    wrapperCol: {
      sm: { span: 14 },
    },
  };

  const doInDebug = (call: Function) => {
    if (debugSessionId) {
      call(debugSessionId);
    } else {
      apis.ruleEngine
        .debug({})
        .then(response => {
          if (response && response.status === 200) {
            printLog({ level: 'info', content: `开启新会话:${response.result}` });
            localStorage.setItem('ruleEngineDebugSessionId', response.result);
            setDebugSessionId(response.result);
            call(response.result);
            timingPollLog();
          } else {
            message.error('开启DEBUG失败');
          }
        })
        .catch(() => { });
    }
  };

  const startNodeDebug = (call: Function) => {
    doInDebug((debugSession: string) => {
      printLog({ level: 'info', content: `执行节点\t:\t${model.label} \t ${runParam} ...` });
      apis.ruleEngine
        .debugNode(debugSession, {
          id: model.id,
          nodeId: model.id,
          executor: model.executor,
          configuration: model.config,
        })
        .then(startResponse => {
          window.setTimeout(() => {
            if (startResponse && startResponse.status === 200) {
              runningNode.push(startResponse.result);
              setRunningNode(runningNode);
              apis.ruleEngine.debugResult(debugSession, startResponse.result, {}).then(response => {
                if (response.status !== 200) {
                  printLog({ level: 'info', content: `error:${response.message}` });
                } else if (call) {
                  call();
                }
              });
            } else {
              printLog({ level: 'info', content: `error:${startResponse.message}` });
            }
          }, 500); // 延迟500ms,在集群时，可能存在节点配置同步不及时的问题。
        })
        .catch(() => { });
    });
  };

  const saveModelData = (config?: any) => {
    setTimeout(() => {
      // 基础数据
      const data = form.getFieldsValue();
      // 配置数据
      if (config) {
        data.config = config;
      } else {
        data.confg = currentItem.config;
      }
      props.saveModel(data);
    });
  };

  const stopNodeDebug = (call?: Function) => {
    printLog({ level: 'info', content: `停止执行节点：${model.label}` });
    doInDebug((debugSession: string) => {
      apis.ruleEngine
        .stopNodeDebug(debugSession, model.id)
        .then(response => {
          if (response.status !== 200) {
            printLog({ level: 'error', content: `停止失败${response.message}` });
          } else if (call) {
            call();
          }
        })
        .catch(() => { });
    });
  };

  const NodeComponet = loadable(() => import(`./${model.executor}`));

  return (
    <div>
      <Form {...inlineFormItemLayout} className={styles.configForm}>
        <Row gutter={16}>
          {basicForm.map((item: any) => (
            <Col
              key={item.key}
              {...item.styles}
              onBlur={() => {
                saveModelData();
              }}
            >
              <Form.Item label={item.label} {...item.formStyle}>
                {getFieldDecorator<string>(item.key, {
                  initialValue: currentItem[item.key],
                })(item.component)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
      {editVisible && (
        <NodeComponet
          config={model.config}
          fallback={<div>Loading</div>}
          save={(values: any) => {
            saveModelData(values);
          }}
          close={() => setEditVisible(false)}
        />
      )}
      <Button
        style={{ width: '45%', marginBottom: '5px' }}
        type="ghost"
        onClick={() => {
          setEditVisible(true);
        }}
      >
        编辑参数
      </Button>

      <Button
        style={{ width: '45%', marginBottom: '5px', marginLeft: '10px' }}
        type="primary"
        onClick={() => {
          setParamVisible(true);
        }}
      >
        运行
      </Button>
      {runningNode.some(id => id === props.model.id) && (
        <Button
          style={{ width: '100%' }}
          type="danger"
          onClick={() => {
            stopNodeDebug(() => {
              setRunningNode([]);
            });
          }}
        >
          停止
        </Button>
      )}
      {paramVisible && (
        <Modal
          visible
          title="运行参数"
          onCancel={() => {
            setParamVisible(false);
          }}
          onOk={() => {
            startNodeDebug(() => {
              setParamVisible(false);
              setRunningNode([model.id]);
            });
          }}
        >
          <Input.TextArea
            value={runParam}
            rows={5}
            onChange={e => {
              setRunParam(e.target.value);
            }}
            placeholder="请输入执行参数，对象请输入JSON格式"
          />
        </Modal>
      )}
    </div>
  );
};

export default Form.create<Props>()(BasicNode);

import React, { useState, useEffect, Suspense } from "react";
import { Form, Row, Col, Input, Button, Modal, message, Card, Spin } from "antd";
import { FormComponentProps } from "antd/es/form";
import { FormItemConfig } from "@/utils/common";
import printLog from "../EditorConsole/printLog";
import apis from "@/services";
import { getAccessToken } from "@/utils/authority";
import loadable from '@loadable/component';
import { NodeProps } from "./data";
import styles from "./index.less";


interface Props extends FormComponentProps {
    expandItem?: FormItemConfig[];
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
}

const BasicNode: React.FC<Props> = (props) => {
    const { model: { executor }, model, form: { getFieldDecorator }, form } = props;

    const initState: State = {
        paramVisible: false,
        polling: false,
        runningNode: [],
        currentItem: props.model,
        runParam: '',
        contexts: [],
    }
    const [paramVisible, setParamVisible] = useState(initState.paramVisible);
    const [polling, setPolling] = useState(initState.polling);
    const [runningNode, setRunningNode] = useState(initState.runningNode);
    const [currentItem, setCurrentItem] = useState(initState.currentItem);
    const [debugSessionId, setDebugSessionId] = useState(sessionStorage.getItem('ruleEngineDebugSessionId'));
    const [runParam, setRunParam] = useState(initState.runParam);

    useEffect(() => {
        if (debugSessionId) {
            printLog({ level: 'info', content: `当前会话:${debugSessionId}` });
            apis.ruleEngine.debugContext(debugSessionId).then(response => {
                if (response.status === 200) {
                    setRunningNode(response.result);
                }
            });
            timingPollLog();
        }

        PubSub.subscribe('rule-engine-close-session', (topic: any, data: {}) => {
            setRunningNode([]);
        });
        return () => {
            PubSub.unsubscribe('rule-engine-close-session');
        }

    }, []);

    const basicForm: FormItemConfig[] = [
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
            component:
                <Input readOnly />
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
            component:
                <Input readOnly />
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
            component:
                <Input />
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
            component:
                <Input />,
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
            component:
                <Input />,
        }
    ];


    const inlineFormItemLayout = {
        labelCol: {
            sm: { span: 10 },
        },
        wrapperCol: {
            sm: { span: 14 },
        },
    };

    const startNodeDebug = (call: Function) => {
        doInDebug((debugSessionId: string) => {
            printLog({ level: 'info', content: `执行节点\t:\t${model.label} \t ${runParam} ...` });
            apis.ruleEngine.debugNode(debugSessionId, {
                id: model.nodeId,
                nodeId: model.nodeId,
                executor: model.executor,
                configuration: model.config,
            }).then(startResponse => {
                window.setTimeout(() => {
                    if (startResponse && startResponse.status === 200) {
                        runningNode.push(startResponse.result);
                        setRunningNode(runningNode);
                        apis.ruleEngine.debugResult(debugSessionId, startResponse.result, {}).then(response => {
                            if (response.status !== 200) {
                                printLog({ level: 'info', content: `error:${response.message}` });
                            } else {
                                if (call) {
                                    call();
                                }
                            }
                        });
                    } else {
                        printLog({ level: 'info', content: `error:${startResponse.message}` });
                    }
                }, 500);//延迟500ms,在集群时，可能存在节点配置同步不及时的问题。
            });
        });
    }
    const doInDebug = (call: Function) => {
        if (debugSessionId) {
            call(debugSessionId);
        } else {
            apis.ruleEngine.debug({}).then(response => {
                if (response && response.status === 200) {
                    printLog({ level: 'info', content: `开启新会话:${response.result}` })
                    sessionStorage.setItem('ruleEngineDebugSessionId', response.result);
                    setDebugSessionId(response.result);
                    call(response.result);
                    timingPollLog();
                } else {
                    message.error('开启DEBUG失败');
                }
            })
        }
    }

    const timingPollLog = () => {
        if (debugSessionId === null) return;
        if (polling) return;
        setPolling(true);
        let es = new EventSource(`http://localhost:8844/rule-engine/debug/${debugSessionId}/logs/?:X_Access_Token=${getAccessToken()}`);
        es.onmessage = (ev: any) => {
            let log = JSON.parse(ev.data);
            if (log.type === 'log') {
                printLog({ level: 'error', content: log.message.message });
            } else {
                printLog({ level: 'error', content: log.message });
            }
        };
        es.onerror = (ev: any) => {
            console.error(ev);
            closeSession();
            es.close();
            setPolling(false);
        }
    }

    const closeSession = () => {
        if (debugSessionId) {
            window.clearTimeout();
            apis.ruleEngine.closeDebug(debugSessionId).then(response => {
                if (response.status === 200) {
                    printLog({ level: 'info', content: `关闭会话：${debugSessionId}` });
                } else {
                    printLog({ level: 'error', content: `关闭会话失败${response.message}` });
                }
                sessionStorage.removeItem('ruleEngineDebugSessionId');
            });
        }
    }

    const saveModelData = (config?: any) => {
        setTimeout(() => {
            //基础数据
            const data = form.getFieldsValue();
            //配置数据
            if (config) {
                data.config = config;
            } else {
                data.confg = currentItem.config;
            }
            console.log(data, 'das');
            props.saveModel(data);
        });
    }

    const stopNodeDebug = (call?: Function) => {
        printLog({ level: 'info', content: `停止执行节点：${model.label}` });
        doInDebug((debugSessionId: string) => {
            apis.ruleEngine.stopNodeDebug(debugSessionId, model.id).then(response => {
                if (response.status !== 200) {
                    printLog({ level: 'error', content: `停止失败${response.message}` });
                } else {
                    if (call) {
                        call();
                    }
                }
            })
        });
    }


    const NodeComponet = loadable((nodeProps: NodeProps) => import(`./${model.executor}`));

    return (
        <div>
            <Form {...inlineFormItemLayout} className={styles.configForm}>
                <Row gutter={16} >
                    {basicForm.map(item => {
                        return (
                            <Col
                                key={item.key}
                                {...item.styles}
                                onBlur={() => { saveModelData() }}
                            >
                                <Form.Item label={item.label} {...item.formStyle}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: currentItem[item.key],
                                    })(item.component)}
                                </Form.Item>
                            </Col>
                        );
                    }
                    )}
                </Row >
            </Form>
            <NodeComponet config={model.config} fallback={<div>Loading</div>} save={(values: any) => { saveModelData(values) }} />


            <Button style={{ width: '100%', marginBottom: '5px' }} type="primary" onClick={() => { setParamVisible(true); }}>运行</Button>
            {runningNode.some(id => id === props.model.id) && <Button style={{ width: '100%' }} type="danger" onClick={() => { stopNodeDebug(() => { setRunningNode([]) }) }}>停止</Button>}
            {
                paramVisible &&
                <Modal
                    visible
                    title="运行参数"
                    onCancel={() => { setParamVisible(false) }}
                    onOk={() => { startNodeDebug(() => { setParamVisible(false); setRunningNode([model.id]) }); }}
                >
                    <Input.TextArea
                        value={runParam}
                        rows={5}
                        onChange={(e) => { setRunParam(e.target.value) }}
                        placeholder="请输入执行参数，对象请输入JSON格式" />
                </Modal>
            }
        </div >
    );
}

export default Form.create<Props>()(BasicNode);
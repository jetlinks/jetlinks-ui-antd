import { Button, message, Modal } from "antd";
import React from "react";
import Service from "../service";
import { createFormActions, FormButtonGroup, FormEffectHooks, FormSpy, Reset, SchemaForm, Submit } from "@formily/antd";
import { ArrayCards, ArrayTable, Input, DatePicker, Select, FormStep } from '@formily/antd-components'

interface Props {
    close: Function;
    data: any
}

const actions = createFormActions();

const Save: React.FC<Props> = props => {
    const service = new Service('network/simulator');

    const { onFieldValueChange$ } = FormEffectHooks;
    const changeNetworkTypeEffects = () => {
        const { setFieldState } = actions;

        onFieldValueChange$('networkType').subscribe(({ value }) => {
            setFieldState(
                `*(networkConfiguration.certId,
                    networkConfiguration.host,
                    networkConfiguration.port,
                    networkConfiguration.clientId,
                    networkConfiguration.username,
                    networkConfiguration.password,
                    networkConfiguration.keepAliveTimeSeconds)`,
                state => {
                    state.visible = value === 'mqtt' ? true : false;
                });
        });
    }
    const basicInfo = {
        "type": "object",
        "x-component": "mega-layout",
        "x-component-props": {
            "grid": true,
            "autoRow": true,
            "columns": 2,
            "labelCol": 2,
        },
        "properties": {
            "name": {
                "title": "名称",
                "x-component": "input",
                "required": true,
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 2,
                }
            },
            "networkType": {
                "title": "接入方式",
                "x-component": "select",
                "required": true,
                "type": "string",
                "enum": [
                    {
                        "value": "mqtt",
                        "label": "MQTT"
                    },
                    {
                        "value": "tcp",
                        "label": "TCP"
                    }
                ],
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 1,
                    "labelCol": 4
                },
            },
            "networkConfiguration.certId": {
                "title": "证书",
                "visible": false,
                "x-component": "select",
                "enum": [],

                "x-mega-props": {
                    "span": 1,
                    "labelCol": 4
                },
            },
            "networkConfiguration.host": {
                "title": "服务地址",
                "visible": false,
                "x-component": "input",
                "required": true,
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 1,
                    "labelCol": 4
                },
            },
            "networkConfiguration.port": {
                "title": "端口",
                "x-component": "input",
                "required": true,
                "visible": false,
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 1,
                    "labelCol": 4
                },
            },
            "networkConfiguration.clientId": {
                "title": "ClientId",
                "visible": false,
                "required": true,
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 2
                },
            },
            "networkConfiguration.username": {
                "title": "用户名",
                "visible": false,
                "required": true,
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 2
                },
            },
            "networkConfiguration.password": {
                "title": "密码",
                "visible": false,
                "required": true,
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 2
                },
            },
            "networkConfiguration.keepAliveTimeSeconds": {
                "title": "心跳间隔",
                "visible": false,
                "required": true,
                "default": 30,
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 1,
                    "labelCol": 4
                },
                "x-component-props": {
                    "addonAfter": "S"
                }
            },
        }
    }

    const runner = {
        "type": "object",
        "x-component": "mega-layout",
        "x-component-props": {
            "grid": true,
            "autoRow": true,
            "columns": 2,
            "labelCol": 4,
        },

        "properties": {
            "runner.bings": {
                "title": "绑定网卡",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1, }
            },
            "runner.total": {
                "title": "模拟总数",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1 }
            },
            "runner.startWith": {
                "title": "起始索引",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1 }
            },
            "runner.batch": {
                "title": "并发数",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1 }
            },
            "listeners.type": {
                "title": "其他功能",
                "x-component": "select",
                "enum": [
                    { "label": "自动重链接", "value": "auto-reconnect" },
                    { "label": "脚本", "value": "jsr223" }
                ],
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1 }
            }
        }
    };
    const save = (data: any) => {
        service.saveOrUpdate({ id: props.data.id, ...data }).subscribe(() => {
            message.success('保存成功');
            props.close();
        })
    }
    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}模拟器`}
            onOk={() => actions.submit()}
            visible
            width={1000}
            onCancel={() => props.close()}
            footer={null}
        >
            <SchemaForm
                effects={() => {
                    changeNetworkTypeEffects()
                }}
                initialValues={props.data}
                actions={actions}
                onSubmit={v => save(v)}
                components={{ DatePicker, Input, ArrayTable, ArrayCards, Select }}
                schema={{
                    "type": "object",
                    "properties": {
                        "NO_NAME_FIELD_$0": {
                            "type": "object",
                            "x-component": "step",
                            "x-component-props": {
                                "style": {
                                    "marginBottom": 20,
                                    "marginLeft": 100,
                                    "width": 600
                                },
                                "dataSource": [
                                    {
                                        "title": "基础信息",
                                        "name": "basicInfo"
                                    },
                                    {
                                        "title": "运行信息",
                                        "name": "run"
                                    }
                                ]
                            }
                        },
                        "basicInfo": basicInfo,
                        "run": runner
                    }
                }} >

                <FormSpy
                    selector={FormStep.ON_FORM_STEP_CURRENT_CHANGE}
                    reducer={(state, action) => {
                        switch (action.type) {
                            case FormStep.ON_FORM_STEP_CURRENT_CHANGE:
                                return { ...state, step: action.payload }
                            default:
                                return { step: { value: 0 } }
                        }
                    }}
                >
                    {({ state }) => {
                        const formStepState = state.step ? state : { step: { value: 0 } }
                        return (
                            <FormButtonGroup align="center">
                                <Button
                                    disabled={formStepState.step.value === 0}
                                    onClick={() => {
                                        actions.dispatch!(FormStep.ON_FORM_STEP_PREVIOUS, {})
                                    }}
                                >
                                    上一步
                                </Button>
                                <Button
                                    onClick={() => {
                                        actions.dispatch!(FormStep.ON_FORM_STEP_NEXT, {})
                                    }}
                                >
                                    下一步
                                </Button>
                                <Submit>提交</Submit>
                                <Reset>重置</Reset>
                            </FormButtonGroup>
                        )
                    }}
                </FormSpy>
            </SchemaForm>

        </Modal>
    )

};
export default Save;
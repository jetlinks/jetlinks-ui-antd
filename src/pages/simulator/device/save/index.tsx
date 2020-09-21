import { Button, message, Modal } from "antd";
import React from "react";
import Service from "../service";
import { createFormActions, FormButtonGroup, FormEffectHooks, FormPath, FormSpy, Reset, SchemaForm, Submit } from "@formily/antd";
import { ArrayCards, ArrayTable, Input, DatePicker, Select, FormStep } from '@formily/antd-components'
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';

interface Props {
    close: Function;
    data: any
}

const AceComponent = (props: any) => (
    <AceEditor
        mode='javascript'
        theme="eclipse"
        name="app_code_editor"
        fontSize={14}
        showPrintMargin
        showGutter
        value={props.value || ''}
        onChange={value => {
            props.onChange(value)
            // props.mutators.change(value)
        }}
        wrapEnabled
        highlightActiveLine  //突出活动线
        enableSnippets  //启用代码段
        style={{ width: '100%', height: 300 }}
        setOptions={{
            enableBasicAutocompletion: true,   //启用基本自动完成功能
            enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
            enableSnippets: true,  //启用代码段
            showLineNumbers: true,
            tabSize: 2,
        }}
    />
)

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

        onFieldValueChange$("listeners.*.type").subscribe(fieldState => {

            console.log(fieldState, 'state');
            setFieldState(
                FormPath.transform(fieldState.name, /\d/, $1 => `*(listeners.${$1}.configuration.maxTimes,listeners.${$1}.configuration.delays,listeners.${$1}.configuration.lang,listeners.${$1}.configuration.script)`),
                state => {
                    state.visible = false;
                })
            setFieldState(
                FormPath.transform(fieldState.name, /\d/, $1 => fieldState.value === 'auto-reconnect' ? `*(listeners.${$1}.configuration.maxTimes,listeners.${$1}.configuration.delays)` : `*(listeners.${$1}.configuration.lang,listeners.${$1}.configuration.script)`),
                state => {
                    state.visible = true;
                });
        })
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
            "runner.binds": {
                "title": "绑定网卡",
                "x-component": "select",
                "x-component-props": {
                    "mode": "tags",
                },
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
            "listeners": {
                "title": "其他功能",
                "x-component": "arraycards",
                "type": "array",
                "x-mega-props": { "span": 2, "labelCol": 2 },
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "title": "监听器类型",
                            "x-component": "select",
                            "enum": [
                                { "label": "自动重连", "value": "auto-reconnect" },
                                { "label": "脚本", "value": "jsr223" }
                            ],
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "x-mega-props": { "labelCol": 6 },
                        },
                        "configuration.maxTimes": {
                            "title": "最大重连次数",
                            "x-component": "input",
                            "visible": false,
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "x-mega-props": { "labelCol": 6 },
                        },
                        "configuration.delays": {
                            "title": "重连间隔",
                            "x-component": "input",
                            "visible": false,
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "x-mega-props": { "labelCol": 6 },
                        },
                        "configuration.lang": {
                            "title": "脚本语言",
                            "x-component": "select",
                            "visible": false,
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "enum": [
                                { "label": "js", "value": "js" },
                            ]
                        },
                        "configuration.script": {
                            "title": "脚本内容",
                            "x-component": "AceComponent",
                            "visible": false,
                            "default": `
//内置变量
//simulator , listener

//启动完成
simulator.doOnComplete(function () {
   
})

//连接前
listener.onBefore(function (session) {

});

//连接后
listener.onAfter(function (session) {
 
});`,
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "x-mega-props": { "labelCol": 2, "span": 2 }
                        }
                    }

                },
            },

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
                components={{ DatePicker, Input, ArrayTable, ArrayCards, Select, AceComponent }}
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
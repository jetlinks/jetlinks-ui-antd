import {Button, message, Modal} from "antd";
import React from "react";
import Service from "../service";
import {createFormActions, FormButtonGroup, FormEffectHooks, FormPath, FormSpy, Reset, SchemaForm, Submit} from "@formily/antd";
import {DatePicker, FormStep, Input, Select} from '@formily/antd-components'
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';
import ArrayPanels from '@/components/ArrayPanel';
import createRichTextUtils from "@/utils/textUtils";

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
);

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
                    state.visible = value === 'mqtt_client';
                });
        });

        onFieldValueChange$("listeners.*.type").subscribe(fieldState => {
            setFieldState(
                FormPath.transform(fieldState.name, /\d/, $1 => `*(listeners.${$1}.configuration.maxTimes,listeners.${$1}.configuration.delays,listeners.${$1}.configuration.lang,listeners.${$1}.configuration.script)`),
                state => {
                    state.visible = false;
                });
            setFieldState(
                FormPath.transform(fieldState.name, /\d/, $1 => fieldState.value === 'auto-reconnect' ? `*(listeners.${$1}.configuration.maxTimes,listeners.${$1}.configuration.delays)` : `*(listeners.${$1}.configuration.lang,listeners.${$1}.configuration.script)`),
                state => {
                    state.visible = true;
                });
        })
    };
    const basicInfo = {
        "type": "object",
        "x-component": "mega-layout",
        "x-component-props": {
            "grid": true,
            "autoRow": true,
            "columns": 2,
            "labelCol": 3,
        },
        "properties": {
            "name": {
                "title": "{{ text('名称',help('这是名称的提示'))}}",
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
                "title": "{{ text('接入方式',help('这是接入方式的提示'))}}",
                "x-component": "select",
                "required": true,
                "type": "string",
                "enum": [
                    {
                        "value": "mqtt_client",
                        "label": "MQTT"
                    },
                    // {
                    //     "value": "tcp_client",
                    //     "label": "TCP"
                    // }
                ],
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": {
                    "span": 1,
                    "labelCol": 6
                },
            },
            "networkConfiguration.certId": {
                "title": "{{ text('证书',help('这是证书的提示'))}}",
                "visible": false,
                "x-component": "select",
                "enum": [],

                "x-mega-props": {
                    "span": 1,
                    "labelCol": 4
                },
            },
            "networkConfiguration.host": {
                "title": "{{ text('服务地址',help('这是服务地址的提示'))}}",
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
                    "labelCol": 6
                },
            },
            "networkConfiguration.port": {
                "title": "{{ text('端口',help('这是端口的提示'))}}",
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
                "title": "{{ text('ClientId',help('这是ClientId的提示'))}}",
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
                "title": "{{ text('用户名',help('这是用户名的提示'))}}",
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
                "title": "{{ text('密码',help('这是密码的提示'))}}",
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
                "title": "{{ text('心跳间隔',help('这是心跳间隔的提示'))}}",
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
                    "labelCol": 6
                },
                "x-component-props": {
                    "addonAfter": "S"
                }
            },
        }
    };

    const runner = {
        "type": "object",
        "x-component": "mega-layout",
        "x-component-props": {
            "grid": true,
            "autoRow": true,
            "columns": 2,
            "labelCol": 3,
        },

        "properties": {
            "runner.binds": {
                "title": "{{ text('绑定网卡',help('这是绑定网卡的提示'))}}",
                "x-component": "select",
                "x-component-props": {
                    "mode": "tags",
                },
                "x-mega-props": { "span": 1, "labelCol": 6 }
            },
            "runner.total": {
                "title": "{{ text('模拟总数',help('这是模拟总数的提示'))}}",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1, "labelCol": 6 }
            },
            "runner.startWith": {
                "title": "{{ text('起始索引',help('这是起始索引的提示'))}}",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1, "labelCol": 6 }
            },
            "runner.batch": {
                "title": "{{ text('并发数',help('这是并发数的提示'))}}",
                "x-component": "input",
                "x-rules": [
                    {
                        "required": true,
                        "message": "此字段必填"
                    }
                ],
                "x-mega-props": { "span": 1, "labelCol": 6 }
            },
            "listeners": {
                "title": "{{ text('其他功能',help('这是其他功能的提示'))}}",
                "x-component": "arraypanels",
                "type": "array",
                "x-mega-props": { "span": 2, "labelCol": 3 },
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "title": "{{ text('名称',help('这是名称的提示'))}}",
                            "x-component": "input",
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "x-mega-props": { "labelCol": 8 },
                        },
                        "type": {
                            "title": "{{ text('功能',help('这是功能的提示'))}}",
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
                            "title": "{{ text('最大重连次数',help('这是最大重连次数的提示'))}}",
                            "x-component": "input",
                            "visible": false,
                            "x-rules": [
                                {
                                    "required": true,
                                    "message": "此字段必填"
                                }
                            ],
                            "x-mega-props": { "labelCol": 8 },
                        },
                        "configuration.delays": {
                            "title": "{{ text('重连间隔',help('这是重连间隔的提示'))}}",
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
                            "title": "{{ text('脚本语言',help('这是脚本语言的提示'))}}",
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
                            ],
                            "x-mega-props": { "labelCol": 4, "span": 2 }
                        },
                        "configuration.script": {
                            "title": "{{ text('脚本内容',help('这是脚本内容的提示'))}}",
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
                            "x-mega-props": { "labelCol": 4, "span": 2 }
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
    };

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
                expressionScope={createRichTextUtils()}
                initialValues={props.data}
                actions={actions}
                onSubmit={v => save(v)}
                components={{ DatePicker, Input, Select, AceComponent, ArrayPanels }}
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
                                return { ...state, step: action.payload };
                            default:
                                return { step: { value: 0 } }
                        }
                    }}
                >
                    {({ state }) => {
                        const formStepState = state.step ? state : { step: { value: 0 } };
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

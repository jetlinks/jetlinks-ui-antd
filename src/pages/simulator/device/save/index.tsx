import { Icon, message, Modal } from "antd";
import React from "react";
import Service from "../service";
import { createFormActions, FormEffectHooks, SchemaForm } from "@formily/antd";
import { ArrayCards, ArrayTable, Input, DatePicker, Select } from '@formily/antd-components'

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
            width={900}
            onCancel={() => props.close()}
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
                                    "x-mega-props": {
                                        "span": 2,
                                    }
                                },
                                "networkType": {
                                    "title": "接入方式",
                                    "x-component": "select",
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
                                    "x-mega-props": {
                                        "span": 1,
                                        "labelCol": 4
                                    },
                                },
                                "networkConfiguration.certId": {
                                    "title": "证书",
                                    "visible": false,
                                    "x-component": "input",
                                    "x-mega-props": {
                                        "span": 1,
                                        "labelCol": 4
                                    },
                                },
                                "networkConfiguration.host": {
                                    "title": "服务地址",
                                    "visible": false,
                                    "x-component": "input",
                                    "x-mega-props": {
                                        "span": 1,
                                        "labelCol": 4
                                    },
                                },
                                "networkConfiguration.port": {
                                    "title": "端口",
                                    "x-component": "input",
                                    "visible": false,
                                    "x-mega-props": {
                                        "span": 1,
                                        "labelCol": 4
                                    },
                                },
                                "networkConfiguration.clientId": {
                                    "title": "ClientId",
                                    "visible": false,
                                    "x-component": "input",
                                    "x-mega-props": {
                                        "span": 2
                                    },
                                },
                                "networkConfiguration.username": {
                                    "title": "用户名",
                                    "visible": false,
                                    "x-component": "input",
                                    "x-mega-props": {
                                        "span": 2
                                    },
                                },
                                "networkConfiguration.password": {
                                    "title": "密码",
                                    "visible": false,
                                    "x-component": "input",
                                    "x-mega-props": {
                                        "span": 2
                                    },
                                },
                                "networkConfiguration.keepAliveTimeSeconds": {
                                    "title": "心跳间隔",
                                    "visible": false,
                                    "x-component": "input",
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
                    }
                }} />
        </Modal>
    )

};
export default Save;
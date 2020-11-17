import createRichTextUtils, { createLinkageUtils } from "@/utils/textUtils";
import SchemaForm, { createFormActions, FormEffectHooks, FormPath } from "@formily/antd";
import React, { useEffect, useRef, useState } from "react";
import { DatePicker, Input, Select, ArrayTable, FormCard, NumberPicker, FormTextBox, Radio, } from '@formily/antd-components'
import ArrayPanels from '@/components/ArrayPanel';
import { Modal } from "antd";
import Service from "../service";
import { zip } from "rxjs";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
    save: Function;
}
const actions = createFormActions();

const Save: React.FC<Props> = props => {
    const service = new Service('dueros/product');

    const { onFieldValueChange$ } = FormEffectHooks;
    const [productInfo, setProductInfo] = useState<{ list: any[], type: any[] }>({ list: [], type: [] });
    const testRef = useRef<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [notifyTypes, setNotifyTypes] = useState<any[]>([]);

    const linkageEffect = async () => {
        const linkage = createLinkageUtils();
        onFieldValueChange$('triggers.*.shakeLimit.enabled').subscribe(fieldState => {
            linkage.show(
                FormPath.transform(fieldState.name, /\d/, $1 => `*(triggers.${$1}.NO_NAME_FIELD_$1)`),
                fieldState.value
            );
        });


        onFieldValueChange$('actions.*.executor').subscribe(fieldState => {
            const notifyType = FormPath.transform(fieldState.name, /\d/, $1 => `*(actions.${$1}.configuration.notifyType)`)

            switch (fieldState.value) {
                case 'notifier':
                    linkage.show(notifyType, true);
                    getNotifyType();
                    return
                case 'device-message-sender':
                    linkage.show(
                        notifyType,
                        false);
                    return;
                default: return
            }
        })

    };
    const getDevice = (productId: string) => {
        service.getDevice(encodeQueryParam({
            paging: false,
            terms: {
                productId: productId
            }
        })).subscribe(data => {
            console.log(data, 'dd');
        })
    }

    const getNotifyType = () => {
        service.notifyTypes().subscribe(data => {
            setNotifyTypes(data.map((item: any) => ({ value: item.id, label: item.name, ...item })));
        })
    }
    const initValue = () => {
        zip(service.queryProduct({}),
            service.productTypes()).subscribe(data => {
                const temp = {
                    list: data[0].map((item: any) => ({ value: item.id, label: item.name, ...item })),
                    type: data[1].map((item: any) => ({ value: item.id, label: item.name, ...item }))
                };
                setProductInfo(temp);
                testRef.current = temp;
            }, () => { }, () => setLoading(false));
    }
    useEffect(() => initValue(), [loading]);

    return (
        <Modal
            title="场景联动"
            width={900}
            visible
        >
            <SchemaForm
                effects={linkageEffect}
                expressionScope={createRichTextUtils()}
                initialValues={{}}
                actions={actions}
                onSubmit={v => props.save(v)}
                components={{ DatePicker, Input, Select, ArrayTable, FormCard, NumberPicker, ArrayPanels, FormTextBox, Radio: Radio.Group }}
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
                                "full": true,
                            },
                            "properties": {
                                "name": {
                                    "title": "名称",
                                    "x-component": "input",
                                    "x-mega-props": {
                                        "span": 4,
                                    },
                                    "x-rules": [
                                        {
                                            "required": true,
                                            "message": "此字段必填"
                                        }
                                    ],
                                },
                                "triggers": {
                                    "x-mega-props": {
                                        "span": 2,
                                    },

                                    "title": "触发条件",
                                    "type": "array",
                                    "x-component": "arraypanels",
                                    "items": {
                                        "type": "object",
                                        "x-component-props": {
                                            "labelCol": 10
                                        },
                                        "properties": {
                                            "trigger": {
                                                "title": "类型",
                                                "x-component": "select",
                                                "x-rules": [
                                                    {
                                                        "required": true,
                                                        "message": "此字段必填"
                                                    }
                                                ],
                                                "enum": [
                                                    { "label": "设备触发", "value": "device" },
                                                    { "label": "定时触发", "value": "cron" }
                                                ]
                                            },
                                            "type": {
                                                "title": "消息类型",
                                                "x-component": "select",

                                                "enum": [
                                                    { "label": "上线", "value": "online" },
                                                    { "label": "离线", "value": "offline" },
                                                    { "label": "事件", "value": "event" },
                                                    { "label": "属性", "value": "properties" },

                                                ]
                                            },
                                            "properties": {
                                                "title": "属性",

                                                "x-component": "select"
                                            },
                                            "event": {
                                                "title": "事件",

                                                "x-component": "select"
                                            },
                                            "shakeLimit.enabled": {
                                                "x-component": "Radio",
                                                "title": "开启防抖",
                                                "type": "string",
                                                "enum": [
                                                    { "label": "开启", "value": true },
                                                    { "label": "关闭", "value": false }
                                                ]
                                            },
                                            "NO_NAME_FIELD_$1": {
                                                "visible": false,
                                                "x-component": "text-box",
                                                "x-component-props": {
                                                    "text": "%s秒内 只触发%s",
                                                },
                                                "properties": {
                                                    "shakeLimit.time": {
                                                        // "title": "时间间隔",
                                                        "x-component": "input"
                                                    },
                                                    "shakeLimit.threshold": {
                                                        // "title": "触发阈值",
                                                        "x-component": "select",
                                                        "enum": [
                                                            { "label": "第一次", "value": "start" },
                                                            { "label": "最后一次", "value": "end" }
                                                        ]
                                                    },
                                                }
                                            },
                                            "parallel": {
                                                "title": "并行执行",
                                                "type": "string",
                                                "x-component": "Radio",
                                                "enum": [
                                                    { "label": "开启", "value": true },
                                                    { "label": "关闭", "value": false }
                                                ]
                                            },
                                            "filters": {
                                                "x-mega-props": {
                                                    "labelCol": 3,
                                                    "span": 4
                                                },
                                                "title": "过滤条件",
                                                "type": "array",
                                                "x-component": "arraytable",
                                                "x-component-props": {
                                                    "operationsWidth": 150,
                                                    "operations": {
                                                        "title": '操作'
                                                    },
                                                },
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "key": {
                                                            "title": "条件",
                                                            "x-component": "input"
                                                        },
                                                        "operator": {
                                                            "title": "比对方式",
                                                            "x-component": "input"
                                                        },
                                                        "value": {
                                                            "title": "值",
                                                            "x-component": "input"
                                                        },

                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                "actions": {
                                    "x-mega-props": {
                                        "span": 4
                                    },
                                    "title": "执行动作",
                                    "type": "array",
                                    "x-component": "arraypanels",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "title": "名称",
                                                "x-component": "input",
                                            },
                                            "executor": {
                                                "title": "执行器",
                                                "x-component": "select",
                                                "enum": [
                                                    { "label": "设备输出", "value": "device-message-sender" },
                                                    { "label": "消息通知", "value": "notifier" },
                                                ]
                                            },
                                            "configuration.productId": {

                                                "title": "产品",
                                                "visible": false,
                                                "enum": productInfo.type,
                                                "x-component": "select",
                                            },
                                            "configuration.deviceId": {

                                                "title": "设备",
                                                "visible": false,
                                                "x-component": "select",
                                            },
                                            "configuration.message.messageType": {

                                                "title": "消息类型",
                                                "visible": false,
                                                "x-component": "select",
                                            },
                                            "configuration.notifyType": {
                                                "title": "通知类型",
                                                "visible": false,
                                                "enum": notifyTypes,
                                                "x-component": "select",
                                            },
                                            "configuration.notifierId": {

                                                "title": "通知配置",
                                                "visible": false,
                                                "x-component": "select",
                                            },
                                            "configuration.templateId": {

                                                "title": "通知模版",
                                                "visible": false,
                                                "x-component": "select"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }} >
            </SchemaForm>
        </Modal>
    )
}
export default Save;
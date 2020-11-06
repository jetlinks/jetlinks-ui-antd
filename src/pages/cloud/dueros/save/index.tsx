import createRichTextUtils from "@/utils/textUtils";
import { createFormActions, FormEffectHooks, FormPath, SchemaForm, } from "@formily/antd";
import { Modal } from "antd";
import React, { useRef, useState } from "react";
import { DatePicker, Input, Select, ArrayTable, FormCard, NumberPicker } from '@formily/antd-components'
import ArrayPanels from '@/components/ArrayPanel';
import Service from "../service";
import { zip } from "rxjs";

interface Props {
    data: any;
    close: Function;
    save: Function;
}

const actions = createFormActions();

const Save: React.FC<Props> = props => {
    const service = new Service();
    const { onFormInit$, onFieldValueChange$, onFieldInit$ } = FormEffectHooks

    const [productInfo, setProductInfo] = useState<{ list: any[], type: any[] }>({ list: [], type: [] });

    const testRef = useRef<any>({});
    const productRef = useRef<any>({});
    const [funcList, setFuncList] = useState<any>({});
    const submitData = () => {
        console.log('submit');
    }

    const createLinkageUtils = () => {
        const { setFieldState } = createFormActions()
        const linkage = (key: string, defaultValue: any) => (path: string, value: any) =>
            setFieldState(path, state => {
                FormPath.setIn(state, key, value !== undefined ? value : defaultValue)
            })
        return {
            hide: linkage('visible', false),
            show: linkage('visible', true),
            enum: linkage('props.enum', []),
            loading: linkage('loading', true),
            loaded: linkage('loading', false),
            value: linkage('value', '')
        }
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
            });
    }

    const linkageEffect = () => {
        initValue();
        const linkage = createLinkageUtils();
        onFieldValueChange$('applianceType').subscribe(fieldState => {
            if (!fieldState.value) return;
            const product = testRef.current.type.find((item: any) => item.id === fieldState.value);
            const actions = (product.actions || []).map((item: any) => ({ label: item.name, value: item.id }));
            linkage.show('actionMappings', true);
            linkage.show('propertyMappings', true);
            linkage.enum('actionMappings.*.action', actions);
        });

        onFieldValueChange$('actionMappings.*.messageType').subscribe(fieldState => {
            const propertiesPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.message.properties)`);
            const valuePath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.message.value)`);
            const functionPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.message.functionId)`);
            const functionParamPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.message.function)`);

            switch (fieldState.value) {
                case 'READ_PROPERTY':
                    linkage.enum(
                        propertiesPath,
                        productRef.current.metadata.properties.map((item: any) => ({ label: item.name, value: item.id, ...item })));
                    linkage.show(valuePath, false);
                    linkage.show(propertiesPath, true);
                    linkage.show(functionParamPath, false);
                    return;
                case 'WRITE_PROPERTY':
                    linkage.enum(
                        propertiesPath,
                        productRef.current.metadata.properties.map((item: any) => ({ label: item.name, value: item.id, ...item })));
                    linkage.show(valuePath, true);
                    linkage.show(functionParamPath, false);
                    return;
                case 'INVOKE_FUNCTION':
                    linkage.hide(propertiesPath, false);
                    linkage.show(valuePath, false);
                    linkage.show(functionPath, true);
                    linkage.enum(functionPath,
                        productRef.current.metadata.functions.map((item: any) => ({ label: item.name, value: item.id, ...item })));

                    return;
                default:
                    return;
            }
        });
        onFieldValueChange$('actionMappings.*.actionType').subscribe(fieldState => {
            if (fieldState.value === 'latestData') {
                linkage.hide(FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.messageType)`), false);
            } else if (fieldState.value === 'command') {
                linkage.hide(FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.messageType)`), true);
            }

        });
        onFieldValueChange$('id').subscribe(fieldState => {
            if (!fieldState.value) return;
            const product = testRef.current.list.find((item: any) => item.id === fieldState.value);
            product.metadata = JSON.parse(product.metadata);
            productRef.current = product;
            linkage.show('applianceType', true);
        });

        onFieldValueChange$('actionMappings.*.message.functionId').subscribe(fieldState => {
            if (!fieldState.value) return;
            // console.log(productRef.current, 'test');
            // const functionPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.message.functionId)`);
            const funcPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.message.function)`);
            const func = productRef.current.metadata.functions.find((item: any) => item.id === fieldState.value);
            console.log(func, fieldState, 'test');
            // console.log(func.inputs, JSON.stringify(func.inputs), 'input');
            linkage.value(funcPath, func.inputs);
            linkage.show(funcPath, true);

            const componentMap = {
                "string": "input",
                "int": "numberpicker"
            }
            const componentType = {
                'string': 'string',
                'int': 'number',
            }
            const list = {};
            func.inputs.forEach((item: any) => {
                const valueType = item.valueType;

                list[item.id] = {
                    "title": item.description ? `{{text("${item.name}",help("${item.description.replaceAll('\n', '')}"))}}` : item.name,
                    "x-component": componentMap[valueType.type],
                    "type": componentType[valueType.type],
                    "x-component-props": {
                        "width": "100%"
                    },
                    "x-mega-props": {
                        "span": 1,
                        "labelCol": 6
                    },
                }
            });
            console.log(JSON.stringify(list), 'liii');
            // 参数列表
            setFuncList(list);
        })
    }

    const save = (item: any) => { }

    return (
        <Modal
            width='70VW'
            title={`${props.data.id ? '编辑' : '新建'}`}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { submitData() }}
            onCancel={() => props.close()}
        >
            <SchemaForm
                effects={linkageEffect}
                expressionScope={createRichTextUtils()}
                // initialValues={initialValues}
                actions={actions}
                onSubmit={v => save(v)}
                components={{ DatePicker, Input, Select, ArrayPanels, ArrayTable, FormCard, NumberPicker }}
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
                                "labelCol": 4
                            },
                            "properties": {
                                "id": {
                                    "title": '产品',
                                    "x-mega-props": {
                                        "span": 1,
                                    },
                                    "x-rules": [
                                        {
                                            "required": true,
                                            "message": "此字段必填"
                                        }
                                    ],
                                    "enum": productInfo.list,
                                    "x-component": "select"
                                },
                                "name": {
                                    "x-mega-props": {
                                        "span": 1,
                                    },
                                    "title": "名称",
                                    "x-component": "input",
                                    "x-rules": [
                                        {
                                            "required": true,
                                            "message": "此字段必填"
                                        }
                                    ],
                                },
                                "manufacturerName": {
                                    "x-mega-props": {
                                        "span": 1,
                                    },
                                    "title": "厂商名称",
                                    "x-component": "input",
                                    "x-rules": [
                                        {
                                            "required": true,
                                            "message": "此字段必填"
                                        }
                                    ],
                                },
                                "version": {
                                    "x-mega-props": {
                                        "span": 1,
                                    },
                                    "title": "设备版本",
                                    "x-component": "input",
                                    "x-rules": [
                                        {
                                            "required": true,
                                            "message": "此字段必填"
                                        }
                                    ],
                                },
                                "applianceType": {
                                    "x-mega-props": {
                                        "span": 1,
                                    },
                                    "title": "设备类型",
                                    "x-component": "select",
                                    "visible": false,
                                    "enum": productInfo.type
                                },
                                "actionMappings": {
                                    "x-mega-props": {
                                        "span": 4,
                                        "labelCol": 2
                                    },
                                    "title": "动作映射",
                                    "x-component": "arraypanels",
                                    "type": "array",
                                    "visible": false,
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "action": {
                                                "title": "动作",
                                                "x-component": "select",
                                                "x-rules": [
                                                    {
                                                        "required": true,
                                                        "message": "此字段必填"
                                                    }
                                                ],
                                            },
                                            "actionType": {
                                                "title": "操作",
                                                "x-component": "select",
                                                "enum": [
                                                    { "label": "下发指令", "value": "command" },
                                                    { "label": "获取历史数据", "value": "latestData" }
                                                ],
                                                "x-rules": [
                                                    {
                                                        "required": true,
                                                        "message": "此字段必填"
                                                    }
                                                ],
                                            },
                                            "messageType": {
                                                "title": "指令类型",
                                                "x-component": "select",
                                                "visible": false,
                                                "enum": [
                                                    { "label": "读取属性", "value": "READ_PROPERTY" },
                                                    { "label": "修改属性", "value": "WRITE_PROPERTY" },
                                                    { "label": "调用功能", "value": "INVOKE_FUNCTION" }
                                                ],
                                            },
                                            "message.properties": {
                                                "title": "属性",
                                                "x-component": "select",
                                                "visible": false
                                            },
                                            "message.value": {
                                                "title": "值",
                                                "x-component": "input",
                                                "visible": false,
                                            },
                                            "message.functionId": {
                                                "title": "功能",
                                                "x-component": "select",
                                                "visible": false,
                                            },
                                            "message.function": {
                                                "x-mega-props": {
                                                    "span": 2,
                                                },
                                                "x-component": "block",
                                                "x-component-props": {
                                                    "title": "参数列表",
                                                    "span": 2
                                                },
                                                "type": "object",
                                                "visible": false,
                                                "properties": { "customId": { "title": "人员UUID", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "name": { "title": "姓名", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "telnum1": { "title": "电话", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "gender": { "title": "{{text(\"性别\",help(\"0 男；1 女\"))}}", "x-component": "numberpicker", "type": "number", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "idCard": { "title": "身份证号码", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "iccard": { "title": "IC卡卡号", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "valid_time_type": { "title": "{{text(\"有效期类型\",help(\"0:每天(一天起始秒数-一天结束秒数) 1:星期(0-6/星期日-星期六) 2:日期(起始日期时间戳-结束日期时间戳)\"))}}", "x-component": "numberpicker", "type": "number", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "start_time": { "title": "开始时间 ", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "expire_time": { "title": "到期时间", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "department_name": { "title": "部门名称", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "personType": { "title": "{{text(\"人员类型\",help(\"0，白名单；1 黑名单；2 VIP\"))}}", "x-component": "numberpicker", "type": "number", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "notes": { "title": "备注", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } }, "pic": { "title": "{{text(\"照片\",help(\"Base64 编码\"))}}", "x-component": "input", "type": "string", "x-component-props": { "width": "100%" }, "x-mega-props": { "span": 3, "labelCol": 6 } } }
                                            }
                                        }
                                    }
                                },
                                "propertyMappings": {
                                    "x-mega-props": {
                                        "span": 4,
                                        "labelCol": 2
                                    },
                                    "title": "属性映射",
                                    "x-component": "arraypanels",
                                    "type": "array",
                                    "visible": false,
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "source": {
                                                "title": "DuerOS",
                                                "x-component": "select",
                                            },
                                            "target": {
                                                "title": "平台属性",
                                                "x-component": "select"
                                            }
                                        }
                                    }
                                },
                            }
                        }
                    }
                }
                } >
            </SchemaForm>


        </Modal>
    )
}
export default Save;
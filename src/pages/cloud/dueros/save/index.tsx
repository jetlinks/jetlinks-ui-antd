import createRichTextUtils from "@/utils/textUtils";
import { createFormActions, FormEffectHooks, FormPath, SchemaForm, } from "@formily/antd";
import { message, Modal, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
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
    const service = new Service('dueros/product');
    const { onFieldValueChange$ } = FormEffectHooks

    const [productInfo, setProductInfo] = useState<{ list: any[], type: any[] }>({ list: [], type: [] });

    const testRef = useRef<any>({});
    const productRef = useRef<any>({});
    const [funcList, setFuncList] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

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
            }, () => { }, () => setLoading(false));
    }

    useEffect(() => initValue(), [loading]);

    const linkageEffect = async () => {
        const linkage = createLinkageUtils();
        onFieldValueChange$('applianceType').subscribe(fieldState => {
            if (!fieldState.value) return;
            const product = testRef.current.type.find((item: any) => item.id === fieldState.value);
            const actions = (product.actions || []).map((item: any) => ({ label: item.name, value: item.id }));
            linkage.show('actionMappings', true);
            linkage.show('propertyMappings', true);
            linkage.enum('actionMappings.*.action', actions);
            linkage.enum('propertyMappings.*.source',
                product.properties.map((item: any) => ({ label: item.name, value: item.id })));
            linkage.enum('propertyMappings.*.target',
                productRef.current.metadata.properties.map((item: any) => ({ label: item.name, value: item.id, ...item })));
        });

        onFieldValueChange$('actionMappings.*.command.messageType').subscribe(fieldState => {
            const wpropertiesPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message._properties)`);
            const rpropertiesPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message.properties)`);

            const valuePath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message._value)`);
            const functionPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message.functionId)`);
            const functionParamPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message.function)`);

            switch (fieldState.value) {
                case 'READ_PROPERTY':
                    linkage.enum(
                        rpropertiesPath,
                        productRef.current.metadata.properties.map((item: any) => ({ label: item.name, value: item.id, ...item })));
                    linkage.show(valuePath, false);
                    linkage.show(rpropertiesPath, true);
                    linkage.show(wpropertiesPath, false);
                    linkage.show(functionPath, false);
                    linkage.show(functionParamPath, false);

                    return;
                case 'WRITE_PROPERTY':
                    linkage.enum(
                        wpropertiesPath,
                        productRef.current.metadata.properties.map((item: any) => ({ label: item.name, value: item.id, ...item })));
                    linkage.show(wpropertiesPath, true);
                    linkage.show(rpropertiesPath, false);
                    linkage.show(valuePath, true);
                    linkage.show(functionPath, false);
                    linkage.show(functionParamPath, false);
                    return;
                case 'INVOKE_FUNCTION':
                    linkage.hide(wpropertiesPath, false);
                    linkage.hide(rpropertiesPath, false);
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
                linkage.hide(FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.messageType)`), false);
                linkage.show(FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message._properties)`), true);
            } else if (fieldState.value === 'command') {
                linkage.hide(FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.messageType)`), true);
            }

        });
        onFieldValueChange$('id').subscribe(fieldState => {
            if (!fieldState.value) return;

            const product = testRef.current.list.find((item: any) => item.id === fieldState.value);
            try {
                product.metadata = JSON.parse(product.metadata);
            } catch (error) {
                message.error('解析产品数据错误，请检查产品是否存在！');
                props.close();
                return;                
            }
            productRef.current = product;
            linkage.show('applianceType', true);
            !props.data.id&& linkage.value('name', product.name);
        });
        onFieldValueChange$('actionMappings.*.command.message.functionId').subscribe(fieldState => {
            if (!fieldState.value) return;
            const funcPath = FormPath.transform(fieldState.name, /\d/, $1 => `*(actionMappings.${$1}.command.message.function)`);
            const func = productRef.current.metadata.functions.find((item: any) => item.id === fieldState.value);
            linkage.value(funcPath, func.inputs || {});
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
            (func.inputs || []).forEach((item: any) => {
                const valueType = item.valueType;
                list['funcparam.' + item.id] = {
                    "title": item.description ? `{{text("${item.name}",help("${item.description.replaceAll('\n', '')}"))}}` : item.name,
                    "x-component": componentMap[valueType.type],
                    "type": componentType[valueType.type],
                    "x-component-props": {
                        "width": "100%"
                    },
                    "x-mega-props": {
                        "span": 1,
                        "labelCol": 10
                    },
                }
            });
            // 参数列表
            setFuncList(list);
        })


    }

    return (
        <Modal
            width='70VW'
            title={`${props.data.id ? '编辑' : '新建'}`}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { actions.submit() }}
            onCancel={() => props.close()}
        >
            <Spin spinning={loading}>
                {!loading && <SchemaForm
                    effects={linkageEffect}
                    expressionScope={createRichTextUtils()}
                    initialValues={props.data}
                    actions={actions}
                    onSubmit={data => {
                        if (data.actionMappings?.length > 1) {
                            data.actionMappings.map((item: any) => {
                                const funcParam = item?.command?.message?.funcparam;
                                const inputs: any = []
                                if (funcParam) {
                                    Object.keys(funcParam).forEach(key => {
                                        inputs.push({
                                            name: key,
                                            value: funcParam[key]
                                        })
                                    })
                                }

                                item.command = item.command ? item.command : {};
                                if (!item.command.message) {
                                    item.command.message = {};
                                    if (!item.command.message.inputs) {
                                        item.command.message.inputs = inputs;
                                    }
                                } else {
                                    item.command.message.inputs = inputs;
                                }


                                if (item?.command?.messageType === 'WRITE_PROPERTY') {
                                    const temp = {};
                                    const key = item.command.message._properties;
                                    const value = item.command.message._value;
                                    temp[key] = value;
                                    item.command.message.properties = temp;
                                }
                                return item
                            });
                        }
                        props.save(data);
                    }}
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
                                        readOnly:!!props.data.id,
                                        "enum": productInfo.list,
                                        "x-component": "select",
                                        "x-component-props":{
                                            showSearch:true,
                                            optionFilterProp:'children'
                                        }
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
                                        "x-component-props":{
                                            showSearch:true,
                                            optionFilterProp:'children'
                                        },
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
                                        "x-rules": [
                                            {
                                                "required": true,
                                                "message": "此字段必填"
                                            }
                                        ],
                                        "x-component": "select",
                                        "x-component-props":{
                                            showSearch:true,
                                            optionFilterProp:'children'
                                        },
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
                                        // "visible": false,
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
                                                "command.messageType": {
                                                    "title": "指令类型",
                                                    "x-component": "select",
                                                    "visible": false,
                                                    "enum": [
                                                        { "label": "读取属性", "value": "READ_PROPERTY" },
                                                        { "label": "修改属性", "value": "WRITE_PROPERTY" },
                                                        { "label": "调用功能", "value": "INVOKE_FUNCTION" }
                                                    ],
                                                },
                                                "command.message._properties": {
                                                    "title": "属性",
                                                    "x-component": "select",
                                                    "visible": false,
                                                },
                                                "command.message.properties": {
                                                    "title": "属性",
                                                    "x-component": "select",
                                                    "visible": false,
                                                    "x-component-props": {
                                                        "mode": "tags"
                                                    }
                                                },
                                                "command.message._value": {
                                                    "title": "值",
                                                    "x-component": "input",
                                                    "visible": false,
                                                },
                                                "command.message.functionId": {
                                                    "title": "功能",
                                                    "x-component": "select",
                                                    "visible": false,
                                                },
                                                "command.message.function": {
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
                                                    "properties": funcList
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
                                        // "visible": false,
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "source": {
                                                    "title": "DuerOS",
                                                    "x-component": "select",
                                                },
                                                "target": {
                                                    "title": "平台属性",
                                                    "x-component": "select",
                                                    "x-props": {
                                                        "mode": 'tags'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    }
                    } >
                </SchemaForm>}
            </Spin>


        </Modal>
    )
}
export default Save;
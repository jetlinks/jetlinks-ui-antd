import { createFormActions, SchemaForm } from "@formily/antd";
import { Modal } from "antd";
import React from "react";
import { Input } from '@formily/antd-components'
import { GroupItem } from "../data";

interface Props {
    close: Function;
    save: Function;
    data: Partial<GroupItem>;
    flag:boolean;
}

const actions = createFormActions();

const Save: React.FC<Props> = props => {
    
    return (
        <Modal
            visible
            title={`${props.flag? '新建':'编辑' }设备分组`}
            onCancel={() => props.close()}
            onOk={() => { actions.submit() }}
        >
            <SchemaForm
                initialValues={props.flag?{}:props.data}
                actions={actions}
                onSubmit={v => props.save(v)}
                components={{ Input, textarea: Input.TextArea }}
                schema={{
                    "type": "object",
                    "properties": {
                        "NO_NAME_FIELD_$0": {
                            "type": "object",
                            "x-component": "mega-layout",
                            "x-component-props": {
                                "grid": true,
                                // "full": true,
                                "autoRow": true,
                                "responsive": {
                                    "lg": 3,
                                    "m": 2,
                                    "s": 1
                                }
                            },
                            "properties": {
                                "id": {
                                    "title": '标识',
                                    "x-mega-props": {
                                        "span": 3,
                                        "labelCol": 3
                                    },
                                    "x-rules": [
                                        {
                                            "required": true,
                                            "message": "此字段必填"
                                        }
                                    ],
                                    "x-component": "input",
                                    "x-component-props":{
                                        "disabled":!props.flag,
                                    }
                                },
                                "name": {
                                    "x-mega-props": {
                                        "span": 3,
                                        "labelCol": 3
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
                                "description": {
                                    "x-mega-props": {
                                        "span": 3,
                                        "labelCol": 3
                                    },
                                    "title": "描述",
                                    "x-component": "textarea",
                                    "x-component-props": {
                                        "rows": 3
                                    },
                                },
                            }
                        }
                    }
                }} />
        </Modal>
    )
}
export default Save;
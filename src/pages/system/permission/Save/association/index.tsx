import { Table, Popconfirm, Form, Divider, message, Icon, Select, Tag, Col } from 'antd';
import React, { useState, Fragment, useContext, useEffect } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PermissionAction, AssociationPermissionItem, PermissionItem } from '../../data';
import apis from '@/services';

const EditableContext = React.createContext({});

const defaultActionData: PermissionAction[] = [
    { "action": "query", "describe": "查询", defaultCheck: 'true' },
    { "action": "save", "describe": "保存", defaultCheck: 'true' },
    { "action": "delete", "describe": "删除", defaultCheck: 'false' },
    { "action": "import", "describe": "导入", defaultCheck: 'true' },
    { "action": "export", "describe": "导出", defaultCheck: 'true' }
];


const EditableCell: React.FC = (props: any) => {


    const context: any = useContext(EditableContext);

    const { permissions } = context;

    const getInput = () => {
        switch (props.dataIndex) {
            case "preActions":
                return (
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="点击选择"
                    >
                        {defaultActionData.map(e => {
                            return (
                                <Select.Option key={e.action}>{`${e.describe}(${e.action})`}</Select.Option>
                            );
                        })}
                    </Select>
                );
            case "actions":
                return (
                    <Select
                        style={{ width: '100%' }}
                        placeholder="点击选择"
                        mode="multiple"
                    >
                        {defaultActionData.map(e => {
                            return (
                                <Select.Option key={e.action}>{`${e.describe}(${e.action})`}</Select.Option>
                            );
                        })}
                    </Select>
                );
            case "permission":
                return (
                    <Select
                        style={{ width: '100%' }}
                        placeholder="点击选择"
                    >
                        {permissions.map((e: PermissionItem) => {
                            return (
                                <Select.Option key={e.id}>{`${e.name}(${e.id})`}</Select.Option>
                            );
                        })}
                    </Select>
                );
        }
        return null;
    };

    const { getFieldDecorator } = context;
    const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    } = props;


    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `请输入 ${title}!`,
                            },
                        ],
                        initialValue: record[dataIndex],
                    })(getInput())}
                </Form.Item>
            ) : (
                    children
                )}
        </td>
    );
}

interface EditableTableProps extends FormComponentProps {
    data: AssociationPermissionItem[];
    save: Function;
}

interface EditableTableState {
    data: AssociationPermissionItem[];
    editingKey: string;
    permissions: PermissionItem[];
}

const Association: React.FC<EditableTableProps> = (props) => {


    const initState: EditableTableState = {
        data: props.data,
        editingKey: '',
        permissions: [],

    }

    const [permissions, setPermissions] = useState(initState.permissions);
    const [editingKey, setEditingKey] = useState(initState.editingKey);
    const [data, setData] = useState(initState.data);
    useEffect(() => {
        apis.permission.listNoPaging().then(e => {
            setPermissions(e.result);
        }).catch(() => {

        });
    }, []);

    const cancel = (key: any) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        props.save(newData);
        setEditingKey('');
    };

    const isEditing = (record: AssociationPermissionItem) => record.key === editingKey;

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const columnsTemp = [
        {
            title: '前置操作',
            dataIndex: 'preActions',
            width: '25%',
            align: 'center',
            editable: true,
            render: (text: string[]) => {
                if (text && text.length > 0) {
                    return text.map(e => {
                        const item = defaultActionData.find(i => i.action === e);
                        return <Col span={12} key={e} ><Tag color={"green"} style={{ width: 70, textAlign: "center", marginBottom: 4 }} > {(item || {}).describe} </Tag></Col>
                    });
                } else {
                    return text;
                }
            },
        },
        {
            title: '关联权限',
            dataIndex: 'permission',
            width: '35%',
            align: 'center',
            editable: true,
            render: (text: string) => {
                const item = permissions.find(i => i.id === text);
                return <Tag color={"purple"} style={{ textAlign: "center", marginBottom: 4 }} >{(item || {}).name}</Tag>
            },
        },
        {
            title: '关联操作',
            dataIndex: 'actions',
            width: '25%',
            align: 'center',
            editable: true,
            render: (text: string[]) => {
                if (text && text.length > 0) {
                    return text.map(e => {
                        const item = defaultActionData.find(i => i.action === e);
                        return <Col span={12} key={e} ><Tag color={"blue"} style={{ width: 70, textAlign: "center", marginBottom: 4 }} > {(item || {}).describe} </Tag></Col>
                    });
                } else {
                    return text;
                }
            },
        },
        {
            title: (
                <span>
                    操作
                    <Divider type="vertical" />
                    <Icon type="plus" onClick={() => handleAdd()} />
                </span>),
            dataIndex: 'operation',
            width: '20%',
            align: 'center',
            render: (text: any, record: AssociationPermissionItem) => {

                const editable = isEditing(record);
                return editable ? (
                    <span>
                        {
                            <a
                                onClick={() => save(props.form, record)}
                                style={{ marginRight: 8 }}
                            >
                                保存
                                </a>
                        }
                        <Popconfirm title="确认取消？" onConfirm={() => cancel(record.key)}>
                            <a>取消</a>
                        </Popconfirm>
                    </span >
                ) : (
                        <Fragment>
                            <a type="link" onClick={() => edit(record.key)}>
                                编辑
                            </a>
                            <Divider type="vertical" />
                            <a type="link" onClick={() => remove(record.key)}>
                                删除
                            </a>
                        </Fragment>
                    );

            },
        },
    ];

    const columns = columnsTemp.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                // inputType: col.dataIndex === 'defaultCheck' ? 'checkbox' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                align: 'center',
            }),
        };
    });

    const save = (form: any, record: AssociationPermissionItem) => {
        form.validateFields((error: any, row: any) => {
            if (error) {
                return;
            }
            const newData = [...data];
            const index = newData.findIndex(item => record.key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
            props.save(newData);
        });
    }

    const edit = (key: string) => {
        setEditingKey(key);
    }

    const remove = (key: string) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        props.save(newData);
    }

    const handleAdd = () => {
        const key = data.length + 1 + '';
        data.push({
            key: key,
            permission: [],
            actions: [],
            preActions: [],
        });
        setData(data);
        setEditingKey(key);
    }

    return (
        <EditableContext.Provider value={{ ...props.form, permissions }}>
            <Table
                size="small"
                rowKey={(record, index) => `p-${index}`}//TODO 需要有个key,暂时用这个，接口需要调整
                components={components}
                bordered
                dataSource={data}
                columns={columns}
                rowClassName={() => "editable-row"}
                pagination={false}
                onChange={() => message.success('保存成功！！')}
            />
        </EditableContext.Provider>
    );
}

export default Form.create<EditableTableProps>()(Association);

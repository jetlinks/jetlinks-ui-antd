import { Table, Input, Popconfirm, Form, Divider, message, Icon } from 'antd';
import React, { useState, Fragment, useContext } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { DataViewItem } from '../../data';

const EditableContext = React.createContext({});

const EditableCell: React.FC = (props: any) => {

    const form: any = useContext(EditableContext);

    const getInput = () => {
        return <Input size="small" />;
    };

    const { getFieldDecorator } = form;
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
    data: DataViewItem[];
    save: Function;
}

interface EditableTableState {
    data: DataViewItem[];
    editingKey: string;
}

const DataView: React.FC<EditableTableProps> = (props) => {

    const initState: EditableTableState = {
        data: props.data,
        editingKey: '',
    }
    const [editingKey, setEditingKey] = useState(initState.editingKey);
    const [data, setData] = useState(initState.data);
    const cancel = () => {
        setEditingKey('');
    };

    const isEditing = (record: DataViewItem) => record.key === editingKey;

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const columnsTemp: any[] = [
        {
            title: '字段',
            dataIndex: 'name',
            width: '40%',
            editable: true,
        },
        {
            title: '描述',
            dataIndex: 'describe',
            width: '40%',
            editable: true,
        },
        {
            title: (
                <span>
                    操作
                    <Divider type="vertical" />
                    <Icon type="plus" onClick={() => handleAdd()} />
                </span>),
            dataIndex: 'operation',
            render: (text: any, record: DataViewItem) => {

                const editable = isEditing(record);
                return editable ? (
                    <span>
                        {
                            <a
                                onClick={() => save(props.form, record.key)}
                                style={{ marginRight: 8 }}
                            >
                                保存
                                </a>
                        }
                        <Popconfirm title="确认取消？" onConfirm={() => cancel()}>
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
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const save = (form: any, key: string) => {
        form.validateFields((error: any, row: any) => {
            if (error) {
                return;
            }
            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
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
            describe: '',
            name: '',
        });
        setData(data);
        setEditingKey(key);
    }

    return (
        <EditableContext.Provider value={props.form}>
            <Table
                size="small"
                rowKey="name"
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

export default Form.create<EditableTableProps>()(DataView);
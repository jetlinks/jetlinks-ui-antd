import { Table, Input, InputNumber, Popconfirm, Form, Divider, message, Button, Modal, Switch } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { MappingType, MappingConfig } from './data';

const EditableContext = React.createContext({});

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
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
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

interface EditableTableProps extends FormComponentProps {
    data: MappingConfig;
    closeVisible: () => void;
    handleSaveConfig: (data: MappingConfig) => void;
}

interface EditableTableState {
    data: MappingConfig;
    editingKey: string;
}

class EditableTable extends React.Component<EditableTableProps, EditableTableState> {

    state: EditableTableState = {
        data: {
            mappings: [],
            keepSourceData: true,
        },
        editingKey: '',
    }

    columns = [
        {
            title: '源字段',
            dataIndex: 'source',
            editable: true,
        },
        {
            title: '目标字段',
            dataIndex: 'target',
            editable: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text: any, record: any) => {
                const { editingKey } = this.state;
                const editable = this.isEditing(record);
                return editable ? (
                    <span>
                        <EditableContext.Consumer>
                            {form => (
                                <a
                                    href="javascript:;"
                                    onClick={() => this.save(form, record.key)}
                                    style={{ marginRight: 8 }}
                                >
                                    保存
                  </a>
                            )}
                        </EditableContext.Consumer>
                        <Popconfirm title="确认取消？" onConfirm={() => this.cancel()}>
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                        <span>
                            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                                编辑
                                </a>
                            <Divider type="vertical" />
                            <a disabled={editingKey !== ''} onClick={() => this.delete(record.key)}>
                                删除
                                </a>
                        </span>
                    );
            },
        },
    ];

    constructor(props: EditableTableProps) {
        super(props);
        this.state = { data: props.data, editingKey: '' };
    }

    isEditing = (record: any) => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form: any, key: string) {
        form.validateFields((error: any, row: any) => {
            const { data } = this.state;
            if (error) {
                return;
            }
            const newData = [...data.mappings];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({
                    data: {
                        mappings: newData,
                        keepSourceData: data.keepSourceData,
                    },
                    editingKey: '',
                });
            } else {
                newData.push(row);
                this.setState({
                    data: {
                        mappings: newData,
                        keepSourceData: data.keepSourceData,
                    },
                    editingKey: '',
                });
            }
        });
    }

    edit(key: string) {
        this.setState({ editingKey: key });
    }

    delete(key: string) {
        const { data } = this.state;
        this.setState({
            data: {
                mappings: data.mappings.filter(item => item.key !== key),
                keepSourceData: data.keepSourceData,
            },
        });
    }

    handleAdd = () => {
        const { data: { mappings, keepSourceData } } = this.state;
        mappings.push({
            key: mappings.length + '',
            source: '',
            target: '',
            type: MappingType.int,
        });
        this.setState({
            data: {
                mappings,
                keepSourceData,
            },
        });
    }

    saveTableData = () => {
        const { data } = this.state;
        const { handleSaveConfig } = this.props;
        handleSaveConfig(data);
    }

    changeKeepSource = (e: boolean) => {
        const { data } = this.state;
        this.setState({
            data: {
                keepSourceData: e,
                mappings: data.mappings,
            },
        })
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col: any) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record: any) => ({
                    record,
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        const { data } = this.state;
        const { closeVisible, handleSaveConfig } = this.props;
        return (
            <EditableContext.Provider value={this.props.form}>
                <Modal
                    visible
                    title="数据转换"
                    width={840}
                    onOk={this.saveTableData}
                    onCancel={closeVisible}
                    okText='保存'
                    cancelText='关闭'
                >
                    <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        添加
                    </Button>
                    <Divider type="vertical" />
                    保留原字段:
                    <Switch
                        onChange={this.changeKeepSource}
                        unCheckedChildren="否"
                        checkedChildren="是"
                        checked={data.keepSourceData} />
                    <Table
                        components={components}
                        bordered
                        dataSource={data.mappings}
                        columns={columns}
                        rowClassName={() => "editable-row"}
                        pagination={{
                            onChange: this.cancel,
                        }}
                    />
                </Modal>
            </EditableContext.Provider>
        );
    }
}

export default Form.create<EditableTableProps>()(EditableTable);

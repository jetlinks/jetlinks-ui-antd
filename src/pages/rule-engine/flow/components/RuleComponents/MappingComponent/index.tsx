import { Modal, Col, Form, Row, Input, Switch, Divider, Button, Table, Popconfirm, InputNumber, message } from "antd";
import { Component } from "react";
import React from "react";
import { FormComponentProps } from "antd/es/form";
import { MappingConfig, Mapping, MappingType } from "./data";
import EditableCell from "./EditableCell";
import EditableFormTable from "./EditableTable";


const EditableContext = React.createContext({});

interface MappingEditorProps extends FormComponentProps {
    closeVisible: () => void;
    config: MappingConfig;
    saveScript: (data: MappingConfig) => void;
}
interface MappingEditorState {
    config: MappingConfig;
}

class MappingEditor extends Component<MappingEditorProps, MappingEditorState>{

    state: MappingEditorState = {
        config: {
            mappings: [],
        },
    }
    constructor(props: MappingEditorProps) {
        super(props);
        this.state.config = props.config || { mappings: [], keepSourceData: true };
    }

    handleSaveConfig = (data: MappingConfig) => {
        const { saveScript } = this.props;
        saveScript(data);
    }

    render() {
        const { config } = this.state;
        const { closeVisible } = this.props;
        return (
            <EditableFormTable
                closeVisible={closeVisible}
                handleSaveConfig={(data: MappingConfig) => {
                    // message.success(JSON.stringify(data))
                    this.handleSaveConfig(data)
                }}
                data={config} />
        );
    }
}
export default Form.create<MappingEditorProps>()(MappingEditor);

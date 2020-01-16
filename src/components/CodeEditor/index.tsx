import React, { useState } from "react";
import { Card, Row, Select, Divider, Col, Modal, Button, message } from "antd";
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { languageConfiguration, tokensProviderConfig } from "./groovy";


interface Props {
    language?: string;
    value?: string;
    saveCode: Function;
    close: Function;
}

interface State {
    code: string;
    options: any;
    language: string;
    theme: string;
}

const CodeEditor: React.FC<Props> = (props) => {

    const initState: State = {
        code: props.value || '',
        language: props.language || 'groovy',
        theme: 'vs',
        options: {
            selectOnLineNumbers: true,
        },
    }

    const [code, setCode] = useState(initState.code);
    const [language, setLanguage] = useState(initState.language);
    const [theme, setTheme] = useState(initState.theme);



    const editorDidMountHandle = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
        //添加Groovy支持
        var register = {
            id: 'groovy',
            extensions: ['.groovy'],
            aliases: ['groovy', 'Groovy'],
            mimetypes: ['text/x-groovy'],
        }
        monaco.languages.register(register);
        monaco.languages.setMonarchTokensProvider(register.id, tokensProviderConfig);
        monaco.languages.setLanguageConfiguration(register.id, languageConfiguration);
    }

    const changeLanguage = (language: string) => {
        setLanguage(language);
    }

    return (
        <Modal
            onOk={() => props.saveCode(code)}
            onCancel={() => props.close()}
            visible
            width={800}
        >
            <Card bordered={false}>
                {/* <Row>
                    <Col span={8}>
                        <span style={{ marginRight: 10 }}>脚本类型</span>
                        <Select
                            value={language}
                            style={{ width: 120 }}
                            onChange={(value: string) => changeLanguage(value)}
                        >
                            <Select.Option value="javascript">JavaScript</Select.Option>
                            <Select.Option value="java">Java</Select.Option>
                            <Select.Option value="sql">SQL</Select.Option>
                            <Select.Option value="groovy">Groovy</Select.Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <span style={{ marginRight: 10 }}>主题</span>

                        <Select value={theme}
                            style={{ width: 120 }}
                            onChange={(value: string) => changeTheme(value)}
                        >
                            <Select.Option value="vs-dark">Vs-Dark</Select.Option>
                            <Select.Option value="vs">vs</Select.Option>
                            <Select.Option value="hc-black">hc-black</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <Divider /> */}
                <MonacoEditor
                    // width="800"
                    height="300"
                    language={language}
                    theme={theme}
                    value={code}
                    options={{
                        selectOnLineNumbers: true
                    }}
                    onChange={(value) => { setCode(value) }}
                    editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
                />
            </Card>
        </Modal>
    );
}
export default CodeEditor;



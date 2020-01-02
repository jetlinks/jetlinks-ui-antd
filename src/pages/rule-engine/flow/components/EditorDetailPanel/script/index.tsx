import React, { useState } from "react";
import { FormComponentProps } from "antd/lib/form";
import { Input, Form, Row, Col, Select, Button, message } from 'antd';
import { NodeProps } from "../data";
import styles from "../index.less";
import CodeEditor from "@/components/CodeEditor";

interface Props extends FormComponentProps, NodeProps {
}

interface State {
    scriptVisible: boolean;
    lang: string;
    script: string;
}
const Route: React.FC<Props> = (props) => {

    const initState: State = {
        scriptVisible: false,
        lang: props.config.lang || 'javascript',
        script: props.config.script || '',
    }

    const [lang, setLang] = useState(initState.lang);
    const [scriptVisible, setScriptVisible] = useState(initState.scriptVisible);
    const [script, setScript] = useState(initState.script);

    const { form: { getFieldDecorator }, form } = props;
    const inlineFormItemLayout = {
        labelCol: {
            sm: { span: 10 },
        },
        wrapperCol: {
            sm: { span: 14 },
        },
    };

    const saveModelData = () => {
        props.save({ lang, script });
    }

    return (
        <div>
            <Form {...inlineFormItemLayout} className={styles.configForm}>
                {/* <Row gutter={16} >
                    {config.map(item => {
                        return (
                            <Col
                                key={item.key}
                                {...item.styles}
                                onBlur={() => { saveModelData() }}
                            >
                                <Form.Item label={item.label} {...item.formStyle}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: props.config ? props.config[item.key] : '',
                                    })(item.component)}
                                </Form.Item>
                            </Col>
                        );
                    }
                    )}
                </Row > */}

                <Form.Item label="脚本语言">
                    {getFieldDecorator('lang', {
                        initialValue: lang,
                    })(
                        <Select onChange={(value: string) => { setLang(value); saveModelData() }}>
                            <Select.Option value="groovy">Groovy</Select.Option>
                            <Select.Option value="javascript">JavaScript</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="脚本">
                    {getFieldDecorator('script', {
                    })(
                        <Button onClick={() => setScriptVisible(true)}>编辑</Button>
                    )}
                </Form.Item>
            </Form>
            {
                scriptVisible &&
                <CodeEditor
                    language={lang}
                    value={script}
                    saveCode={(code: string) => {
                        setScript(code);
                        saveModelData();
                        message.success('保存成功')
                    }}
                    close={() => setScriptVisible(false)}
                />
            }
        </div>
    );
}

export default Form.create<Props>()(Route);
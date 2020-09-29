import { getWebsocket } from "@/layouts/GlobalWebSocket";
import { Input, Divider, Button, Row, Col, message } from "antd";
import React, { useEffect, useState } from "react";
import Service from "../../../service";
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-hjson';
import 'ace-builds/src-noconflict/mode-jsoniq';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';
interface Props {
    data: any;
    item: any
}
const Session: React.FC<Props> = props => {
    const { data, item } = props;
    const [subMsg, setSubMsg] = useState<any>('');
    const service = new Service('network/simulator');


    const [msg, setMsg] = useState<string>('');
    useEffect(() => {
        if (item.type === 'mqtt_client') {
            setMsg('QoS0 /topic \n\n{}');
        }
        let simulator = getWebsocket(
            `network-simulator-session`,
            `/network/simulator/${data.id}/${item.id}`,
            {},
        ).subscribe(
            (resp: any) => {
                setSubMsg(resp);
            },
        );
        return () => {
            simulator.unsubscribe();
        }
    }, [item]);
    const sendMsg = (msg: string) => {
        service.sendMessage(data.id, item.id, msg).subscribe(
            () => {
                message.success('发送成功!')
            },
            () => message.error('保存失败!'))
    }

    return (
        <div>
            {/* <Input.TextArea rows={9} value={subMsg.payload} /> */}
            <AceEditor
                mode='json'
                theme="eclipse"
                name="app_code_editor"
                key='simulator'
                fontSize={14}
                value={subMsg.payload}
                showPrintMargin
                showGutter
                wrapEnabled
                highlightActiveLine  //突出活动线
                enableSnippets  //启用代码段
                style={{ width: '100%', height: 230 }}
                setOptions={{
                    enableBasicAutocompletion: true,   //启用基本自动完成功能
                    enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                    enableSnippets: true,  //启用代码段
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
            <Divider />
            {/* <Input.TextArea rows={8} onChange={e => setMsg(e.target.value)} /> */}

            <AceEditor
                mode='string'
                theme="eclipse"
                name="send_msg"
                key='simulator_send'
                fontSize={14}
                value={msg}
                showPrintMargin
                onChange={e => { setMsg(e) }}
                showGutter
                wrapEnabled
                highlightActiveLine  //突出活动线
                enableSnippets  //启用代码段
                style={{ width: '100%', height: 220 }}
                setOptions={{
                    enableBasicAutocompletion: true,   //启用基本自动完成功能
                    enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                    enableSnippets: true,  //启用代码段
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
            <Row gutter={10} style={{ height: 80, marginTop: 40 }}>
                <Col push={19}>
                    <Button
                        onClick={() => { setSubMsg({ payload: '' }) }}
                        type="danger">清空</Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={() => { sendMsg(msg) }}
                        type="primary">发送</Button>
                </Col>
            </Row>
        </div >
    )
}
export default Session;
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Icon, Modal, Row, Spin } from 'antd';
import styles from '../style.less';
import apis from '@/services';
import metatdataImg from '../img/metadata.png';
import protocolImg from '../img/protocol.png';
import metadataItemImg from '../img/metadata-item.png';
import procotolItemImg from '../img/protocol-item.png';
import { router } from 'umi';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';

const Metadata = ({ loading }: { loading: boolean; }) => {

    const [protocolList, setProtocolList] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [spinning1, setSpinning1] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<string>('');

    useEffect(() => {
        setSpinning1(true)
        apis.protocol.listNoPaging().then(resp => {
            if (resp.status === 200) {
                setProtocolList(resp.result);
            }
            setSpinning1(false);
        })

        setSpinning(true);
        apis.deviceProdcut.queryNoPagin({ paging: false }).then(resp => {
            if (resp.status === 200) {
                setList(resp?.result);
            }
            setSpinning(false);
        })
    }, [])

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{ marginBottom: 20 }}>
                    <div className={styles.metadata}>
                        <div className={styles.top}>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={metatdataImg} style={{ width: '100%' }} />
                                </div>
                                <div className={styles.titles}>
                                    <div className={styles.title}>
                                        物模型
                                    </div>
                                    <div className={styles.desc}>
                                        物模型是对设备在云端的功能描述，包括设备的属性、功能和事件。物联网平台内置基础设备物模型。
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Spin spinning={spinning}>
                            <div className={styles.bottom}>
                                {
                                    list.length > 0 ?
                                        <div className={styles.box}>
                                            {

                                                list.map(item => (
                                                    <div className={styles.item} key={item.id} onClick={() => {
                                                        setVisible(true);
                                                        setCurrent(item?.metadata || '')
                                                    }}>
                                                        <div className={styles.img}><img src={metadataItemImg} /></div>
                                                        <div className={styles.right}>
                                                            <div className={styles.title}>{item?.name}</div>
                                                            <div className={styles.desc}>ID:{item.id}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        : <div style={{ width: "100%" }}>
                                            <Empty />
                                        </div>
                                }
                            </div>
                        </Spin>
                    </div>
                </Card>
            </Col>
            <Col span={12}>
                <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{ marginBottom: 20 }}>
                    <div className={styles.metadata}>
                        <div className={styles.top}>
                            <div className={styles.box}>
                                <div className={styles.icon}>
                                    <img src={protocolImg} style={{ width: '100%' }} />
                                </div>
                                <div className={styles.titles}>
                                    <div className={styles.title}>
                                        协议库
                                    </div>
                                    <div className={styles.desc}>
                                        物模型是对设备在云端的功能描述，包括设备的属性、功能和事件。物联网平台内置基础设备物模型。
                                    </div>
                                </div>
                            </div>
                            <Button style={{ marginRight: 24, marginTop: 5 }} onClick={() => {
                                router.push(`/network/protocol`);
                            }}>查看协议<Icon type="right" /></Button>
                        </div>
                        <Spin spinning={spinning1}>
                            <div className={styles.bottom}>
                                {
                                    protocolList.length > 0 ?
                                        protocolList.slice(0, 6).map(item => (
                                            <div key={item.id} className={styles.itemPro}>
                                                <div className={styles.img}><img src={procotolItemImg} /></div>
                                                <div className={styles.right}>
                                                    <div className={styles.title}>{item.name}</div>
                                                    <div className={styles.desc}>ID:{item.id}</div>
                                                </div>
                                            </div>
                                        )) : <div style={{ width: "100%" }}>
                                            <Empty />
                                        </div>
                                }
                            </div>
                        </Spin>
                    </div>
                </Card>
            </Col>
            {
                visible && !!current &&
                <Modal
                    title="物模型"
                    visible
                    onOk={() => {
                        setVisible(false);
                        setCurrent('')
                    }}
                    onCancel={() => {
                        setVisible(false);
                        setCurrent('')
                    }}
                >
                    <AceEditor
                        readOnly={true}
                        mode='json'
                        theme="eclipse"
                        name="app_code_editor"
                        fontSize={14}
                        value={JSON.stringify(JSON.parse(current), null, 2)}
                        showPrintMargin
                        showGutter={false}
                        wrapEnabled
                        highlightActiveLine  //突出活动线
                        enableSnippets  //启用代码段
                        style={{ width: '100%', height: 400 }}
                        setOptions={{
                            enableBasicAutocompletion: true,   //启用基本自动完成功能
                            enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                            enableSnippets: true,  //启用代码段
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </Modal>
            }
        </Row>
    );
};

export default Metadata;

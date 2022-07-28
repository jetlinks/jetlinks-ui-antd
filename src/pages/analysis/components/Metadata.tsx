import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Icon, Row, Spin } from 'antd';
import styles from '../style.less';
import apis from '@/services';
import metatdataImg from '../img/metadata.png';
import protocolImg from '../img/protocol.png';
import metadataItemImg from '../img/metadata-item.png';
import procotolItemImg from '../img/protocol-item.png';
import { router } from 'umi';

const Metadata = ({ loading }: { loading: boolean; }) => {

    const [protocolList, setProtocolList] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [spinning1, setSpinning1] = useState<boolean>(false);

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
                (resp?.result || []).some((item: any) => {
                    const metadata = item?.metadata ? JSON.parse(item.metadata || '{}') : [];
                    if (metadata?.properties && metadata.properties.length > 4) {
                        setList(metadata?.properties);
                        return true
                    }
                    return false;
                })
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
                                                    <div key={item} className={styles.item}>
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
                            <Button style={{ marginRight: 24 }} onClick={() => {
                                router.push(`/network/protocol`);
                            }}>查看协议<Icon type="right" /></Button>
                        </div>
                        <Spin spinning={spinning1}>
                            <div className={styles.bottom}>
                                {
                                    protocolList.length > 0 ?
                                        protocolList.slice(0, 6).map(item => (
                                            <div key={item} className={styles.itemPro}>
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
        </Row>
    );
};

export default Metadata;

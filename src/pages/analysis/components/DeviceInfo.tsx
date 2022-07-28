import React, { useEffect, useState } from 'react';
import { Button, Card, Icon, Tooltip } from 'antd';
import styles from '../style.less';
import apis from '@/services';
import iconImg from '../img/device.png';
import totalImg from '../img/total.png';
import encodeQueryParam from '@/utils/encodeParam';
import { router } from 'umi';

const DeviceInfo = ({ loading }: { loading: boolean; }) => {

    const [total, setTotal] = useState<number>(0);
    const [num1, setNum1] = useState<number>(0);
    const [num2, setNum2] = useState<number>(0);
    const [num3, setNum3] = useState<number>(0);
    const [num4, setNum4] = useState<number>(0);
    const [num5, setNum5] = useState<number>(0);
    const [num6, setNum6] = useState<number>(0);
    const [num7, setNum7] = useState<number>(0);

    useEffect(() => {
        apis.deviceInstance.count({}).then(resp => {
            if (resp.status === 200) {
                setTotal(resp.result)
            }
        });
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-401-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum1(resp.result)
            }
        });
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-501-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum2(resp.result)
            }
        });
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-601-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum3(resp.result)
            }
        });
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-701-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum4(resp.result)
            }
        })
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-801-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum5(resp.result)
            }
        })
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-901-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum6(resp.result)
            }
        })
        apis.deviceInstance.count(encodeQueryParam({
            terms: {
                'productId$dev-prod-cat': '-1001-'
            },
        })).then(resp => {
            if (resp.status === 200) {
                setNum7(resp.result)
            }
        })
    }, [])

    return (
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{ marginBottom: 20 }}>
            <div className={styles.deviceInfo}>
                <div className={styles.top}>
                    <div className={styles.box}>
                        <div className={styles.icon}>
                            <img src={iconImg} style={{ width: '100%' }} />
                        </div>
                        <div className={styles.titles}>
                            <div className={styles.title}>
                                设备信息
                            </div>
                            <div className={styles.desc}>
                                包含平台中设备的基础统计信息和分类设备数量信息
                            </div>
                        </div>
                    </div>
                    <Button style={{ marginRight: 24 }} onClick={() => {
                        router.push(`/device/instance`);
                    }}>查看设备<Icon type="right" /></Button>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.total}>
                        <div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>设备总数</div>
                            <div className={styles.text}><span className={styles.num}>{total}</span>个</div>
                        </div>
                        <div><img src={totalImg} style={{ width: '100%' }} /></div>
                    </div>
                    <div className={styles.other}>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num1}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>智慧消防<Tooltip title="包含智慧用电、消防用水、智慧烟雾传感器等消防设备。">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num2}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>文物监测<Tooltip title="包含静力水准仪、测斜仪、裂缝针/伸缩仪等结构体监测传感器。">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num3}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>视频融合<Tooltip title="智能广播终端、大屏设备数量。">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num4}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>智慧酒店<Tooltip title="酒店智能家居体系(智能门锁、开关、窗帘、插座等)设备数量。">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num5}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>智慧旅游<Tooltip title="关于景区综合管理、电子门禁、游客服务等设备数量统计">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num6}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>智慧能耗<Tooltip title="智能水表、智能电表等能耗设备统计。">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.text}><span className={styles.num}>{num7}</span>个</div>
                            <div className={styles.title}><div className={styles.titleBefore}></div>安防监控<Tooltip title="通过各类监控摄像头、人脸识别设备进行布防和监控，实现自动感应，触发报警等安防功能。">
                                <Icon style={{ marginLeft: 5 }} type="question-circle" />
                            </Tooltip></div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DeviceInfo;

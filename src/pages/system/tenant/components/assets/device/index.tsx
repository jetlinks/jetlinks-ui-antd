import React, { useState, useContext, useEffect } from "react";
import { List, Card, Tooltip, Icon } from "antd";
import { router } from "umi";
import styles from '../index.less';
import Edit from "./edit";
import { TenantContext } from "../../../detail";
import Service from "../../../service";
import encodeQueryParam from "@/utils/encodeParam";


const Device = () => {
    const avatar = 'https://tse2-mm.cn.bing.net/th/id/OIP.T1lmAIkITnIiwRmQMiUnjAAAAA?pid=Api&rs=1';
    const [visible, setVisible] = useState<boolean>(false);
    const data = useContext(TenantContext);
    const service = new Service('tenant');

    const [active, setActive] = useState(0);
    const [notActive, setNotActive] = useState(0);
    useEffect(() => {
        service.assets.deviceCount(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'device',

                }),
                state: 'notActive'
            }
        })).subscribe(resp => {
            setNotActive(resp)
        });
        service.assets.deviceCount(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'device',

                }),
                state: 'active'
            }
        })).subscribe(resp => {
            setActive(resp)
        })
    }, []);

    return (
        <List.Item style={{ paddingRight: '10px' }}>
            <Card
                hoverable
                className={styles.card}
                actions={[
                    <Tooltip title="查看">
                        <Icon type="eye" onClick={() => router.push({
                            pathname: `/device/instance`,
                            query: {
                                terms: {
                                    id$assets: JSON.stringify({
                                        tenantId: data?.id,
                                        assetType: 'device',
                                        // not: true,
                                    })
                                }
                            }
                        })} />
                    </Tooltip>,
                    <Tooltip title="编辑">
                        <Icon type="edit" onClick={() => setVisible(true)} />
                    </Tooltip>]}
            >
                <Card.Meta
                    avatar={<img alt="" className={styles.cardAvatar} src={avatar} />}
                    title={<a>设备</a>}
                />
                <div className={styles.cardInfo}>
                    <div>
                        <p>在线</p>
                        <p>{active}</p>
                    </div>
                    <div>
                        <p>离线</p>
                        <p>{notActive}</p>
                    </div>
                </div>
            </Card>
            {visible && (
                <Edit
                    data={data}
                    close={() => setVisible(false)} />
            )}
        </List.Item>
    )
}
export default Device;
import React, { useState, useContext, useEffect } from "react";
import { List, Card, Tooltip, Icon } from "antd";
import { router } from "umi";
import encodeQueryParam from "@/utils/encodeParam";
import IconFont from "@/components/IconFont";
import styles from '../index.less';
import Edit from "./edit";
import { TenantContext } from "../../../detail";
import Service from "../../../service";

interface Props {
    user: any
}
const Protocol = (props: Props) => {
    const [visible, setVisible] = useState<boolean>(false);
    const data = useContext(TenantContext);
    const service = new Service('tenant');

    const [deploy, setDeploy] = useState(0);
    const [unDeploy, setUndeploy] = useState(0);
    const getData = () => {
        service.assets.protocolCount(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'protocol',
                    memberId: props.user,
                }),
                state: 1 // 已发布
            }
        })).subscribe(resp => {
            setDeploy(resp)
        });
        service.assets.protocolCount(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'protocol',
                    memberId: props.user,
                }),
                state: 0 // 未发布
            }
        })).subscribe(resp => {
            setUndeploy(resp);
            // setActive(resp)
        })
    }
    useEffect(() => {
        getData();
    }, [props.user]);

    return (
        <List.Item style={{ paddingRight: '10px' }}>
            <Card
                hoverable
                className={styles.card}
                actions={[
                    <Tooltip title="查看">
                        <Icon type="eye" onClick={() => router.push({
                            pathname: `/network/protocol`,
                            query: {
                                terms: {
                                    id$assets: JSON.stringify({
                                        tenantId: data?.id,
                                        assetType: 'protocol',
                                        memberId: props.user,
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
                    avatar={<IconFont type="icon-anzhuangbaoguanli" style={{ fontSize: 45 }} />}
                    title={<a>协议</a>}
                />
                <div className={styles.cardInfo}>
                    <div>
                        <p>已发布</p>
                        <p>{deploy}</p>
                    </div>
                    <div>
                        <p>未发布</p>
                        <p>{unDeploy}</p>
                    </div>
                </div>
            </Card>
            {visible && (
                <Edit
                    user={props.user}
                    data={data}
                    close={() => {
                        setVisible(false);
                        getData();
                    }} />
            )}
        </List.Item>
    )
}
export default Protocol;
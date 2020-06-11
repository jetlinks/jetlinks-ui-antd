import React, { useState, useContext, useEffect } from "react";
import { List, Card, Tooltip, Icon } from "antd";
import { router } from "umi";
import styles from '../index.less';
import Edit from "./edit";
import { TenantContext } from "../../../detail";
import Service from "../../../service";
import encodeQueryParam from "@/utils/encodeParam";

const Product = () => {
    const avatar = 'https://tse2-mm.cn.bing.net/th/id/OIP.T1lmAIkITnIiwRmQMiUnjAAAAA?pid=Api&rs=1';
    const [visible, setVisible] = useState<boolean>(false);
    const data = useContext(TenantContext);

    const service = new Service('tenant');

    const [pub, setPub] = useState(0);
    const [unPub, setUnPub] = useState(0)

    useEffect(() => {

        service.assets.productCount(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'product',

                }),
                state: 1
            }
        })).subscribe(resp => {
            setPub(resp)
        });
        service.assets.productCount(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'product',

                }),
                state: 0
            }
        })).subscribe(resp => {
            setUnPub(resp)
        })
    }, [])
    return (
        <List.Item style={{ paddingRight: '10px' }}>
            <Card
                hoverable
                className={styles.card}
                actions={[
                    <Tooltip title="查看">
                        <Icon type="eye" onClick={() => router.push({
                            pathname: `/device/product`,
                            query: {
                                terms: {
                                    id$assets: JSON.stringify({
                                        tenantId: data?.id,
                                        assetType: 'product',
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
                    title={<a>产品</a>}
                />
                <div className={styles.cardInfo}>
                    <div>
                        <p>已发布</p>
                        <p>{pub}</p>
                    </div>
                    <div>
                        <p>未发布</p>
                        <p>{unPub}</p>
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
export default Product;
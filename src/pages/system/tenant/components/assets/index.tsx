import React, { useContext } from "react";
import { List, Card, Button, Typography, Input, Tooltip, Icon } from "antd";
import { TenantItem } from "../../data";
import styles from './index.less';
import Product from "./product";
import Device from "./device";

const Assets = () => {
    // const nullData: Partial<CardListItemDataType> = {};
    // const avatar = 'https://tse2-mm.cn.bing.net/th/id/OIP.T1lmAIkITnIiwRmQMiUnjAAAAA?pid=Api&rs=1';
    // const list = [{
    //     id: 1,
    //     avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP.T1lmAIkITnIiwRmQMiUnjAAAAA?pid=Api&rs=1',
    //     title: '产品',
    //     description: '测试描述',
    // }, {
    //     id: 2,
    //     avatar: 'https://tse2-mm.cn.bing.net/th/id/OIP.T1lmAIkITnIiwRmQMiUnjAAAAA?pid=Api&rs=1',
    //     title: '设备',
    //     description: '测试设备'
    // }]

    return (
        <div>
            <div style={{ marginBottom: 50, marginTop: 20 }}>
                <Input.Search />
            </div>
            <div className={styles.cardList}>

                <List<Partial<any>>
                    rowKey="id"
                    loading={false}
                    grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                >

                    <Product />
                    <Device />
                </List>
            </div>
        </div>
    );
}
export default Assets;
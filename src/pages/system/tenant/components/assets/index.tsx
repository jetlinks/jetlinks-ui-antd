import React from "react";
import { List, Input } from "antd";
import styles from './index.less';
import Product from "./product";
import Device from "./device";

const Assets = () => (
    <div>
        {/* <div style={{ marginBottom: 50, marginTop: 20 }}>
            <Input.Search />
        </div> */}
        <div className={styles.cardList}>

            <List<Partial<any>>
                rowKey="id"
                loading={false}
                grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            >

                <Product />
                <Device />
            </List>
        </div>
    </div>
)
export default Assets;
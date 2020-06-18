import React, { useEffect, useState } from "react";
import { List, Input, Select } from "antd";
import encodeQueryParam from "@/utils/encodeParam";
import styles from './index.less';
import Product from "./product";
import Device from "./device";
import Service from "../../service";
import Protocol from "./protocol";

interface Props {
    data: any;
    user?: any;
}
const Assets = (props: Props) => {
    const service = new Service('tenant');

    const { data: { id }, user } = props;

    const [userList, setUserList] = useState([]);
    const [current, setCurrent] = useState();
    useEffect(() => {
        service.member.query(id, encodeQueryParam({})).subscribe(resp => {
            const temp = resp.data.map((item: any) => ({
                id: item.userId,
                name: item.name
            }));
            setUserList(temp);
        });
        if (user) {
            setCurrent(user.userId);
        }
    }, [user?.userId]);
    return (


        <div>
            <div style={{ marginBottom: 20, marginTop: 20 }}>
                <Select
                    style={{ width: '100%' }}
                    value={current}
                    onChange={(e: any) => setCurrent(e)}>
                    {userList.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                </Select>
            </div>

            <div className={styles.cardList}>

                <List<Partial<any>>
                    rowKey="id"
                    loading={false}
                    grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
                >

                    <Product user={current} />
                    <Device user={current} />
                    <Protocol user={current} />
                </List>
            </div>
        </div >
    )
}
export default Assets;
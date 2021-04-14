import React, { useEffect, useState } from "react";
import { List, Input, Select, Form } from "antd";
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
            const temp = resp.map((item: any) => ({
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
            <div style={{ marginBottom: 20, marginTop: 20, width: '30%' }}>
                <Form.Item label="选择成员"
                    labelAlign="left"
                    labelCol={{ xxl: 4, xl: 8, lg: 7, md: 8 }}
                    wrapperCol={{ xxl: 20, xl: 16, lg: 17, md: 16 }}
                >
                    <Select
                        style={{ width: '100%' }}
                        value={current}
                        onChange={(e: any) => setCurrent(e)}
                        allowClear
                    >
                        {userList.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </div>

            <div className={styles.cardList}>

                <List<Partial<any>>
                    rowKey="id"
                    loading={false}
                    grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
                >

                    <Product user={current} />
                    <Device user={current} />
                    {/* <Protocol user={current} /> */}
                </List>
            </div>
        </div >
    )
}
export default Assets;
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import React, { useState, useEffect } from "react"
import { Card, Button, List, Radio, Input, Avatar, Tag, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { TenantItem } from "./data";
import styles from './index.less';
import Service from "./service";
import { ListData } from "@/services/response";
import Save from "./save";
import Detail from "./detail";
import { router } from "umi";


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;


const ListContent = ({
    data: { members, state, },
}: {
    data: TenantItem;
}) => (
        <div className={styles.listContent}>
            <div className={styles.listContentItem}>
                <span>状态</span>
                <p><Tag color="#f50">{state.text}</Tag></p>
            </div>
            <div className={styles.listContentItem}>
                <span>成员数</span>
                <p><Tag color="#f50">{members}</Tag></p>
            </div>
            <div className={styles.listContentItem}>
                <span>开始时间</span>
                <p>{moment(new Date()).format('YYYY-MM-DD HH:mm')}</p>
            </div>
        </div>
    );


const Tenant = () => {

    const defualtImg = 'https://tse2-mm.cn.bing.net/th/id/OIP.O9TfOiCrUHdOyEE92JtfBQAAAA?pid=Api&rs=1';
    const service = new Service('tenant');
    const [loading, setLoading] = useState<boolean>(false);
    const [tloading, setTloading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<Partial<TenantItem>>({});
    const [list, setList] = useState<ListData<TenantItem>>();
    const [searchParam, setSearchParam] = useState();


    const handleSearch = (params: any) => {
        setTloading(true);
        setSearchParam(params);
        service.list(params).subscribe(data => {
            setList(data);
            setTloading(false);
        });
    }

    useEffect(() => {
        handleSearch({})
    }, []);


    const paginationProps = {
        showQuickJumper: true,
        pageSize: 5,
        total: list?.total || 0,
    };

    const extraContent = (
        <div className={styles.extraContent}>
            <RadioGroup defaultValue="all">
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="progress">正常</RadioButton>
                <RadioButton value="waiting">禁用</RadioButton>
            </RadioGroup>
            <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
        </div>
    );

    const saveItem = (data: any) => {
        setLoading(true);
        service.create(data).subscribe(() => {
            message.success('保存成功');
            setLoading(false);
            setVisible(false);
            setCurrent({});
            handleSearch(searchParam);
        });
    }

    return (
        <PageHeaderWrapper>
            <Spin spinning={tloading}>
                <div className={styles.standardList}>
                    <Card
                        className={styles.listCard}
                        bordered={false}
                        title="租户列表"
                        style={{ marginTop: 24 }}
                        bodyStyle={{ padding: '0 32px 40px 32px' }}
                        extra={extraContent}
                    >
                        <Button
                            type="dashed"
                            style={{ width: '100%', marginBottom: 8 }}
                            onClick={() => {
                                setVisible(true);
                                setCurrent({});
                            }}
                        >
                            <PlusOutlined />
                     添加
                    </Button>

                        <List
                            size="large"
                            rowKey="id"
                            pagination={paginationProps}
                            dataSource={list?.data}
                            renderItem={(item: TenantItem) => (
                                <List.Item
                                    actions={[
                                        <a
                                            key="edit"
                                            onClick={e => {
                                                e.preventDefault();
                                            }}
                                        >
                                            禁用
                                    </a>,
                                        <a>删除</a>,
                                        <a onClick={e => {
                                            e.preventDefault();
                                            router.push(`/system/tenant/detail/${item.id}`)
                                        }}>查看</a>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.photo || defualtImg} shape="square" size="large" />}
                                        title={<a >{item.name}</a>}
                                        description='描述信息描述信息描述信息描述信息描述信息描述信息'
                                    />
                                    <ListContent data={item} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </Spin>

            {visible && (
                <Spin spinning={loading}>
                    <Save
                        close={() => { setVisible(false) }}
                        save={(item: any) => saveItem(item)}
                        data={current}
                    />
                </Spin>
            )}
        </PageHeaderWrapper>
    )
}
export default Tenant;
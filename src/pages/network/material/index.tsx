import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import { Avatar, Card, Icon, List, Modal, Switch } from 'antd';
import Button from 'antd/es/button';
import React from 'react';
import Img from '../img/产品.png';
import { useState } from 'react';
import styles from './index.less';
import Edit from './edit';
import { useEffect } from 'react';
import Service from './service';
import encodeQueryParam from '@/utils/encodeParam';

function Material() {
    const service = new Service('/network/material');
    const [active, setActive] = useState<boolean>(true);
    const [delVisible, setDelVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<any>({});
    const [dataList, setDataList] = useState<any>({
        data: [
            {
                id: '123',
                name: '123'
            }
        ]
    });

    const iconStyles = {
        color: '#1890FF',
        border: '1px solid #1890FF'
    }
    const renderTitle = (name: string) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '95%', fontWeight: 600, fontSize: '16px' }}><AutoHide title={name} /></div>
                <div><Switch defaultChecked /></div>
            </div>
        )
    }

    useEffect(() => {
        service.getDeviceGatewayList('edge-pi', encodeQueryParam({
            pageSize: 10
        })).subscribe(resp => {
            setDataList({
                data: [...resp]
            })
        })
    }, []);

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.title}>物管理</div>
                <div className={styles.right}>
                    <Button type="primary" style={{ marginRight: '16px' }} onClick={() => {
                        setEditVisible(true);
                        setCurrentData({});
                    }}>新增物</Button>
                    <div className={styles.iconBox}>
                        <div className={styles.icon} style={active ? iconStyles : { borderRight: 'none' }} onClick={() => {
                            setActive(true);
                        }}><Icon type="unordered-list" /></div>
                        <div className={styles.icon} style={!active ? iconStyles : { borderLeft: 'none' }} onClick={() => {
                            setActive(false);
                        }}><Icon type="appstore" /></div>
                    </div>
                </div>
            </div>
            <div>
                {active ? <div>
                    <List<any>
                        rowKey="id"
                        grid={{ gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }}
                        dataSource={dataList.data || []}
                        pagination={{
                            // current: dataList.pageIndex + 1,
                            // total: dataList.total,
                            // pageSize: dataList.pageSize,
                            // // onChange,
                            // showQuickJumper: true,
                            // showSizeChanger: true,
                            // hideOnSinglePage: true,
                            // pageSizeOptions: ['8', '16', '40', '80'],
                            // style: { marginTop: -20 },
                            // showTotal: (total: number) =>
                            //     `共 ${total} 条记录 第  ${dataList.pageIndex + 1}/${Math.ceil(
                            //         dataList.total / dataList.pageSize,
                            //     )}页`
                        }}
                        renderItem={item => {
                            if (item && item.id) {
                                return (
                                    <List.Item key={item.id}>
                                        <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                                            actions={[
                                                <a onClick={() => {
                                                    setCurrentData(item);
                                                    setEditVisible(true);
                                                }}>编辑</a>,
                                                <a onClick={() => {

                                                }}>查看</a>,
                                                <a onClick={() => {
                                                    setDelVisible(true);
                                                }}>删除</a>
                                            ]}
                                        >
                                            <Card.Meta
                                                avatar={<Avatar size={60} src={Img} />}
                                                title={renderTitle(item.name)}
                                            />
                                            <div className={styles.content}>
                                                <div className={styles.item}>
                                                    <p className={styles.itemTitle}>设备数量</p>
                                                    <p className={styles.itemText}>1</p>
                                                </div>
                                                <div className={styles.item}>
                                                    <p className={styles.itemTitle}>网关类型</p>
                                                    <p className={styles.itemText}>{item.gatewayProvider}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </List.Item>
                                );
                            }
                            return;
                        }}
                    />
                </div> : <div></div>}
            </div>
            <Edit
                data={currentData}
                visible={editVisible}
                onOk={() => {

                }}
                onCancel={() => {
                    setEditVisible(false)
                }}
            />
            <Modal
                title="确认删除"
                visible={delVisible}
                onOk={() => { }}
                onCancel={() => { setDelVisible(false) }}
            >
                <p>删除该产品，该产品下的所有信息及设备都将被删除，</p>
                <p>是否确认删除？</p>
            </Modal>
        </div>
    );
}

export default Material;
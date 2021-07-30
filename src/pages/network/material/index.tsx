import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import { Avatar, Card, message, Modal, Popconfirm, Spin, Switch } from 'antd';
import Button from 'antd/es/button';
import React from 'react';
import Img from '../img/产品.png';
import { useState } from 'react';
import styles from './index.less';
import Save from './save';
import Detail from './detail';
import { useEffect } from 'react';
import Service from './service';
import Cards from '@/components/Cards';
import encodeQueryParam from '@/utils/encodeParam';

function Material() {

    const service = new Service('/network/material');
    const [delVisible, setDelVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<any>({});
    const [deviceCount, setDeviceCount] = useState<any>({});
    const [spinning, setSpinning] = useState<boolean>(true);
    const [searchParam, setSearchParam] = useState<any>({
        pageSize: 8
    })
    const [dataList, setDataList] = useState<any>({
        data: [],
        pageIndex: 0,
        pageSize: 8,
        total: 0
    });

    const statusMap = new Map();
    statusMap.set("enabled", 'success');
    statusMap.set("disabled", 'error');

    const renderTitle = (item: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '95%', fontWeight: 600, fontSize: '16px' }}><AutoHide title={item.name} /></div>
                <div><Switch defaultChecked={item.state.value === 'disabled' ? false : true} onChange={(checked: boolean) => {
                    if (checked) {
                        _start(item.id)
                    } else {
                        _stop(item.id)
                    }
                }} /></div>
            </div>
        )
    }

    const handleSearch = (params: any) => {
        setSearchParam(params);
        setSpinning(true);
        service.getDeviceGatewayList(encodeQueryParam(params)).subscribe(resp => {
            setSpinning(false);
            setDataList(resp)
            
        })
        
    }

 
    useEffect(() => {
        handleSearch({ pageSize: 8 });
        
    }, []);
    useEffect(() => {
        dataList.data?.map((item: any) => {
            service.count(encodeQueryParam({ terms: { 'productId': item.productId } }))
                .subscribe(res => {
                    if (res.status === 200) {
                        deviceCount[item.productId] = String(res.result);
                        setDeviceCount({ ...deviceCount });
                    } else {
                        deviceCount[item.productId] = '/';
                        setDeviceCount({ ...deviceCount });
                    }
                })
        });
    }, [dataList]);

    const _start = (id: string) => {
        service.start(id).subscribe(resp => {
            if (resp.status === 200) {
                message.success('操作成功！');
                handleSearch({ pageSize: 10 });
            }
        })
    }

    const _stop = (id: string) => {
        service.stop(id).subscribe(resp => {
            if (resp.status === 200) {
                message.success('操作成功！');
                handleSearch({ pageSize: 10 });
            }
        })
    }

    const _del = (id: string) => {
        service.del(id).subscribe(resp => {
            if (resp.status === 200) {
                message.success('操作成功！');
                handleSearch({ pageSize: 10 });
            }
        })
    }

    const saveData = (params?: any) => {
        service.saveDeviceGateway(params).subscribe(
            (res) => {
                if (res.status === 200) {
                    message.success('操作成功！');
                    handleSearch({ pageSize: 10 });
                }
            })
    };

    return (
        <div>
            <Spin spinning={spinning}>
                {!detailVisible ?
                    <Cards
                        title='物管理'
                        cardItemRender={(item: any) => <div style={{ height: 200, backgroundColor: '#fff' }}>
                            <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                                actions={[
                                    <a onClick={() => {
                                        setCurrentData(item);
                                        setEditVisible(true);
                                    }}>编辑</a>,
                                    <a onClick={() => {
                                        setCurrentData(item);
                                        setDetailVisible(true);
                                    }}>查看</a>,
                                    <Popconfirm
                                        title="确认删除吗？"
                                        onConfirm={() => {
                                            setDelVisible(true);
                                            setCurrentData(item);
                                        }}>
                                        <a onClick={() => {

                                        }}>删除</a>
                                    </Popconfirm>
                                ]}
                            >
                                <Card.Meta
                                    avatar={<Avatar size={60} src={Img} />}
                                    title={renderTitle(item)}
                                />
                                <div className={styles.content}>
                                    <div className={styles.item}>
                                        <p className={styles.itemTitle}>设备数量</p>
                                        <p className={styles.itemText}>{deviceCount[item.productId]}</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p className={styles.itemTitle}>网关类型</p>
                                        <p className={styles.itemText}>{item.gatewayProvider}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>}
                        toolNode={
                            <Button type="primary" style={{ marginRight: '16px' }} onClick={() => {
                                setEditVisible(true);
                                setCurrentData({});
                                const a = dataList.data.map((item:any)=>{item.productId})
                                console.log(dataList.data)
                                console.log(a)
                            }}>新增物</Button>
                        }
                        pagination={{
                            current: dataList?.pageIndex + 1,
                            total: dataList?.total,
                            pageSize: dataList?.pageSize,
                            onChange: (page: number, pageSize?: number) => {
                              handleSearch({
                                ...searchParam,
                                pageIndex: page - 1,
                                pageSize: pageSize || searchParam.pageSize
                              })
                            },
                            onShowSizeChange: (current, size) => {
                              handleSearch({
                                ...searchParam,
                                pageIndex: current-1,
                                pageSize: size || searchParam.pageSize
                              })
                            },
                            showQuickJumper: true,
                            showSizeChanger: true,
                            pageSizeOptions: ['8', '16', '40', '80'],
                            showTotal: (total: number) =>
                              `共 ${total} 条记录 第  ${dataList?.pageIndex + 1}/${Math.ceil(
                                dataList?.total / dataList?.pageSize,
                              )}页`
                          }}
                        dataSource={dataList.data}
                        columns={[
                            {
                                title: '产品名称',
                                align: 'center',
                                dataIndex: 'productName',
                            },
                            {
                                title: '网关类型',
                                align: 'center',
                                dataIndex: 'gatewayProvider',
                            },
                            {
                                title: '说明',
                                align: 'center',
                                dataIndex: 'description',
                            },
                            {
                                title: '状态',
                                align: 'center',
                                render: (record: any) => record ? <Switch defaultChecked={record?.state?.value === 'disabled' ? false : true} onChange={(checked: boolean) => {
                                    if (checked) {
                                        _start(record.id)
                                    } else {
                                        _stop(record.id)
                                    }
                                }} /> : '/'
                            },
                            {
                                title: '接入设备数',
                                align: 'center',
                                render: (text) => <a>1</a>
                            },
                            {
                                title: '操作',
                                align: 'center',
                                render: (record) => <>
                                    <Button type='link' onClick={() => {
                                        setCurrentData(record);
                                        setEditVisible(true);
                                    }}>编辑</Button>
                                    <Button type='link' onClick={() => {
                                        setCurrentData(record);
                                        setDetailVisible(true);
                                    }}>查看</Button>
                                    <Button type='link' onClick={() => {
                                        setDelVisible(true);
                                        setCurrentData(record);
                                    }}>删除</Button>
                                </>,
                                width: 280
                            },
                        ]}
                    /> : <Detail data={currentData} reBack={() => {
                        setDetailVisible(false);
                    }} />
                }
            </Spin>
            {editVisible && <Save
                data={currentData}
                close={() => {
                    setEditVisible(false);
                    setCurrentData({});
                }}
                save={(item: any) => {
                    saveData(item);
                    setEditVisible(false);
                    setCurrentData({});
                }} />
            }
            <Modal
                title="确认删除"
                visible={delVisible}
                onOk={() => {
                    _del(currentData.id);
                    setDelVisible(false);
                }}
                onCancel={() => { setDelVisible(false); }}
            >
                <p>删除该产品，该产品下的所有信息及设备都将被删除，</p>
                <p>是否确认删除？</p>
            </Modal>
        </div>
    );
}

export default Material;
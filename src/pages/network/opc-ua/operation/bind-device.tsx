import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Badge, Button, message, Modal, Select, Table } from 'antd';
import apis from '@/services';
import styles from '@/utils/table.less';
import Search from '@/pages/device/gateway/Search';
import moment from 'moment';
import { PaginationConfig } from 'antd/lib/pagination';
import { SorterResult } from 'antd/lib/table';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
    close: Function;
    opcId: string;
}

const BindDevice: React.FC<Props> = props => {

    const [deviceData, setDeviceData] = useState<any>({});
    const [clusterList, setClusterList] = useState<any[]>([]);
    const [cluster, setCluster] = useState<string>("");
    const [current, setCurrent] = useState(0);
    const [deviceIds, setDeviceIds] = useState<any[]>([]);
    const [searchParam, setSearchParam] = useState({ pageSize: 10, terms: {} });

    const handleSearch = (params: any) => {
        params.terms = {
            ...params.terms,
            'productId$dev-protocol': 'opc-ua'
        }
        setSearchParam(params);
        apis.deviceInstance.list(encodeQueryParam(params))
            .then(response => {
                if (response.status === 200) {
                    setDeviceData(response.result);
                }
            })
            .catch(() => {
            });
    }

    const queryClusterList = () => {
        apis.opcUa.clusterList().then(res => {
            if (res.status === 200) {
                setClusterList(res.result);
            }
        })
    };

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');

    const steps = [
        {
            title: '选择集群'
        },
        {
            title: '绑定设备'
        }
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: '设备名称',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            ellipsis: true,
        },
        {
            title: '注册时间',
            dataIndex: 'registryTime',
            width: '200px',
            ellipsis: true,
            render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
            sorter: true,
            defaultSortOrder: 'descend',
        },
        {
            title: '状态',
            dataIndex: 'state',
            width: '120px',
            render: (record: any) =>
                record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
        }
    ];

    const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam.terms
        })
    };

    const renderFooter = () => (
        <div>
            {current > 0 && (<Button onClick={() => { setCurrent(current - 1) }}>上一步</Button>)}
            {current < steps.length - 1 && (<Button onClick={() => {
                if (cluster !== '') {
                    setCurrent(current + 1);
                } else {
                    message.error('请选择集群');
                }
            }}>下一步</Button>)}
            {current === steps.length - 1 && (
                <Button type="primary" onClick={() => { props.close() }}>确认</Button>
            )}
        </div>
    )

    const getBindedDevice = () => {
        //获取已绑定数据
        apis.opcUa.getDeviceBindListNoPaging(encodeQueryParam({
            terms: {
                opcUaId: props.opcId
            }
        })).then(resp => {
            let children: any[] = [];
            resp.result.map((item: any) => {
                children.push(item.deviceId);
            })
            setDeviceIds(children);
        })
    }

    const unbindSelection = {
        onChange: (selectedRowKeys: any) => {
            setDeviceIds(selectedRowKeys);
        },
        onSelect: (record: any, selected: any) => {
            let list: string[] = [record.id];
            if (selected) {
                _bind(list);
            } else {
                _unbind(list);
            }
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
            let list: string[] = [];
            changeRows.map((item: any) => {
                list.push(item.id);
            });
            if (selected) {
                _bind(list);
            } else {
                _unbind(list);
            }
        },
    };

    const _bind = (deviceIds: string[]) => {
        let data: any[] = deviceData.data || [];
        let params: any[] = [];
        deviceIds.map((item: any) => {
            let device = data.filter(i => {
                return i.id === item
            })
            params.push({
                deviceId: item,
                opcUaId: props.opcId,
                serverId: cluster,
                productId: device[0].productId,
                deviceName: device[0].name,
                productName: device[0].productName
            })
        })
        apis.opcUa.bindManyDevice(params).then(res => {
            if (res.status === 200) {
                message.success('绑定成功！');
            }else{
                message.error('绑定失败')
            }
        })
    };

    const _unbind = (deviceIds: string[]) => {
        apis.opcUa.removeManyBind(props.opcId, deviceIds).then(res => {
            if (res.status === 200) {
                message.success('解绑成功！');
            }else{
                message.success('解绑失败！');
            }
        })
    };

    useEffect(() => {
        queryClusterList();
        handleSearch(searchParam);
        getBindedDevice();
    }, []);

    return (
        <Modal
            title='绑定设备'
            visible
            width={1000}
            footer={renderFooter()}
            onCancel={() => {
                props.close();
            }}
        >
            <div style={{ padding: '10px' }}>
                <div>
                    {current === 0 ?
                        <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                            <Form.Item key="clusterId" label="集群">
                                <Select placeholder="请选择" value={cluster}
                                    onChange={(value: string) => {
                                        setCluster(value);
                                    }}>
                                    {(clusterList || []).map(item => (
                                        <Select.Option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.id}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form> :
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>
                                <Search
                                    search={(params: any) => {
                                        setSearchParam(params);
                                        handleSearch({ terms: params, sorter: searchParam.sorter, pageSize: 10 });
                                    }}
                                />
                            </div>

                            <div className={styles.StandardTable}>
                                <Table
                                    scroll={{
                                        y: '450px'
                                    }}
                                    columns={columns}
                                    dataSource={deviceData.data}
                                    rowKey="id"
                                    onChange={onTableChange}
                                    rowSelection={{
                                        type: 'checkbox',
                                        selectedRowKeys: deviceIds,
                                        ...unbindSelection
                                    }}
                                    pagination={{
                                        current: deviceData.pageIndex + 1,
                                        total: deviceData.total,
                                        pageSize: deviceData.pageSize
                                    }}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    );
};

export default Form.create<Props>()(BindDevice);

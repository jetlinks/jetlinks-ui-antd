import React, { useEffect, useState } from 'react';
import { Badge, Modal, Spin, Table } from 'antd';
import apis from '@/services';
import { DeviceInstance } from '@/pages/device/instance/data.d';
import styles from '@/utils/table.less';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import SearchForm from '@/components/SearchForm';

interface Props {
    save: Function;
    masterId: string;
}

interface State {
    searchParam: any;
    deviceData: any;
    deviceList: any[];
}

const ChoiceDevice = (props: Props) => {
    const { masterId } = props
    const initState: State = {
        searchParam: {
            pageSize: 10,
            pageIndex: 0,
            terms: []
        },
        deviceData: {},
        deviceList: []
    };

    const [searchParam, setSearchParam] = useState(initState.searchParam);
    const [deviceData, setDeviceData] = useState(initState.deviceData);
    const [deviceList, setDeviceList] = useState(initState.deviceList);
    const [spinning, setSpinning] = useState(true);

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        const data = {
            pageSize: params.pageSize || 10,
            pageIndex: params.pageIndex || 0,
            "terms": [
                {
                    "terms": [
                        {
                            "column": "id$modbus-master$not",
                            "value": masterId
                        },
                        ...params?.terms
                    ]
                }
            ]
        }
        apis.modbus.getDeviceList(data).then(response => {
            if (response.status === 200) {
                setDeviceData(response.result);
            }
            setSpinning(false);
        })
    };

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const onTableChange = (
        pagination: PaginationConfig
    ) => {
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms: searchParam?.terms || []
        });
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setDeviceList(selectedRowKeys);
        },
    };

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');

    const columns: ColumnProps<DeviceInstance>[] = [
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
            render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            width: '80px',
            render: record =>
                record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
        },
    ];

    return (
        <Modal
            title="绑定设备"
            visible
            width="80vw"
            onCancel={() => {
                props.save([]);
            }}
            onOk={() => {
                props.save(deviceList)
            }}
        >
            <Spin spinning={spinning}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                        <SearchForm
                            search={(params: any) => {
                                const data: any[] = []
                                if (params) {
                                    Object.keys(params).forEach(key => {
                                        if (params[key]) {
                                            data.push({
                                                "column": key,
                                                "value": `%${params[key]}%`,
                                                "termType": "like",
                                                "type": "and"
                                            })
                                        }
                                    })
                                }
                                handleSearch({
                                    pageSize: 10,
                                    terms: [...data]
                                })
                            }}
                            formItems={[
                                {
                                    label: '设备ID',
                                    key: 'id',
                                    type: 'string',
                                },
                                {
                                    label: '设备名称',
                                    key: 'name',
                                    type: 'string',
                                }
                            ]}
                        />
                    </div>
                    <div className={styles.StandardTable}>
                        <Table
                            columns={columns}
                            dataSource={deviceData.data}
                            rowKey="id"
                            onChange={onTableChange}
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                                selectedRowKeys: deviceList
                            }}
                            size='middle'
                            pagination={{
                                current: deviceData.pageIndex + 1,
                                total: deviceData.total,
                                pageSize: deviceData.pageSize,
                                showQuickJumper: true,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total: number) =>
                                    `共 ${total} 条记录 第  ${deviceData.pageIndex + 1}/${Math.ceil(
                                        deviceData.total / deviceData.pageSize,
                                    )}页`,
                            }}
                        />
                    </div>
                </div>
            </Spin>
        </Modal>
    );
};

export default ChoiceDevice


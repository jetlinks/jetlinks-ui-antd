import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Badge, Button, Drawer, message, Spin, Table} from 'antd';
import {ColumnProps, PaginationConfig, SorterResult} from "antd/lib/table";
import api from "@/services";
import moment from 'moment';
import encodeParam from "@/utils/encodeParam";
import Authority from "../authority/index";
import {DeviceInstance} from "@/pages/device/instance/data";
import SearchForm from "@/components/SearchForm";

interface Props extends FormComponentProps {
    targetId: string;
    targetType: string;
    close: Function;
}

const BindDecide: React.FC<Props> = props => {

    const [spinning, setSpinning] = useState(true);
    const [authority, setAuthority] = useState(false);
    const [deviceData, setDeviceData] = useState<any>({});
    const [deviceIdList, setDeviceIdList] = useState<any[]>([]);
    const [searchParam, setSearchParam] = useState<any>({
        pageSize: 10,
        terms: {},
        sorts: {
            order: 'descend',
            field: 'id',
        },
    });

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');
    statusMap.set('online', 'success');
    statusMap.set('offline', 'error');
    statusMap.set('notActive', 'processing');

    const handleSearch = (parmes: any) => {
        setSearchParam(parmes);
        parmes.terms = {
            ...parmes.terms,
            "id#dim-assets$not": `{"assetType":"device","targets":[{"type":"${props.targetType}","id":"${props.targetId}"}]}`
        };
        api.deviceInstance
            .list(encodeParam(parmes))
            .then(res => {
                setSpinning(false);
                if (res.status === 200) {
                    setDeviceData(res.result);
                }
            });
    };

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    const bindProduct = (value: any) => {
        const data = [{
            "targetType": props.targetType,
            "targetId": props.targetId,
            "assetType": "device",
            "assetIdList": deviceIdList,
            "permission": value.permission
        }];

        api.assets.BindAssets("device", data)
            .then((result: any) => {
                if (result.status === 200) {
                    message.success("资产分配成功");
                    props.close();
                } else {
                    message.error("资产分配失败");
                }
            }).catch(() => {
        })
    };

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
            render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
            sorter: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            width: '90px',
            render: record =>
                record ? <Badge status={statusMap.get(record.value)} text={record.text}/> : '',
            filterMultiple: false,
        }
    ];

    const onTableChange = (
        pagination: PaginationConfig,
        filters: any,
        sorter: SorterResult<DeviceInstance>,
    ) => {
        let {terms} = searchParam;
        handleSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            terms,
            sorts: sorter,
        })
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setDeviceIdList(selectedRowKeys);
        },
    };

    return (
        <Drawer
            visible
            title='分配设备资产'
            width='50%'
            onClose={() => props.close()}
            closable
        >
            <Spin spinning={spinning}>
                <SearchForm
                    search={(params: any) => {
                        handleSearch({
                            terms: {...params},
                            pageSize: 10,
                            sorts: searchParam.sorts,
                        });
                    }}
                    formItems={[
                        {
                            label: '设备ID',
                            key: 'id$like',// id
                            type: 'string',
                        },
                        {
                            label: '设备名称',
                            key: 'name$LIKE',
                            type: 'string',
                        }
                    ]}
                />
                <Table
                    columns={columns}
                    dataSource={(deviceData || {}).data}
                    rowKey="id"
                    onChange={onTableChange}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
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
            </Spin>
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button
                    onClick={() => {
                        props.close();
                    }}
                    style={{marginRight: 8}}
                >
                    关闭
                </Button>
                {deviceIdList.length > 0 && <Button
                    onClick={() => {
                        setAuthority(true);
                    }}
                    type="primary"
                >
                    绑定
                </Button>}
            </div>
            {authority && <Authority close={(data: any) => {
                setAuthority(false);
                if (data) {
                    bindProduct(data);
                }
            }}/>}
        </Drawer>
    );
};

export default Form.create<Props>()(BindDecide);

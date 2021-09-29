import React, {Fragment, useEffect, useState} from "react";
import {Badge, Button, Card, message, Popconfirm, Spin, Table} from "antd";
import encodeParam from "@/utils/encodeParam";
import {ColumnProps, PaginationConfig, SorterResult} from "antd/lib/table";
import {DeviceInstance} from "@/pages/device/instance/data";
import {FormComponentProps} from "antd/es/form";
import api from "@/services";
import moment from 'moment';
import BindDecide from "./bindDevice";
import SearchForm from "@/components/SearchForm";

interface Props extends FormComponentProps {
    targetType: string;
    targetId: string;
}

const deviceBind: React.FC<Props> = (props) => {

    const [searchParam, setSearchParam] = useState({
        pageSize: 10,
        terms: {},
        sorts: {
            order: 'descend',
            field: 'id',
        },
    });
    const [spinning, setSpinning] = useState<boolean>(false);

    const [deviceIdList, setDeviceIdLIst] = useState<any[]>([]);
    const [deviceData, setDeviceData] = useState<any>({});
    const [deviceBind, setDeviceBind] = useState<any>();

    const statusMap = new Map();
    statusMap.set('在线', 'success');
    statusMap.set('离线', 'error');
    statusMap.set('未激活', 'processing');
    statusMap.set('online', 'success');
    statusMap.set('offline', 'error');
    statusMap.set('notActive', 'processing');

    const handleSearch = (params: any) => {
        setSearchParam(params);
        params.terms = {
            ...params.terms,
            "id#dim-assets": `{"assetType":"device","targets":[{"type":"${props.targetType}","id":"${props.targetId}"}]}`
        };
        api.deviceInstance
            .list(encodeParam(params))
            .then(res => {
                setSpinning(false);
                if (res.status === 200) {
                    setDeviceData(res.result);
                }
            });
    };

    const unBindClassify = (value: any[]) => {
        const data = [{
            "targetType": props.targetType,
            "targetId": props.targetId,
            "assetType": "device",
            "assetIdList": value
        }];

        api.assets.UnBindAssets("device", data)
            .then((result: any) => {
                if (result.status === 200) {
                    message.success("资产解绑成功");
                    deviceIdList.splice(0, deviceIdList.length);
                    handleSearch(searchParam);
                } else {
                    message.error("资产解绑失败");
                    handleSearch(searchParam);
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
        },
        {
            title: '操作',
            width: '200px',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    <Popconfirm
                        title="确认解绑？"
                        onConfirm={() => {
                            setSpinning(true);
                            unBindClassify([record.id])
                        }}
                    >
                        <a>解绑</a>
                    </Popconfirm>
                </Fragment>
            ),
        },
    ];

    useEffect(() => {
        if (props.targetId != null || props.targetId != "") {
            handleSearch(searchParam);
        }
    }, [props.targetId]);

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
        });
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setDeviceIdLIst(selectedRowKeys);
        },
    };

    return (
        <div>
            <Spin spinning={spinning}>
                <Card>
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
                                key: 'id$like',
                                type: 'string',
                            },
                            {
                                label: '设备名称',
                                key: 'name$LIKE',
                                type: 'string',
                            }
                        ]}
                    />
                    <Button
                        icon="plus"
                        type="primary"
                        style={{marginBottom: '20px'}}
                        onClick={() => {
                            setDeviceBind(true);
                        }}
                    >
                        分配资产
                    </Button>
                    {deviceIdList.length > 0 && (
                        <Popconfirm
                            title="确认批量解绑？"
                            onConfirm={() => {
                                setSpinning(true);
                                unBindClassify(deviceIdList);
                            }}
                        >
                            <Button
                                icon="delete"
                                type="primary"
                                style={{marginBottom: '20px', marginLeft: "20px"}}
                            >
                                批量解绑
                            </Button>
                        </Popconfirm>
                    )}
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
                </Card>
                {deviceBind && <BindDecide targetId={props.targetId} targetType={props.targetType} close={() => {
                    setDeviceBind(false);
                    handleSearch(searchParam);
                }}/>}
            </Spin>
        </div>
    );
};
export default deviceBind;

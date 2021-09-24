import React, {Fragment, useEffect, useState} from "react";
import {Button, Card, message, Popconfirm, Spin, Table} from "antd";
import api from "@/services";
import encodeParam from "@/utils/encodeParam";
import BindProduct from "./bindProduct";
import {DeviceInstance} from "@/pages/device/instance/data";
import {ColumnProps, PaginationConfig, SorterResult} from "antd/lib/table";
import SearchForm from "@/components/SearchForm";

interface Props {
    targetId: string;
    targetType: string;
}

const productBind: React.FC<Props> = (props) => {

    const [spinning, setSpinning] = useState(true);
    const [productIdList, setProductIdList] = useState([]);
    const [productData, setProductData] = useState<any>({});
    const [searchParam, setSearchParam] = useState<any>({
        pageSize: 10,
        terms: {},
        sorts: {
            order: 'descend',
            field: 'id',
        },
    });
    const [productBind, setProductBind] = useState<boolean>(false);

    const columns: ColumnProps<any>[] = [
        {
            title: '产品ID',
            align: 'left',
            width: 150,
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: '产品名称',
            align: 'left',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '说明',
            dataIndex: 'description',
            width: 300,
            align: 'center',
            ellipsis: true,
            render: (description: string) => (description ? description : '--'),
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

    const handleSearch = (params: any) => {
        setSearchParam(params);
        params.terms = {
            ...params.terms,
            "id#dim-assets": `{"assetType":"product","targets":[{"type":"${props.targetType}","id":"${props.targetId}"}]}`
        };
        api.deviceProdcut
            .query(encodeParam(params))
            .then(res => {
                setSpinning(false);
                if (res.status === 200) {
                    setProductData(res.result);
                }
            });
    };

    const unBindClassify = (value: any[]) => {
        const data = [{
            "targetType": props.targetType,
            "targetId": props.targetId,
            "assetType": "product",
            "assetIdList": value
        }];

        api.assets.UnBindAssets("product", data)
            .then((result: any) => {
                if (result.status === 200) {
                    message.success("资产解绑成功");
                    productIdList.splice(0, productIdList.length);
                    handleSearch(searchParam);
                } else {
                    message.error("资产解绑失败");
                    handleSearch(searchParam);
                }
            }).catch(() => {
        })
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setProductIdList(selectedRowKeys);
        },
    };

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
        })
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
                                label: '产品名称',
                                key: 'name$LIKE',
                                type: 'string',
                            },
                            {
                                label: '产品类型',
                                key: 'deviceType$IN',
                                type: 'list',
                                props: {
                                    data: [
                                        {id: 'device', name: '直连设备'},
                                        {id: 'childrenDevice', name: '网关子设备'},
                                        {id: 'gateway', name: '网关设备'},
                                    ],
                                    mode: 'tags',
                                },
                            },
                        ]}
                    />
                    <Button
                        icon="plus"
                        type="primary"
                        style={{marginBottom: '20px'}}
                        onClick={() => {
                            setProductBind(true);
                        }}
                    >
                        分配资产
                    </Button>
                    {productIdList.length > 0 && (
                        <Popconfirm
                            title="确认批量解绑？"
                            onConfirm={() => {
                                setSpinning(true);
                                unBindClassify(productIdList);
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
                        dataSource={(productData || {}).data}
                        rowKey="id"
                        onChange={onTableChange}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        pagination={{
                            current: productData.pageIndex + 1,
                            total: productData.total,
                            pageSize: productData.pageSize,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total: number) =>
                                `共 ${total} 条记录 第  ${productData.pageIndex + 1}/${Math.ceil(
                                    productData.total / productData.pageSize,
                                )}页`,
                        }}
                    />
                </Card>
            </Spin>
            {productBind && <BindProduct targetId={props.targetId} targetType={props.targetType} close={() => {
                setProductBind(false);

                handleSearch(searchParam);
            }}/>
            }
        </div>
    );
};
export default productBind;
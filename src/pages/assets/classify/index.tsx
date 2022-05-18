import React, {Fragment, useEffect, useState} from "react";
import {Button, Card, message, Popconfirm, Spin, Table} from "antd";
import api from "@/services";
import encodeParam from "@/utils/encodeParam";
import {TenantContext} from "@/pages/device/product-category";
import BindClassify from "./bindClassify";
import {ColumnProps} from "antd/lib/table";

interface Props {
    targetId: string;
    targetType: string;
}

const classifyBind: React.FC<Props> = (props) => {

    const [spinning, setSpinning] = useState(true);
    const [categoryIdList, setCategoryIdList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryBind, setCategoryBind] = useState<boolean>(false);

    const columns: ColumnProps<any>[] = [
        {
            title: '分类ID',
            align: 'left',
            width: 150,
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: '标识',
            align: 'left',
            width: 150,
            dataIndex: 'key',
        },
        {
            title: '分类名称',
            dataIndex: 'name',
            align: 'center',
            width: 200,
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

    const handleSearch = () => {
        api.productCategoty
            .query_tree(encodeParam({
                paging: false,
                sorts: {
                    field: "id",
                    order: "desc"
                },
                terms: {
                    "id#dim-assets": `{"assetType":"deviceCategory","targets":[{"type":"${props.targetType}","id":"${props.targetId}"}]}`
                }
            }))
            .then(res => {
                setSpinning(false);
                if (res.status === 200) {
                    setCategoryList(res.result);
                }
            });
    };

    const unBindClassify = (value: any[]) => {
        const data = [{
            "targetType": props.targetType,
            "targetId": props.targetId,
            "assetType": "deviceCategory",
            "assetIdList": value
        }];

        api.assets.UnBindAssets("deviceCategory", data)
            .then((result: any) => {
                if (result.status === 200) {
                    message.success("资产解绑成功");
                    categoryIdList.splice(0, categoryIdList.length);
                    handleSearch();
                } else {
                    message.error("资产解绑失败");
                    handleSearch();
                }
            }).catch(() => {
        })
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setCategoryIdList(selectedRowKeys);
        },
    };

    useEffect(() => {
        if (props.targetId) {
            handleSearch();
        }
    }, [props.targetId]);

    return (
        <div>
            <Spin spinning={spinning}>
                <Card>
                    <Button
                        icon="plus"
                        type="primary"
                        style={{marginBottom: '20px'}}
                        onClick={() => {
                            setCategoryBind(true);
                        }}
                    >
                        分配资产
                    </Button>
                    {categoryIdList.length > 0 && (
                        <Popconfirm
                            title="确认批量解绑？"
                            onConfirm={() => {
                                setSpinning(true);
                                unBindClassify(categoryIdList);
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
                    <TenantContext.Provider value={categoryList}>
                        <Table
                            dataSource={categoryList || []}
                            rowKey="id"
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            columns={columns}/>
                    </TenantContext.Provider>
                </Card>
            </Spin>
            {categoryBind && <BindClassify targetId={props.targetId} targetType={props.targetType} close={() => {
                setCategoryBind(false);
                handleSearch();
            }}/>
            }
        </div>
    );
};
export default classifyBind;
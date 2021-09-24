import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Button, Drawer, message, Spin, Table} from 'antd';
import {ColumnProps} from "antd/lib/table";
import api from "@/services";
import encodeParam from "@/utils/encodeParam";
import Search from "antd/es/input/Search";
import Authority from "../authority/index";

interface Props extends FormComponentProps {
    targetId: string;
    targetType: string;
    close: Function;
}

const BindClassify: React.FC<Props> = props => {

    const [spinning, setSpinning] = useState(true);
    const [authority, setAuthority] = useState(false);
    const [categoryLIst, setCategoryLIst] = useState<any[]>([]);
    const [categoryIdList, setCategoryIdList] = useState([]);

    const handleSearch = (parmes: any) => {
        const terms = {
            ...parmes,
            "id#dim-assets$not": `{"assetType":"deviceCategory","targets":[{"type":"${props.targetType}","id":"${props.targetId}"}]}`
        };
        api.productCategoty
            .query_tree(encodeParam({
                paging: false,
                sorts: {
                    field: "id",
                    order: "desc"
                },
                terms: terms
            }))
            .then(res => {
                if (res.status === 200) {
                    setCategoryLIst(res.result);
                    setSpinning(false);
                }
            });
    };

    useEffect(() => {
        handleSearch({});
    }, []);

    const bindClassify = (value: any) => {
        const data = [{
            "targetType": props.targetType,
            "targetId": props.targetId,
            "assetType": "deviceCategory",
            "assetIdList": categoryIdList,
            "permission": value.permission
        }];

        api.assets.BindAssets("deviceCategory",data)
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
            dataIndex: 'key',
        },
        {
            title: '分类名称',
            dataIndex: 'name',
            align: 'center',
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: any) => {
            setCategoryIdList(selectedRowKeys);
        },
    };

    return (
        <Drawer
            visible
            title='分配分类资产'
            width='50%'
            onClose={() => props.close()}
            closable
        >
            <Spin spinning={spinning}>
                <Search
                    allowClear
                    placeholder="请输入品类名称"
                    enterButton
                    onSearch={value => {
                        if (value === '') {
                            handleSearch({});
                        } else {
                            handleSearch({name$LIKE: value});
                        }
                    }}
                    style={{width: '43%', paddingBottom: 20}}
                />
                <Table
                    dataSource={categoryLIst || []}
                    columns={columns}
                    rowKey="id"
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    pagination={{
                        pageSize: 10,
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
                {categoryIdList.length > 0 && <Button
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
                    bindClassify(data);
                }
            }}/>}
        </Drawer>
    );
};

export default Form.create<Props>()(BindClassify);

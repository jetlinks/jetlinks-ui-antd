import { Drawer, Button, message, Tag, Avatar } from "antd";
import React, { useState, useEffect, Fragment } from "react";
import Service from "@/pages/system/tenant/service";
import encodeQueryParam from "@/utils/encodeParam";
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import Add from "./add";
import User from "./user";
import {router} from 'umi';
import productImg from "@/pages/device/product/img/product.png";

interface Props {
    close: Function;
    data: any;
    user: any
}
interface State {
    list: []
}
const Edit = (props: Props) => {
    const service = new Service('tenant');

    const initState: State = {
        list: []
    };

    const [list, setList] = useState(initState.list);
    const [add, setAdd] = useState<boolean>(false);
    const [cat, setCat] = useState<boolean>(false);
    const [asset, setAsset] = useState();
    const { data } = props;
    const [selected, setSelected] = useState<any[]>([]);

    const initSearch = {
        terms: {
            id$assets: JSON.stringify({
                tenantId: data?.id,
                assetType: 'product',
                memberId: props.user,
                // not: true,
            })
        },
        pageIndex: 0,
        pageSize: 10,
    }
    const [searchParam, setSearchParam] = useState<any>(initSearch);

    let product = (tempSearch: any, datalist: any[]) => {
        return new Promise((resolve, reject) => {
            service.assets.product(encodeQueryParam(tempSearch)).subscribe(res => {
                res.data.forEach(value => {
                    service.assets.members(data.id, 'product', value.id).subscribe(resp => {
                        datalist.push({
                            id: value.id,
                            name: value.name,
                            photoUrl: value.photoUrl || productImg,
                            tenant: resp.filter((item: any) => item.binding === true).map((i: any) => i.userName)
                        })
                        if (datalist.length == res.data.length) {
                            resolve({
                                pageIndex: res.pageIndex,
                                pageSize: res.pageSize,
                                total: res.total,
                                data: datalist
                            })
                        }
                    });
                })
            })
        })
    }


    const handleSearch = (params: any) => {
        const tempParam = { ...searchParam, ...params, };
        const defaultItem = searchParam.terms;
        const tempTerms = params?.terms;
        const terms = tempTerms ? { ...defaultItem, ...tempTerms } : initSearch;
        let tempSearch = {};

        if (tempTerms) {
            tempParam.terms = terms;
            tempSearch = tempParam
        } else {
            tempSearch = initSearch
        }
        setSearchParam(tempSearch);
        let datalist: any = [];
        product(tempSearch, datalist).then(res => {
            setList(res)
        })
    }
    useEffect(() => {
        handleSearch(searchParam);
    }, []);
    const rowSelection = {
        onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            setSelected(selectedRows)
        },
        getCheckboxProps: (record: any) => ({
            name: record.name,
        }),
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
        }, 
        {
            title: '名称',
            render: (text: any, record: any) => <div><Avatar shape="square" src={record.photoUrl || productImg} /><span>{record.name}</span> </div>
        },
        {
            title: '租户名称',
            ellipsis: true,
            align: 'center',
            width: 400,
            render: (record: any) => (
                <div onClick={() => {setAsset(record); setCat(true);}}>
                    {
                        record.tenant.length > 0 ? 
                        record.tenant.map(i => {
                            return (
                                <Tag color="purple" key={i}>{i}</Tag>
                            )
                        })
                        :<span>--</span>
                    }
                </div>
            )
        }, 
        {
            title: '操作',
            align: 'center',
            render: (_: string, record: any) => (
                <Fragment>
                    <a onClick={() => { router.push(`/device/product/save/${record.id}`); }}>查看</a>
                </Fragment>
            )
        }
    ]

    const unbind = () => {
        service.assets.unbind(data.id, [{
            assetIdList: selected.map(item => item.id),
            assetType: 'product'
        }]).subscribe(() => {
            message.success('解绑成功');
            handleSearch(searchParam);
            setSelected([]);
        })
    }
    return (
        <Drawer
            title="编辑产品资产"
            visible
            width='75VW'
            onClose={() => props.close()}
        >

            <SearchForm
                search={(params: any) => {
                    handleSearch({ terms: params });
                }}
                formItems={[
                    {
                        label: "ID",
                        key: "id$LIKE",
                        type: 'string'
                    },
                    {
                        label: "名称",
                        key: "name$LIKE",
                        type: 'string'
                    }
                ]}
            />
            <Button
                type="primary"
                style={{ marginBottom: 10 }}
                onClick={() => setAdd(true)}>添加</Button>
            {
                selected.length > 0 && (
                    <Button
                        type="danger"
                        style={{ marginBottom: 10, marginLeft: 10 }}
                        onClick={() => { unbind() }}>
                        {`解绑${selected.length}项`}
                    </Button>
                )
            }
            <ProTable
                rowKey="id"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={list?.data || []}
                onSearch={(searchData: any) => handleSearch(searchData)}
                paginationConfig={list || {}}
            />
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
                    style={{ marginRight: 8 }}
                >
                    关闭
                </Button>
            </div>
            {add && (
                <Add
                    user={props.user}
                    data={data}
                    close={() => {
                        setAdd(false);
                        handleSearch(searchParam);
                    }} />
            )}
            {cat && <User asset={asset} close={() => setCat(false)} />}
        </Drawer>
    )
}
export default Edit;
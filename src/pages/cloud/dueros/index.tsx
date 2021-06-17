import { PageHeaderWrapper } from "@ant-design/pro-layout"
import { Button, Card, Divider, message, Popconfirm } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import styles from '@/utils/table.less';
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import { ColumnProps } from "antd/lib/table";
import Service from "./service";
import encodeQueryParam from "@/utils/encodeParam";
import Save from "./save";

interface Props {

}
const DuerOS: React.FC<Props> = props => {
    const service = new Service('dueros/product');
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<any>({});
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<any>({});
    const [productType, setProductType] = useState<any[]>([]);
    const [searchParam, setSearchParam] = useState({
        pageSize: 10,
    });
    useEffect(() => {
        handleSearch(searchParam);
        service.productTypes().subscribe((data) => {
            const temp = data.map((item: any) => ({ value: item.id, label: item.name, ...item }))
            setProductType(temp);
        })
    }, [])
    const handleSearch = (params?: any) => {
        setSearchParam(params);
        setLoading(true);
        service.query(encodeQueryParam(params)).subscribe(
            (data) => setResult(data),
            () => { },
            () => setLoading(false))
    };
    const getApplianceTypeName = (id: string) => {
        let index =  productType.findIndex(item => {
            return item.id === id
        })
        if(index !== -1){
            return productType[index].name
        }else{
            return '/'
        }
    }
    const columns: ColumnProps<any>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '设备类型',
            dataIndex: 'applianceType',
            render: text => text ? getApplianceTypeName(text) : '/'
        },
        {
            title: '厂商名称',
            dataIndex: 'manufacturerName',
        },
        {
            title: '动作数量',
            dataIndex: 'actionMappings',
            render: (text: any[]) => text?.length
        },
        {
            title: '操作',
            width: '120px',
            align: 'center',
            render: (record: any) => (
                <Fragment>
                    <a onClick={() => {
                        setCurrent(record);
                        setSaveVisible(true);
                    }}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认删除吗？"
                        onConfirm={() => {
                            service.remove(record.id).subscribe(() => {
                                message.success('删除成功');
                                handleSearch(encodeQueryParam(searchParam));
                            })
                        }}>
                        <a >删除</a>
                    </Popconfirm>

                </Fragment>
            )
        },
    ];
    return (
        <PageHeaderWrapper title="DuerOS">
            <Card bordered={false} style={{ marginBottom: 16 }}>
                <div className={styles.tableList}>
                    <div>
                        <SearchForm
                            search={(params: any) => {
                                setSearchParam(params);
                                handleSearch({ terms: { ...params }, pageSize: 10 });
                            }}
                            formItems={[
                                {
                                    label: '名称',
                                    key: 'name$LIKE',
                                    type: 'string',
                                },
                                {
                                    label: '设备类型',
                                    key: 'applianceType$IN',
                                    type: 'list',
                                    props: {
                                        data: productType,
                                        mode: 'multiple'
                                    }
                                }
                            ]}
                        />
                    </div>
                    <div>
                        <Button icon="plus" type="primary" onClick={() => {
                            setSaveVisible(true);
                            setCurrent({});
                        }}>
                            新建
                        </Button>
                    </div>

                </div>
            </Card>
            <Card>
                <div className={styles.StandardTable}>
                    <ProTable
                        loading={loading}
                        dataSource={result?.data}
                        columns={columns}
                        rowKey="id"
                        onSearch={(params: any) => {
                            handleSearch(params);
                        }}
                        paginationConfig={result}
                    />
                </div>
            </Card>

            {
                saveVisible && (
                    <Save
                        data={current}
                        close={() => setSaveVisible(false)}
                        save={(item: any) => {
                            if(current.id){
                                service.update(item).subscribe(data=>{
                                    message.success('保存成功');
                                },
                                () => { },
                                () => {
                                    handleSearch(searchParam);
                                    setSaveVisible(false);
                                })
                            }else{
                                service.save(item).subscribe(data => {
                                    message.success('保存成功');
                                },
                                    () => { },
                                    () => {
                                        handleSearch(searchParam);
                                        setSaveVisible(false);
                                    });
                            }
                        }}
                    />
                )
            }
        </PageHeaderWrapper>
    )
}
export default DuerOS;

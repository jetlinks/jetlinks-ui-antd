import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React, { useEffect, useState } from "react";
import styles from '@/utils/table.less';
import { Avatar, Badge, Button, Card, Icon, List, Tooltip } from "antd";
import apis from '@/services';
import SearchForm from "@/components/SearchForm";
import encodeQueryParam from "@/utils/encodeParam";
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import img from "@/pages/edge-gateway/device/img/edge-device.png";
import moment from "moment";
import Save from './save';
import { router } from "umi";
import { getPageQuery } from "@/utils/utils";

interface Props {

}
const edgeDevice: React.FC<Props> = () => {
    const [result, setResult] = useState({
        data: [],
        pageIndex: 0,
        total: 0,
        pageSize: 0
    });
    const [loading, setLoading] = useState(false);
    const [searchParam, setSearchParam] = useState({
        pageSize: 8, terms: {
            'productId$edge-product': 1
        },
        sorts: {
            order: "desc",
            field: "id"
        }
    });
    const [saveVisible, setSaveVisible] = useState(false);
    const [info, setInfo] = useState({});
    const statusColor = new Map();
    statusColor.set('online', 'green');
    statusColor.set('offline', 'red');
    statusColor.set('notActive', 'blue');

    const handleSearch = (param?: any) => {
        setLoading(true);
        setSearchParam(param);
        apis.edgeDevice.list(encodeQueryParam(param)).then(res => {
            if (res.status === 200) {
                setResult(res.result);
                setLoading(false);
            }
        })
    }

    // const changeDeploy = (record: any) => {
    //     apis.deviceInstance
    //         .changeDeploy(record.id)
    //         .then(response => {
    //             if (response.status === 200) {
    //                 message.success('操作成功');
    //                 deviceIdList.splice(0, deviceIdList.length);
    //                 handleSearch(searchParam);
    //             }
    //         })
    //         .catch(() => {
    //         });
    // };

    // const unDeploy = (record: any) => {
    //     apis.deviceInstance
    //         .unDeploy(record.id)
    //         .then(response => {
    //             if (response.status === 200) {
    //                 message.success('操作成功');
    //                 deviceIdList.splice(0, deviceIdList.length);
    //                 handleSearch(searchParam);
    //             }
    //         })
    //         .catch(() => {
    //         });
    // };

    const onChange = (page: number, pageSize: number) => {
        handleSearch({
            pageIndex: page - 1,
            pageSize,
            terms: searchParam.terms
        });
    };
    useEffect(() => {
        const query: any = getPageQuery();
        if (query.hasOwnProperty('productId')) {
            handleSearch({
                terms: {
                    productId: query.productId,
                },
                pageSize: 10,
            });
        } else {
            handleSearch(searchParam);
        }
    }, []);

    return (
        <PageHeaderWrapper title="设备管理">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div>
                        <SearchForm
                            formItems={[
                                {
                                    label: 'ID',
                                    key: 'id',
                                    type: 'string'
                                },
                                {
                                    label: '名称',
                                    key: 'name$LIKE',
                                    type: 'string',
                                }
                            ]}
                            search={(params: any) => {
                                setSearchParam(params);
                                handleSearch({
                                    terms: { ...params, 'productId$edge-product': 1 },
                                    sorts: {
                                        order: "desc",
                                        field: "id"
                                    },
                                    pageSize: 8
                                });
                            }}
                        />
                    </div>
                    <div className={styles.tableListOperator}>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {
                                setSaveVisible(true);
                                setInfo({});
                            }}>
                            新增
                        </Button>
                    </div>
                </div>
            </Card>
            <br />
            <div>
                {result.data && (
                    <List<any>
                        rowKey="id"
                        loading={loading}
                        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                        dataSource={(result || {}).data}
                        pagination={{
                            current: result?.pageIndex + 1,
                            total: result?.total,
                            pageSize: result?.pageSize,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            hideOnSinglePage: true,
                            pageSizeOptions: ['8', '16', '40', '80'],
                            style: { marginTop: -20 },
                            showTotal: (total: number) =>
                                `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                                    result.total / result.pageSize,
                                )}页`,
                            onChange
                        }}
                        renderItem={item => {
                            if (item && item.id) {
                                return (
                                    <List.Item key={item.id}>
                                        <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                                            actions={[
                                                <Tooltip key="seeProduct" title="查看">
                                                    <Icon
                                                        type="eye"
                                                        onClick={() => {
                                                            router.push(`/edge-gateway/device/detail/${item.id}`);
                                                        }}
                                                    />
                                                </Tooltip>,
                                                <Tooltip key="update" title='编辑'>
                                                    <Icon
                                                        type="edit"
                                                        onClick={() => {
                                                            setSaveVisible(true);
                                                            setInfo(item);
                                                        }}
                                                    />
                                                </Tooltip>
                                            ]}
                                        >
                                            <Card.Meta
                                                avatar={<Avatar size={40} src={img} />}
                                                title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                                                description={<AutoHide title={moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')} style={{ width: '95%' }} />}
                                            />
                                            <div>
                                                <div style={{ width: '100%', display: 'flex', marginTop: '10px', justifyContent: 'space-' }}>
                                                    <div style={{ textAlign: 'center', width: '30%' }}>
                                                        <p>ID</p>
                                                        <AutoHide title={item.id} style={{ fontSize: 14, width: '95%' }} />
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '30%' }}>
                                                        <p>产品名称</p>
                                                        <p style={{ fontSize: 14 }}>{item.productName}</p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '30%' }}>
                                                        <p>状态</p>
                                                        <p style={{ fontSize: 14, fontWeight: 600 }}>
                                                            <Badge color={statusColor.get(item.state?.value)}
                                                                text={item.state?.text} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </List.Item>
                                );
                            }
                            return '';
                        }}
                    />
                )}
            </div>
            {
                saveVisible && <Save
                    close={() => {
                        setSaveVisible(false);
                    }}
                    save={() => {
                        handleSearch(searchParam);
                        setSaveVisible(false);
                    }}
                    data={info}
                />
            }
        </PageHeaderWrapper>
    )
}
export default edgeDevice;
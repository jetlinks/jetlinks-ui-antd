import SearchForm from "@/components/SearchForm";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Avatar, Button, Card, Icon, List, message, Popconfirm, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from '@/utils/table.less';
import cardStyles from "@/pages/device/product/index.less";
import apis from '@/services';
import encodeQueryParam from "@/utils/encodeParam";
import Save from './save';
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import img from "@/pages/edge-gateway/device/img/edge-device.png";
import { router } from "umi";

interface Props {
    loading: boolean;
}

const edgeProduct: React.FC<Props> = props => {
    const [result, setResult] = useState({
        data: [],
        pageIndex: 0,
        total: 0,
        pageSize: 0
    });
    const [searchParam, setSearchParam] = useState({ pageSize: 8, terms: {} });
    const [saveVisible, setSaveVisible] = useState(false);
    const [info, setInfo] = useState({});

    const cardInfoTitle = {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.85)'
      };

    const handleSearch = (params?: any) => {
        setSearchParam(params);
        apis.edgeProduct.list(encodeQueryParam(params)).then(res => {
            if(res.status === 200){
                setResult(res.result)
            }
        })
    };

    const onChange = (page: number, pageSize: number) => {
        handleSearch({
          pageIndex: page - 1,
          pageSize,
          terms: searchParam.terms
        });
      };

    useEffect(() => {
        handleSearch(searchParam);
    }, []);

    return (
        <PageHeaderWrapper title="产品管理">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div>
                        <SearchForm
                            formItems={[
                                {
                                    label: 'ID',
                                    key: 'id$LIKE',
                                    type: 'string',
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
                                    terms: params, 
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
            <div className={cardStyles.filterCardList}>
                {result.data && (
                    <List<any>
                        rowKey="id"
                        loading={props.loading}
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
                                                            router.push(`/device/product/save/${item.id}`);
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
                                                </Tooltip>,
                                                <Tooltip key="del" title='删除'>
                                                <Popconfirm
                                                    title="删除此产品？"
                                                    onConfirm={() => {
                                                        apis.edgeProduct.remove(item.id).then(res => {
                                                            if(res.status === 200){
                                                                handleSearch(searchParam);
                                                                message.success('删除成功！');
                                                            }
                                                        })
                                                    }}>
                                                    <Icon type="close" />
                                                </Popconfirm>
                                            </Tooltip>
                                            ]}
                                        >
                                            <Card.Meta
                                                avatar={<Avatar size={40} src={img} />}
                                                title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                                                description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                                            />
                                            <div className={cardStyles.cardItemContent}>
                                                <div className={cardStyles.cardInfo}>
                                                    <div style={{ textAlign: 'center', width: '30%' }}>
                                                        <p style={cardInfoTitle}>厂家</p>
                                                        <p style={{ fontSize: 14,fontWeight: 600 }}>
                                                            <AutoHide title={item.manufacturer} style={{ width: '95%' }} />
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '30%' }}>
                                                        <p style={cardInfoTitle}>型号</p>
                                                        <p style={{ fontSize: 14, fontWeight: 600 }}>
                                                            <AutoHide title={item.model} style={{ width: '95%' }} />
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '30%' }}>
                                                        <p style={cardInfoTitle}>版本</p>
                                                        <p style={{ fontSize: 14, fontWeight: 600 }}>
                                                            <AutoHide title={item.version} style={{ width: '95%' }} />
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

export default edgeProduct;
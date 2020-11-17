import SearchForm from "@/components/SearchForm";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Avatar, Badge, Button, Card, Dropdown, Icon, List, Menu, message, Popconfirm, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from '@/utils/table.less';
import cardStyles from "@/pages/device/product/index.less";
import DeviceAlarm from "@/pages/rule-engine/instance/img/DeviceAlarm.png";
import NodeRed from "@/pages/rule-engine/instance/img/NodeRed.png";
import SqlServer from "@/pages/rule-engine/instance/img/SqlServer.png";
import AutoHide from "@/pages/device/location/info/autoHide";
import Service from "./service";
import Save from "./save";
import { createFormActions } from "@formily/antd";
interface Props { }
const actions = createFormActions();
const Scene: React.FC<Props> = props => {
    const service = new Service('rule-engine/scene');
    const [result, setResult] = useState<any>({});
    useEffect(() => {
        service.query({}).subscribe(data => {
            setResult(data);
            console.log(data, 'rrr');
        })
    }, []);
    const [searchParam, setSearchParam] = useState<any>({
        pageSize: 8,
        sorts: {
            order: "descend",
            field: "createTime"
        }
    });
    const [saveVisible, setSaveVisible] = useState(false);
    const cardInfoTitle = {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.85)'
    };
    const handleSearch = (params?: any) => {
        setSearchParam(params);
        // dispatch({
        //     type: 'ruleInstance/query',
        //     payload: encodeQueryParam(params),
        // });
    };

    const onChange = (page: any, pageSize: number | undefined) => {
        handleSearch({
            pageIndex: page - 1,
            pageSize,
            terms: searchParam.terms,
            sorts: searchParam.sorts,
        });
    };
    return (
        <PageHeaderWrapper title="场景联动">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div>
                        <SearchForm
                            formItems={[
                                {
                                    label: '名称',
                                    key: 'name$LIKE',
                                    type: 'string',
                                },
                                {
                                    label: '状态',
                                    key: 'state$IN',
                                    type: 'list',
                                    props: {
                                        data: [
                                            { id: 'stopped', name: '已停止' },
                                            { id: 'started', name: '运行中' },
                                            { id: 'disable', name: '已禁用' },
                                        ]
                                    }
                                },
                            ]}
                            search={(params: any) => {
                                setSearchParam(params);
                                handleSearch({
                                    terms: params, pageSize: 8, sorts: searchParam.sorts || {
                                        order: "descend",
                                        field: "createTime"
                                    }
                                });
                            }}
                        />
                    </div>
                    <div className={styles.tableListOperator}>

                        <Dropdown overlay={<Menu onClick={() => { message.success('11') }}>
                            <Menu.Item key="1">
                                <Icon type="deployment-unit" />
                            场景联动
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="apartment" />
                            规则流程
                            </Menu.Item>

                        </Menu>}>
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => {
                                    setSaveVisible(true)
                                }}>
                                新建 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </Card>
            <br />
            <div className={cardStyles.filterCardList}>

                {result?.data && (
                    <List<any>
                        rowKey="id"
                        loading={false}
                        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                        dataSource={result.data}
                        pagination={{
                            current: result.pageIndex + 1,
                            total: result.total,
                            pageSize: 8,
                            showQuickJumper: true,
                            hideOnSinglePage: true,
                            style: { marginTop: -20 },
                            showTotal: (total: number) =>
                                `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                                    result.total / result.pageSize,
                                )}页`,
                            onChange,
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
                                                            // setDetailVisible(true);
                                                            // setDetailData(item);
                                                            // message.warn('该功能规划中，敬请期待');
                                                        }}
                                                    />
                                                </Tooltip>,
                                                <Tooltip key="update" title='编辑'>
                                                    <Icon
                                                        type="edit"
                                                        onClick={() => {

                                                        }}
                                                    />
                                                </Tooltip>,
                                                <Tooltip key="more_actions" title=''>
                                                    <Dropdown overlay={
                                                        <Menu>
                                                            <Menu.Item key="1">
                                                                <Popconfirm
                                                                    placement="topRight"
                                                                    title={item.state?.value === 'stopped' ? '确认启动？' : '确认停止？'}
                                                                    onConfirm={() => {
                                                                        // if (item.state?.value === 'stopped') {
                                                                        //     startInstance(item);
                                                                        // } else {
                                                                        //     stopInstance(item);
                                                                        // }
                                                                    }}
                                                                >
                                                                    <Button icon={item.state?.value === 'stopped' ? 'check' : 'close'} type="link">
                                                                        {item.state?.value === 'stopped' ? '启动' : '停止'}
                                                                    </Button>
                                                                </Popconfirm>
                                                            </Menu.Item>
                                                            {item.modelType === 'node-red' && (
                                                                <Menu.Item key="3">
                                                                    <Button icon="copy" type="link"
                                                                        onClick={() => {
                                                                            // setRuleData(item);
                                                                            // setSaveVisible(true);
                                                                        }}>
                                                                        复制
                                                                    </Button>
                                                                </Menu.Item>
                                                            )}
                                                            {item.state?.value === 'stopped' && (
                                                                <Menu.Item key="2">
                                                                    <Popconfirm
                                                                        placement="topRight"
                                                                        title="确定删除此组件吗？"
                                                                        onConfirm={() => {
                                                                            // handleDelete(item);
                                                                        }}
                                                                    >
                                                                        <Button icon="delete" type="link">
                                                                            删除
                                                                        </Button>
                                                                    </Popconfirm>
                                                                </Menu.Item>
                                                            )}
                                                        </Menu>
                                                    }>
                                                        <Icon type="ellipsis" />
                                                    </Dropdown>
                                                </Tooltip>,
                                            ]}
                                        >
                                            <Card.Meta
                                                avatar={item.modelType === 'device_alarm' ?
                                                    <Avatar size={40} src={DeviceAlarm} /> : (item.modelType === 'sql_rule' ?
                                                        <Avatar size={40} src={SqlServer} /> :
                                                        <Avatar size={40} src={NodeRed} />)}
                                                title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                                                description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                                            />
                                            <div className={cardStyles.cardItemContent}>
                                                <div className={cardStyles.cardInfo}>
                                                    <div style={{ textAlign: 'center', width: '33%' }}>
                                                        <p style={cardInfoTitle}>模型版本</p>
                                                        <p style={{ fontSize: 14, fontWeight: 600 }}>{item.modelVersion}</p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '33%' }}>
                                                        <p style={cardInfoTitle}>启动状态</p>
                                                        <p style={{ fontSize: 14, fontWeight: 600 }}>
                                                            <Badge color={item.state?.value === 'stopped' ? 'red' : 'green'}
                                                                text={item.state?.value === 'stopped' ? '已停止' : '已启动'} />
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'center', width: '33%' }}>
                                                        <p style={cardInfoTitle}>模型类型</p>
                                                        <p style={{ fontSize: 14 }}>
                                                            {/* {modelType.get(item.modelType)} */}
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

            <Save
                save={() => { }}
            />
        </PageHeaderWrapper>
    )
}
export default Scene;
import { PageHeaderWrapper } from "@ant-design/pro-layout"
import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Input, List, Tooltip, Icon, Avatar, Menu, Tag, Button, message, Popconfirm, Switch } from "antd";
import StandardFormRow from "./components/standard-form-row";
import TagSelect from "./components/tag-select";
import { FormComponentProps } from "antd/lib/form";
import styles from './index.less';
import { ConnectState, Dispatch, Loading } from "@/models/connect";
import { connect } from "dva";
import Save from "./save";
import { downloadObject } from "@/utils/utils";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";

interface Props extends FormComponentProps {
    dispatch: Dispatch;
    networkType: any;
    loading: Loading
}
interface State {
    saveVisible: boolean;
    currentItem: any;
    supportsType: any[];
    filterType: string[];
    filterName: string;
}

const Type: React.FC<Props> = (props) => {
    const initState: State = {
        saveVisible: false,
        currentItem: {},
        supportsType: [],
        filterType: [],
        filterName: ''
    }

    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
    const [currentItem, setCurrentItem] = useState(initState.currentItem);
    const [supportsType, setSupportsType] = useState(initState.supportsType);
    const [filterType, setFilterType] = useState(initState.filterType);
    const [filterName, setFilterName] = useState(initState.filterName);

    const formItemLayout = {
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const { dispatch, networkType: { result } } = props;

    useEffect(() => {
        handleSearch();
        apis.network.support().then(response => {
            setSupportsType(response.result);
        });
    }, []);

    const handleSearch = () => {
        dispatch({
            type: 'networkType/query',
            payload: encodeQueryParam({
                paging: false,
                sorts: {
                    field: 'id',
                    order: 'desc'
                },
                terms: {
                    type$IN: filterType,
                    name$LIKE: filterName,
                }
            }),
        })
    }

    const remove = (id: string) => {
        dispatch({
            type: 'networkType/remove',
            payload: id,
            callback: (response: any) => {
                message.success('删除成功');
                handleSearch();
            }
        })
    }

    const insert = (data: any) => {
        dispatch({
            type: 'networkType/insert',
            payload: data,
            callback: (response: any) => {
                message.success('保存成功');
                setSaveVisible(false);
                handleSearch();
            }
        })
    }

    const changeStatus = (item: any) => {
        let type = item.state.value === 'disabled' ? '_start' : item.state.value === 'enabled' ? '_shutdown' : undefined;
        if (!type) return;
        apis.network.changeStatus(item.id, type).then(response => {
            message.success('操作成功');
            handleSearch();
        });
    }

    const onSearch = (type?: string[], name?: string) => {
        let tempType = type ? type : filterType;
        let tempName = name ? name : filterName;
        dispatch({
            type: 'networkType/query',
            payload: encodeQueryParam({
                paging: false,
                sorts: {
                    field: 'id',
                    order: 'desc'
                },
                terms: {
                    type$IN: tempType,
                    name$LIKE: tempName,
                }
            }),
        })
    }

    return (
        <PageHeaderWrapper
            title="组件管理"
        >

            <div className={styles.filterCardList}>

                <Card bordered={false}>
                    <Form layout="inline">
                        <StandardFormRow title="组件类型" block style={{ paddingBottom: 11 }}>
                            <Form.Item>
                                <TagSelect expandable onChange={(value: any[]) => { setFilterType(value); onSearch(value, undefined) }}>
                                    {
                                        supportsType.map(item =>
                                            <TagSelect.Option key={item.id} value={item.id}>{item.name}</TagSelect.Option>)
                                    }
                                </TagSelect>
                            </Form.Item>
                        </StandardFormRow>
                        <StandardFormRow title="其它选项" grid last>
                            <Row gutter={16}>
                                <Col lg={8} md={10} sm={10} xs={24}>
                                    <Form.Item {...formItemLayout} label="配置名称">
                                        <Input onChange={(e) => { setFilterName(e.target.value); onSearch(undefined, e.target.value) }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </StandardFormRow>
                    </Form>
                </Card>
                <br />
                <List<any>
                    rowKey="id"
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    loading={props.loading.global}
                    dataSource={[{}, ...result]}
                    renderItem={item => {
                        if (item && item.id) {
                            return (
                                <List.Item key={item.id}>
                                    <Card
                                        hoverable
                                        bodyStyle={{ paddingBottom: 20 }}
                                        actions={[
                                            <Tooltip key="download" title="下载">
                                                <Icon
                                                    type="download"
                                                    onClick={() => { downloadObject(item, '设备型号') }} />
                                            </Tooltip>,
                                            <Tooltip key="edit" title="编辑">
                                                <Icon
                                                    type="edit"
                                                    onClick={() => {
                                                        setSaveVisible(true)
                                                        setCurrentItem(item)
                                                    }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="bug" title="调试" >
                                                <Icon type="bug"
                                                    onClick={() => { message.success('开发中...') }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="delete" title="删除">
                                                <Popconfirm
                                                    placement="topRight"
                                                    title="确定删除此组件吗？"
                                                    onConfirm={() => { remove(item.id) }}>
                                                    <Icon type="close" />
                                                </Popconfirm>
                                            </Tooltip>,


                                            // <Dropdown key="ellipsis" overlay={itemMenu}>
                                            //     <Icon type="ellipsis" />
                                            // </Dropdown>,
                                        ]}
                                    >
                                        <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.name} />
                                        <div
                                            className={styles.cardItemContent}
                                        >
                                            <div
                                                className={styles.cardInfo}
                                            >
                                                <div>
                                                    <p>组件类型</p>
                                                    <p>{item.type.name}</p>
                                                </div>
                                                <div>
                                                    <p>启动状态</p>
                                                    <p style={{ color: 'red' }}>
                                                        <Popconfirm
                                                            title={`确认${item.state.value === 'disabled' ? '启动' : '停止'}`}
                                                            onConfirm={() => { changeStatus(item) }}
                                                        >
                                                            <span>
                                                                <Switch size="small" checked={item.state.value === 'disabled' ? false : item.state.value === 'enabled' ? true : false} />
                                                            </span>
                                                        </Popconfirm>
                                                    </p>
                                                </div>
                                            </div >
                                        </div>
                                    </Card>
                                </List.Item>
                            )
                        }
                        return (
                            <List.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => { setSaveVisible(true) }}
                                    className={styles.newButton}>
                                    <Icon type="plus" />新增组件
                                </Button>
                            </List.Item>
                        )
                    }}
                />
            </div>
            {
                saveVisible &&
                <Save
                    close={() => { setSaveVisible(false); setCurrentItem({}) }}
                    data={currentItem}
                    save={(item: any) => { insert(item) }}
                />
            }
        </PageHeaderWrapper>
    )
}

export default connect(({ networkType, loading }: ConnectState) => ({
    networkType, loading
}))(Form.create<Props>()(Type))
import React, { useState, useEffect } from "react";
import { DeviceProduct } from "../data";
import { Tabs, Modal, Descriptions, Card, Button, message } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import Definition from "./definition";
import { connect } from "dva";
import { ConnectState, Dispatch } from "@/models/connect";
import { SimpleResponse } from "@/utils/common";
import apis from "@/services";
import Save from "./";

interface Props {
    dispatch: Dispatch;
    location: Location;
    close: Function;
    save: Function;
}

interface State {
    basicInfo: Partial<DeviceProduct>;
    saveVisible: boolean;
}
const Detail: React.FC<Props> = (props) => {

    const initState: State = {
        basicInfo: {},
        saveVisible: false
    }
    // const { dispatch, location: { pathname } } = props;
    const { dispatch, location: { pathname } } = props;
    const [events, setEvents] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [properties, setProperties] = useState([]);
    const [basicInfo, setBasicInfo] = useState(initState.basicInfo);
    const [saveVisible, setSaveVisible] = useState(initState.saveVisible);

    useEffect(() => {
        if (pathname.indexOf('save') > 0) {
            const list = pathname.split('/');
            dispatch({
                type: 'deviceProduct/queryById',
                payload: list[list.length - 1],
                callback: (response: SimpleResponse) => {
                    const data = response.result;
                    setBasicInfo(data);
                    const metadata = JSON.parse(data.metadata);
                    setEvents(metadata.events);
                    setFunctions(metadata.functions);
                    setProperties(metadata.properties);
                }
            });
        }
    }, [basicInfo.id]);

    const saveData = (item?: any) => {
        let data: Partial<DeviceProduct>;
        const metadata = JSON.stringify({ events, properties, functions });

        //TODO 这个地方有疑惑，set数据之后此处数据还是未更新。原因待查
        if (item) {
            data = { ...item, metadata };
        } else {
            data = { ...basicInfo, metadata };
        }
        apis.deviceProdcut.saveOrUpdate(data).then(reponse => {
            if (reponse.status === 200) {
                message.success('保存成功');
            }
        }).catch(() => {

        });
    }

    return (
        <PageHeaderWrapper
            title={basicInfo.name}
        >
            <Card>
                <Tabs>
                    <Tabs.TabPane tab="产品信息" key="info">
                        <Descriptions
                            style={{ marginBottom: 20 }}
                            bordered
                            column={2}
                            title={
                                <span>
                                    产品信息
                                    <Button
                                        icon="edit"
                                        style={{ marginLeft: 20 }}
                                        type="link"
                                        onClick={() => setSaveVisible(true)}
                                    >
                                        编辑
                                    </Button>
                                </span>
                            }>
                            <Descriptions.Item label="产品ID" span={1}>{basicInfo.id}</Descriptions.Item>
                            <Descriptions.Item label="产品名称" span={1}>{basicInfo.name}</Descriptions.Item>
                            <Descriptions.Item label="所属机构" span={1}>{basicInfo.orgId}</Descriptions.Item>
                            <Descriptions.Item label="消息协议" span={1}>{basicInfo.messageProtocol}</Descriptions.Item>
                            <Descriptions.Item label="链接协议" span={1}>{basicInfo.transportProtocol}</Descriptions.Item>
                            <Descriptions.Item label="设备类型" span={1}>{(basicInfo.deviceType || {}).text}</Descriptions.Item>
                            <Descriptions.Item label="说明" span={2}>{basicInfo.describe}</Descriptions.Item>
                        </Descriptions>
                        {/* <Descriptions
                            style={{ marginBottom: 20 }}
                            bordered
                            column={2}
                            title={
                                <span>标签信息
                                    <Button
                                        icon="edit"
                                        style={{ marginLeft: 20 }}
                                        type="link">
                                        编辑
                                    </Button>
                                </span>
                            }
                        >
                            <Descriptions.Item label="产品标签" span={1}>无标签信息</Descriptions.Item>
                        </Descriptions> */}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="功能定义" key="metadata">
                        <Definition
                            eventsData={events}
                            functionsData={functions}
                            propertyData={properties}
                            saveEvents={(data: any) => { setEvents(data); saveData() }}
                            saveFunctions={(data: any) => { setFunctions(data); saveData() }}
                            saveProperty={(data: any) => { setProperties(data); saveData() }}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Card>

            {
                saveVisible &&
                <Save
                    data={basicInfo}
                    close={() => setSaveVisible(false)}
                    save={(item: any) => { setBasicInfo(item); saveData(item) }}
                />
            }
        </PageHeaderWrapper>
    )
}
export default connect(({ deviceProduct, loading }: ConnectState) => ({
    deviceProduct,
    loading,
}))(Detail);

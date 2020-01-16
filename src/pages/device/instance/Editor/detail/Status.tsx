import React, { useEffect, useState, Fragment } from "react";
import ChartCard from "@/pages/analysis/components/Charts/ChartCard";
import { Tooltip, Icon, Row, Col, Tag } from "antd";
import { FormattedMessage } from "umi-plugin-locale";
import { MiniArea, MiniProgress } from "@/pages/analysis/components/Charts";
import { IVisitData } from "@/pages/analysis/data";
import moment from "moment";
import apis from "@/services";
import EventLog from "./event-log/EventLog";

interface Props {
    device: any
}

interface State {
    runInfo: any;
    propertiesData: any[];
    eventVisible: boolean;
}
const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24 },
};

// mock data
const visitData: IVisitData[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: fakeY[i],
    });
}

const Status: React.FC<Props> = (props) => {

    const initState: State = {
        runInfo: {},
        propertiesData: [],
        eventVisible: false
    }
    const [runInfo, setRunInfo] = useState(initState.runInfo);
    const [propertiesData, setPropertiesData] = useState(initState.propertiesData);
    const [eventVisible, setEventVisible] = useState(initState.eventVisible);

    useEffect(() => {
        apis.deviceInstance.runInfo(props.device.id).then(response => {
            setRunInfo(response.result);
        });
        apis.deviceInstance.properties(props.device.productId, props.device.id).then(response => {
            setPropertiesData(response.result);
        })
    }, []);


    const renderMiniChart = (item: any) => {
        const type = item.dataType;
        console.log(propertiesData, item, '数据');
        switch (type) {
            case 'double':
            case 'int':
                let data = propertiesData.find(i => i.property === item.id)?.numberValue;
                return (
                    <MiniProgress percent={data} strokeWidth={8} target={item.valueType.max || 100} color="#1A90FA" />
                );
            case 'object':
                return (
                    <div>
                        <Tag color="red"><Icon type="close-circle" />紧急</Tag>
                        <div style={{ float: "right" }}>
                            <a onClick={() => setEventVisible(true)}>查看详情</a>
                        </div>
                    </div>
                )
            default:
                return <MiniArea color="#975FE4" data={visitData} />

        }
    }

    return (
        <div>
            {
                runInfo && runInfo.metadata ? <Row gutter={24}>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title='设备状态'
                            action={
                                <Tooltip
                                    title='刷新'
                                >
                                    <Icon type="sync" />
                                </Tooltip>
                            }
                            contentHeight={46}
                            total={runInfo?.state?.text}
                        >
                            <span>上线时间：{moment(runInfo?.onlineTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </ChartCard>
                    </Col>

                    {
                        (JSON.parse(runInfo.metadata).properties || []).map((item: any) =>
                            <Col {...topColResponsiveProps} key={item.id}>
                                <ChartCard
                                    bordered={false}
                                    title={item.name}
                                    action={
                                        <Tooltip
                                            title='刷新'
                                        >
                                            <Icon type="sync" />
                                        </Tooltip>
                                    }
                                    total={propertiesData.find(i => i.property === item.id)?.numberValue}
                                    contentHeight={46}
                                >
                                    {renderMiniChart(item)}
                                </ChartCard>
                            </Col>
                        )
                    }

                    {
                        (JSON.parse(runInfo.metadata).events || []).map((item: any) =>
                            <Col {...topColResponsiveProps} key={item.id}>
                                <ChartCard
                                    bordered={false}
                                    title={item.name}
                                    action={
                                        <Tooltip
                                            title='刷新'
                                        >
                                            <Icon type="sync" />
                                        </Tooltip>
                                    }

                                    total="78%"
                                    contentHeight={46}
                                >
                                    {renderMiniChart(item)}
                                </ChartCard>
                                {
                                    eventVisible &&
                                    <EventLog
                                        data={{}}
                                        close={() => { setEventVisible(false) }}
                                    />
                                }
                            </Col>
                        )
                    }

                </Row>
                    :
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            bordered={false}
                            title='设备状态'
                            action={
                                <Tooltip
                                    title='刷新'
                                >
                                    <Icon type="sync" />
                                </Tooltip>
                            }
                            contentHeight={46}
                            total={'设备未激活'}
                        >
                            <span></span>
                        </ChartCard>
                    </Col>
            }
        </div>
    );
}

export default Status;

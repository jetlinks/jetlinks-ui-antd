import React from "react";
import ChartCard from "@/pages/analysis/components/Charts/ChartCard";
import { Tooltip, Icon, Row, Col } from "antd";
import { FormattedMessage } from "umi-plugin-locale";
import { MiniArea, MiniProgress } from "@/pages/analysis/components/Charts";
import { IVisitData } from "@/pages/analysis/data";
import moment from "moment";

interface Props {

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
    return (
        <div>
            <Row gutter={24}>
                <Col {...topColResponsiveProps}>
                    <ChartCard
                        bordered={false}
                        title='设备状态'
                        action={
                            <Tooltip
                                title={
                                    <FormattedMessage id="analysis.analysis.introduce" defaultMessage="Introduce" />
                                }
                            >
                                <Icon type="info-circle-o" />
                            </Tooltip>
                        }
                        contentHeight={46}
                        total='运行中'
                    >
                        <span>上线时间：2019/08/01 12:00:02</span>
                    </ChartCard>
                </Col>
                <Col {...topColResponsiveProps}>
                    <ChartCard
                        bordered={false}
                        title='当前温度'
                        action={
                            <Tooltip
                                title={
                                    <FormattedMessage id="analysis.analysis.introduce" defaultMessage="Introduce" />
                                }
                            >
                                <Icon type="info-circle-o" />
                            </Tooltip>
                        }
                        total={31}
                        contentHeight={46}
                    >
                        <MiniArea color="#975FE4" data={visitData} />
                    </ChartCard>
                </Col>

                <Col {...topColResponsiveProps}>
                    <ChartCard
                        bordered={false}
                        title='CPU使用率'
                        action={
                            <Tooltip
                                title={
                                    <FormattedMessage id="analysis.analysis.introduce" defaultMessage="Introduce" />
                                }
                            >
                                <Icon type="info-circle-o" />
                            </Tooltip>
                        }
                        total="78%"
                        contentHeight={46}
                    >
                        <MiniProgress percent={78} strokeWidth={8} target={80} color="#1A90FA" />
                    </ChartCard>
                </Col>
            </Row>

        </div>
    );
}

export default Status;

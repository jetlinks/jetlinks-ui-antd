import React, { Component } from "react";
import { Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

interface ScheduleProps {

}

interface ScheduleState {

}

class Schedule extends Component<ScheduleProps, ScheduleState>{

    render() {
        return (
            <PageHeaderWrapper title="定时任务">
                <Card bordered={false}>
                    定时任务
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Schedule;

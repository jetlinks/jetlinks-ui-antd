import React, { Component } from "react";
import { Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

interface DataSourceProps {

}

interface DataSourceState {

}

class DataSource extends Component<DataSourceProps, DataSourceState>{

    render() {
        return (
            <PageHeaderWrapper title="数据源管理">
                <Card bordered={false}>
                    数据源管理
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default DataSource;

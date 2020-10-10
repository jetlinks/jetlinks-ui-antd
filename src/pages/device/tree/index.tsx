import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Col, Divider, Icon, Row, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import Service from "./service";

interface Props { }
const DeviceTree: React.FC<Props> = (props) => {

    const [data, setData] = useState<any[]>([]);
    const service = new Service('device');

    useEffect(() => {
        service.groupTree({}).subscribe((resp) => {
            setData(resp);
        })
    }, []);
    return (
        <PageHeaderWrapper title="设备分组">
            <Card>
                <Row gutter={24}>
                    <Col span={8}>
                        <Table
                            key="id"
                            dataSource={data}
                            size="small"
                            columns={[
                                { title: '序号', dataIndex: 'id' },
                                { title: '名称', dataIndex: 'name' },
                                {
                                    title: '操作', render: (_, record) => (
                                        <Fragment>
                                            <Icon type="edit" />
                                            <Divider type="vertical" />
                                            <Icon type="plus" />
                                            <Divider type="vertical" />
                                            <Icon type="close" />
                                        </Fragment>
                                    )
                                }
                            ]} />
                    </Col>
                    <Col span={16}>
                        <Table
                            size="small"
                            columns={[
                                { title: '序号', dataIndex: 'id' },
                                { title: '名称', dataIndex: 'name' },
                                { title: '状态', dataIndex: 'status' },
                                { title: '操作', }
                            ]}
                        />
                    </Col>
                </Row>
            </Card>
        </PageHeaderWrapper>
    )
}
export default DeviceTree;
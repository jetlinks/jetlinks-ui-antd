import React from "react";
import { Card, Row, Col, Button, Switch, Divider, Cascader, Input } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import styles from '../index.less';


interface Props {

}
const Debugger: React.FC<Props> = (props) => {
    const logColumn: ColumnProps<any>[] = [
        {
            dataIndex: 'type',
            title: '类型',
        },
        {
            dataIndex: 'date',
            title: '时间',
        },
        {
            dataIndex: 'content',
            title: '内容',
        },
    ];

    const tabList = [
        {
            key: 'debugger',
            tab: '测试设备',
        },
        {
            key: 'mock',
            tab: '模拟设备',
        },
    ];
    const logData = [
        {
            id: '11',
            type: '接受设备消息',
            date: '2019/08/12 12:12:15',
            content: '{"messageId":12188976213,"properties":{"memory":"78MB"}}',
        },
        {
            id: '22',
            type: '发送到设备',
            date: '2019/08/12 12:12:14',
            content: '{"properties":["memory"]}',
        },
    ]

    const options = [
        {
            value: 'properties',
            label: '属性',
            children: [
                {
                    value: 'cpu',
                    label: 'CPU使用率',
                    children: [
                        {
                            value: 'read',
                            label: '读取',
                        },
                        {
                            value: 'edit',
                            label: '修改',
                        },
                    ],
                },
                {
                    value: 'rom',
                    label: '内存占用',
                    children: [
                        {
                            value: 'read',
                            label: '读取',
                        },
                        {
                            value: 'edit',
                            label: '修改',
                        },
                    ],
                },
                {
                    value: 'disk',
                    label: '磁盘空间',
                    children: [
                        {
                            value: 'read',
                            label: '读取',
                        },
                        {
                            value: 'edit',
                            label: '修改',
                        },
                    ],
                },
            ],
        },
        {
            value: 'function',
            label: '功能',
            children: [
                {
                    value: 'all',
                    label: '全部',
                },
            ],
        },
        {
            value: 'events',
            label: '事件',
            children: [],
        },
    ];

    return (
          <div>
                <Row gutter={24}>

                    <Col span={8}>
                        <Card
                            tabList={tabList}
                        >
                            <div>
                                 <Row gutter={24} className={styles.debuggerCascader}>
                                    <Cascader
                                        placeholder={'类型/属性/操作'}
                                        options={options}
                                    />
                                </Row>
                                <Row gutter={24} style={{marginTop: 15}}>
                                    <Input.TextArea
                                        rows={10}
                                        placeholder='{
                                                "type":"readProperty",
                                                "properties":["memory"]
                                                }' />
                                </Row>
                                    <Row style={{ marginTop: 15 }}>
                                    <Button style={{marginRight: 5}} type="primary">发送到设备</Button>
                                    <Button>重置</Button>
                                </Row>
                           </div>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card
                            title="调试日志"
                            extra={
                                <div>
                                    自动刷新
                                    <Switch />
                                    <Divider type="vertical" />
                                    <Button style={{ marginRight: 5 }}>刷新</Button>
                                    <Button type="primary" >清空</Button>
                                </div>
                            }
                        >
                            <Table
                                columns={logColumn}
                                dataSource={logData}
                                rowKey={record => record.id}
                            />
                        </Card>
                    </Col>
                </Row>
            </div >
    );
}

export default Debugger;

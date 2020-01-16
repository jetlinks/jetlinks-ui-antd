import React, { Fragment } from "react";
import { Table, Divider, Modal } from "antd";
import { ColumnProps } from "antd/lib/table";

interface Props {
    data: any;
    close: Function;
}
interface State {

}

const EventLog: React.FC<Props> = (props) => {

    const columns: ColumnProps<any>[] = [
        {
            title: '设备编号',
            dataIndex: 'devid',
        },
        {
            title: '建筑名称',
            dataIndex: 'b_name',
        },
        {
            title: '型号ID',
            dataIndex: 'productId',
        },
        {
            title: '设备型号名称',
            dataIndex: 'pname',
        },
        {
            title: '消息次数',
            dataIndex: 'event_count',
        },
        {
            title: '位置名称',
            dataIndex: 'l_name',
        },
        {
            title: '报警描述',
            dataIndex: 'alarm_describe',
        },
        {
            title: '设备ID',
            dataIndex: 'deviceId',
        },
        {
            title: '事件ID',
            dataIndex: 'event_id',
        },
        {
            title: '报警类型',
            dataIndex: 'alarm_type',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '区域ID',
            dataIndex: 'aid',
        },
        {
            title: '区域名称',
            dataIndex: 'a_name',
        },
        {
            title: '警报时间',
            dataIndex: 'timestamp',
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => { }}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => { }}>赋权</a>
                </Fragment>
            ),
        },
    ];

    return (
        <Modal
            title="事件详情"
            visible
            onCancel={() => props.close()}
        >
            <Table dataSource={[]} />
        </Modal>
    )
}

export default EventLog;
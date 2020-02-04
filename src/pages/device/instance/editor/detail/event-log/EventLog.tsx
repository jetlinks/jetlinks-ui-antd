import React, { Fragment, useState, useEffect } from "react";
import { Table, Divider, Modal } from "antd";
import { ColumnProps, PaginationConfig, SorterResult } from "antd/lib/table";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
    data: any;
    close: Function;
    item: any;
    type: string;
    deviceId: string;
}
interface State {
    eventColumns: ColumnProps<any>[];
    logData: any
}

const EventLog: React.FC<Props> = (props) => {

    const initState: State = {
        eventColumns: props.item.valueType.properties.map((item: any) => {
            return {
                title: item.name,
                dataIndex: item.id
            }
        }),
        logData: {}
    }

    const [logData, setLogData] = useState(initState.logData);


    useEffect(() => {
        apis.deviceInstance.eventData(
            props.type,
            props.item.id,
            encodeQueryParam({
                terms: { deviceId: props.deviceId },
                pageIndex: 0,
                pageSize: 10,
            })
        ).then(response => {
            setLogData(response.result)
        }).catch(() => {

        });
    }, []);

    const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>, extra: any) => {
        apis.deviceInstance.eventData(
            props.type,
            props.item.id,
            encodeQueryParam({
                terms: { deviceId: props.deviceId },
                pageIndex: Number(pagination.current) - 1,
                pageSize: pagination.pageSize,
            })
        ).then(response => {
            setLogData(response.result)
        }).catch(() => {

        });
    }


    return (
        <Modal
            title="事件详情"
            visible
            onCancel={() => props.close()}
            onOk={() => props.close()}
            width={1600}
        >
            <Table
                rowKey='createTime'
                dataSource={logData.data}
                size="small"
                onChange={onTableChange}
                pagination={{
                    current: logData.pageIndex + 1,
                    total: logData.total,
                    pageSize: logData.pageSize,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total: number) => {
                        return `共 ${total} 条记录 第  ` + (logData.pageIndex + 1) + '/' + Math.ceil(logData.total / logData.pageSize) + '页';
                    }
                }}
                columns={initState.eventColumns}
            />
        </Modal>
    )
}

export default EventLog;
import React from "react"
import { Modal, Form, Descriptions } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { SystemLoggerItem } from "../data";
import moment from "moment";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<SystemLoggerItem>;
}
const Save: React.FC<Props> = (props) => {

    return (
        <Modal
            visible
            title={'系统日志详情'}
            width={900}
            onOk={() => { props.close() }}
            onCancel={() => { props.close(); }}
        // footer={null}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="线程名称" span={1}>{props.data.threadName}</Descriptions.Item>
                <Descriptions.Item label="日志级别" span={1}>{props.data.level}</Descriptions.Item>
                <Descriptions.Item label="方法名" span={1}>{props.data.methodName}</Descriptions.Item>
                <Descriptions.Item label="行号" span={1}>{props.data.lineNumber}</Descriptions.Item>
                <Descriptions.Item label="线程ID" span={1}>{props.data.threadName}</Descriptions.Item>
                <Descriptions.Item label="创建时间" span={1}>{moment(props.data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                <Descriptions.Item label="名称" span={2}>{props.data.name}</Descriptions.Item>
                <Descriptions.Item label="类名" span={2}>{props.data.className}</Descriptions.Item>
                <Descriptions.Item label="消息" span={2}>
                    {JSON.stringify(props.data.message)}
                </Descriptions.Item>
                <Descriptions.Item label="上下文" span={2}>
                    {JSON.stringify(props.data.context)}
                </Descriptions.Item>
                <Descriptions.Item label="异常栈" span={2}>
                    {props.data.exceptionStack}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    )
}
export default Form.create<Props>()(Save);


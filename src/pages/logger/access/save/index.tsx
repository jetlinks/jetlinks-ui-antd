import React from "react"
import { Modal, Form, Descriptions } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { AccessLoggerItem } from "../data";
import moment from "moment";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<AccessLoggerItem>;
}
const Save: React.FC<Props> = (props) => {

    return (
        <Modal
            visible
            title={'访问日志详情'}
            width={900}
            onOk={() => { props.close() }}
            onCancel={() => { props.close(); }}
        // footer={null}
        >
            <Descriptions bordered column={2} >
                <Descriptions.Item label="URL" span={1}>{props.data.url}</Descriptions.Item>
                <Descriptions.Item label="请求方法" span={1}>{props.data.httpMethod}</Descriptions.Item>
                <Descriptions.Item label="动作" span={1}>{props.data.action}</Descriptions.Item>
                <Descriptions.Item label="类名" span={1}>{props.data.target}</Descriptions.Item>
                <Descriptions.Item label="方法名" span={1}>{props.data.method}</Descriptions.Item>
                <Descriptions.Item label="IP" span={1}>{props.data.ip}</Descriptions.Item>
                <Descriptions.Item label="请求时间" span={1}>{moment(props.data.requestTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                <Descriptions.Item label="请求耗时" span={1}>{(props.data.responseTime || 0) - (props.data.requestTime || 0)}ms</Descriptions.Item>
                <Descriptions.Item label="请求头" span={2}>
                    {JSON.stringify(props.data.httpHeaders)}
                </Descriptions.Item>
                <Descriptions.Item label="请求参数" span={2}>
                    {JSON.stringify(props.data.parameters)}
                </Descriptions.Item>
                <Descriptions.Item label="异常信息" span={2}>
                    <div
                        style={{
                            height: 200,
                            overflow: 'auto'
                        }}>
                        {props.data.exception}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    )
}
export default Form.create<Props>()(Save);


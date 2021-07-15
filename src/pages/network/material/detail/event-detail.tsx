import React from 'react';
import { Descriptions, Modal } from 'antd';

interface EditProps {
    visible?: boolean
    data?: any
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

const Detail = (props: EditProps) => {
    const { data, ...extra } = props;

    return <>
        <Modal
            width='900px'
            title={'事件定义详情'}
            {...extra}
            footer={[]}
        >
            <Descriptions bordered>
                <Descriptions.Item label="事件标识" span={1}>{data.id}</Descriptions.Item>
                <Descriptions.Item label="事件名称" span={1}>{data.name}</Descriptions.Item>
                <Descriptions.Item label="事件级别" span={1}>{data.expands?.level || ''}</Descriptions.Item>
                <Descriptions.Item label="输出参数" span={1}>{data.valueType?.type}</Descriptions.Item>
                <Descriptions.Item label="单位" span={2}>{data.valueType?.unit}</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>
                    {data.description || ''}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    </>
}

export default Detail;
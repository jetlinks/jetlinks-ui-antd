import React from 'react';
import { Descriptions, Modal } from 'antd';
import _ from 'lodash';

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
            title={'功能定义详情'}
            {...extra}
            footer={[]}
        >
            <Descriptions bordered>
                <Descriptions.Item label="功能标识" span={1}>{data.id}</Descriptions.Item>
                <Descriptions.Item label="功能名称" span={1}>{data.name}</Descriptions.Item>
                <Descriptions.Item label="数据类型" span={1}>{""}</Descriptions.Item>
                <Descriptions.Item label="是否异步" span={3}>{String(data.async)}</Descriptions.Item>
                <Descriptions.Item label="输入参数" span={1}>{_.map(data.inputs, 'name').join(',')}</Descriptions.Item>
                <Descriptions.Item label="输出参数" span={2}>{data.output?.type}</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>
                    {data.description || ''}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    </>
}

export default Detail;
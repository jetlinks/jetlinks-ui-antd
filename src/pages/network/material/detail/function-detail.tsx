import React from 'react';
import { Descriptions, Modal } from 'antd';

interface EditProps {
    visible?: boolean
    data?: object
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

const Detail = (props: EditProps) => {
    const { ...extra } = props;

    return <>
        <Modal
            width='900px'
            title={'功能定义详情'}
            {...extra}
            footer={[]}
        >
            <Descriptions bordered>
                <Descriptions.Item label="功能标识" span={1}>Cloud Database</Descriptions.Item>
                <Descriptions.Item label="功能名称" span={1}>Prepaid</Descriptions.Item>
                <Descriptions.Item label="数据类型" span={1}>YES</Descriptions.Item>
                <Descriptions.Item label="是否异步" span={3}>2018-04-24 18:00:00</Descriptions.Item>
                <Descriptions.Item label="输入参数" span={1}>2019-04-24 18:00:00</Descriptions.Item>
                <Descriptions.Item label="输出参数" span={2}>$80.00</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>
                    哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    </>
}

export default Detail;
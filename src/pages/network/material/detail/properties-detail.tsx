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
            title={'属性定义详情'}
            {...extra}
            footer={[]}
        >
            <Descriptions bordered>
                <Descriptions.Item label="属性标识" span={1}>Cloud Database</Descriptions.Item>
                <Descriptions.Item label="属性名称" span={1}>Prepaid</Descriptions.Item>
                <Descriptions.Item label="数据类型" span={1}>YES</Descriptions.Item>
                <Descriptions.Item label="精度" span={1}>2018-04-24 18:00:00</Descriptions.Item>
                <Descriptions.Item label="单位" span={2}>2019-04-24 18:00:00</Descriptions.Item>
                <Descriptions.Item label="是否只读" span={1}>$80.00</Descriptions.Item>
                <Descriptions.Item label="属性来源" span={1}>$20.00</Descriptions.Item>
                <Descriptions.Item label="存储方式" span={1}>$60.00</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>
                    哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    </>
}

export default Detail;
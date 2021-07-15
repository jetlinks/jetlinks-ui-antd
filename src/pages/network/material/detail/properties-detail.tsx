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
            title={'属性定义详情'}
            {...extra}
            footer={[]}
        >
            <Descriptions bordered>
                <Descriptions.Item label="属性标识" span={1}>{data.id}</Descriptions.Item>
                <Descriptions.Item label="属性名称" span={1}>{data.name}</Descriptions.Item>
                <Descriptions.Item label="数据类型" span={1}>{data.valueType?.type}</Descriptions.Item>
                <Descriptions.Item label="精度" span={1}>{data.valueType?.scale}</Descriptions.Item>
                <Descriptions.Item label="单位" span={2}>{data.expands?.units || ''}</Descriptions.Item>
                <Descriptions.Item label="是否只读" span={1}>{data.expands?.readOnly}</Descriptions.Item>
                <Descriptions.Item label="属性来源" span={1}>{data.expands?.source || ''}</Descriptions.Item>
                <Descriptions.Item label="存储方式" span={1}>{''}</Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>
                    {data.description || ''}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    </>
}

export default Detail;
import { Button, Card, Descriptions, Tabs } from 'antd';
import React from 'react';
import Property from './Properties';
import Functions from './Functions';
import Events from './Events';
import Service from '../service';
import { useEffect } from 'react';
import { useState } from 'react';

interface DetailProps {
    data: object;
    reBack: Function;
}

function Detail(props: DetailProps) {

    const service = new Service('/network/material');
    const [data, setData] = useState<any>(props.data);
    const [metadata, setMetadata] = useState<any>({
        properties: [],
        functions: [],
        events: []
    });

    useEffect(() => {
        service.getDeviceGatewayInfo(props.data.id).subscribe(resp => {
            if(resp.status === 200){
                setData(resp.result[0]);
                if(resp.result[0].productId){
                    service.getMetaDataInfo(resp.result[0].productId).subscribe(res => {
                        if(res.status === 200){
                            let meta = res.result[0]?.metadata || "{}";
                            setMetadata(JSON.parse(meta));
                        }
                    })
                }
            }
        })
    }, [])

    return (
        <div>
            <Button style={{ marginBottom: "16px" }} onClick={() => {
                props.reBack();
            }}>返回</Button>
            <div style={{ backgroundColor: 'white', marginBottom: '24px', padding: '24px' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '24px', fontWeight: 600, margin: '5px 0px 19px' }}>{data.name}</div>
                <Descriptions title="基本信息">
                    <Descriptions.Item label="产品ID">{data.productId}</Descriptions.Item>
                    <Descriptions.Item label="产品名称">{data.productName}</Descriptions.Item>
                    <Descriptions.Item label="传输协议">{data.transport}</Descriptions.Item>
                    <Descriptions.Item label="网络组件ID">{data.networkId}</Descriptions.Item>
                    <Descriptions.Item label="网络组件名称">{data.networkName}</Descriptions.Item>
                    <Descriptions.Item label="网关类型">{data.gatewayProvider}</Descriptions.Item>
                    <Descriptions.Item label="说明">{data.description}</Descriptions.Item>
                </Descriptions>
            </div>
            <Card title="物模型">
                <Tabs type="card">
                    <Tabs.TabPane tab="属性定义" key="1">
                        <Property data={metadata.properties}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="功能定义" key="2">
                        <Functions data={metadata.functions}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="事件定义" key="3">
                        <Events data={metadata.events} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default Detail;
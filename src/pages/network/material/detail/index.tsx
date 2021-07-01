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
    deviceId: string;
}

function Detail(props: DetailProps) {

    const service = new Service('/network/material');
    const [data, setData] = useState<any>(props.data);

    useEffect(() => {
        service.getDeviceGatewayInfo(props.deviceId, props.data.id).subscribe(resp => {
            if(resp.status === 200){
                setData(resp.result[0])
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
                    <Descriptions.Item label="所属品类">{data.productId}</Descriptions.Item>
                    <Descriptions.Item label="所属机构">{data.productId}g</Descriptions.Item>
                    <Descriptions.Item label="消息协议">{data.transport}</Descriptions.Item>
                    <Descriptions.Item label="链接协议">{data.transport}</Descriptions.Item>
                    <Descriptions.Item label="设备类型">{data.productId}</Descriptions.Item>
                    <Descriptions.Item label="说明">{data.productId}</Descriptions.Item>
                </Descriptions>
            </div>
            <Card title="物模型">
                <Tabs type="card">
                    <Tabs.TabPane tab="属性定义" key="1">
                        <Property
                            data={[]}
                            unitsData={{}}
                            save={(data: any, onlySave: boolean) => {
                                // props.saveProperty(data, onlySave);
                            }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="功能定义" key="2">
                        <Functions
                            data={[]}
                            unitsData={{}}
                            save={(data: any, onlySave: boolean) => {
                                // props.saveProperty(data, onlySave);
                            }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="事件定义" key="3">
                        <Events
                            data={[]}
                            unitsData={{}}
                            save={(data: any, onlySave: boolean) => {
                                // props.saveProperty(data, onlySave);
                            }}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default Detail;
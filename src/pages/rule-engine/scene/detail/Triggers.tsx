import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { AutoComplete, Card, Col, Icon, Input, Radio, Row, Select, Switch } from 'antd';
import { Triggers } from '@/pages/rule-engine/scene/data';
import apis from '@/services';

interface Props extends FormComponentProps {
    trigger: Partial<Triggers>;
    save: Function;
    position: number;
}

const Trigger: React.FC<Props> = props => {
    const [deviceName, setDeviceName] = useState('');
    const [sceneListNoPage, setSceneListNoPage] = useState([]);
    const [shakeLimit] = useState(props.trigger.device && props.trigger.device.shakeLimit ? props.trigger.device.shakeLimit : { enabled: false });
    const [deviceData, setDeviceData] = useState({});
    const [metaData, setMetaData] = useState({
        properties: [],
        events: [],
        functions: []
    });
    const [triggerType] = useState(props.trigger.trigger);
    const [messageType] = useState(props.trigger.device ? props.trigger.device.type : '');
    const [filters] = useState(props.trigger.device ? props.trigger.device.filters : []);
    const [dataSource] = useState([]);

    const [trigger, setTrigger] = useState(props.trigger);
    useEffect(() => {
        apis.scene.listNoPaging({}).then(res => {
            if (res.status === 200) {
                setSceneListNoPage(res.result);
            }
        })
        if (props.trigger.device && props.trigger.device.deviceId) {
            findDeviceById(props.trigger.device.deviceId)
        }
    }, []);

    const findDeviceById = (deviceId: string) => {
        apis.deviceInstance.info(deviceId)
            .then((response: any) => {
                if (response.status === 200) {
                    setDeviceData(response.result);
                    trigger.device.productId = response.result.productId
                    trigger.device.deviceId = response.result.id
                    setMetaData(JSON.parse(response.result.metadata))
                    setDeviceName(response.result.name)
                }
            }).catch(() => {
            });
    };

    const renderType = () => {
        switch (messageType) {
            case 'properties':
                return (
                    <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
                        <Select placeholder="物模型属性" defaultValue={props.trigger.device.modelId}>
                            {metaData.properties?.map((item: any) => (
                                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                );
            case 'event':
                return (
                    <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
                        <Select placeholder="物模型事件" defaultValue={props.trigger.device.modelId}>
                            {metaData.events?.map((item: any) => (
                                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                );
            case 'function':
                return (
                    <Col span={6} style={{ paddingBottom: 10, paddingLeft: 3, paddingRight: 9 }}>
                        <Select placeholder="物模型功能" defaultValue={props.trigger.device.modelId}>
                            {metaData.functions?.map((item: any) => (
                                <Select.Option key={item.id} data={item}>{`${item.name}（${item.id}）`}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                );
            default:
                return null;
        }
    };

    const renderDataType = () => {
        switch (triggerType) {
            case 'device':
                return (
                    <div>
                        <Col span={24}>
                            <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                                <Input addonAfter={<Icon onClick={() => {
                                }} type='gold' title="点击选择设备" />}
                                    defaultValue={deviceName}
                                    placeholder="点击选择设备"
                                    readOnly={true}
                                    value={deviceData?.name}
                                />
                            </Col>
                        </Col>
                        <Col span={24}>
                            <Col span={6} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                                <Select placeholder="选择消息类型" defaultValue={props.trigger.device.type}>
                                    <Select.Option value="online">上线</Select.Option>
                                    <Select.Option value="offline">离线</Select.Option>
                                    <Select.Option value="properties">属性</Select.Option>
                                    <Select.Option value="event">事件</Select.Option>
                                    <Select.Option value="function">功能</Select.Option>
                                </Select>
                            </Col>
                            {renderType()}
                        </Col>
                        <Col span={24}>
                            {filters.map((item: any, index: number) => (
                                <div className="ant-row" key={index}>
                                    <Col span={6} style={{ paddingLeft: -1, paddingRight: 12, paddingBottom: 10 }}>
                                        <AutoComplete dataSource={dataSource} placeholder="过滤条件KEY" children={item.key}
                                            defaultValue={item.key}
                                            onBlur={value => {
                                                filters[index].key = value;
                                                trigger.device.filters = filters;
                                                setTrigger(trigger);
                                            }}
                                            filterOption={(inputValue, option) =>
                                                option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </Col>
                                    <Col span={6} style={{ paddingLeft: 3, paddingRight: 9, paddingBottom: 10 }}>
                                        <Select placeholder="操作符" defaultValue={item.operator}>
                                            <Select.Option value="eq">等于(=)</Select.Option>
                                            <Select.Option value="not">不等于(!=)</Select.Option>
                                            <Select.Option value="gt">大于(>)</Select.Option>
                                            <Select.Option value="lt">小于(&lt;)</Select.Option>
                                            <Select.Option value="gte">大于等于(>=)</Select.Option>
                                            <Select.Option value="lte">小于等于(&lt;=)</Select.Option>
                                            <Select.Option value="like">模糊(%)</Select.Option>
                                        </Select>
                                    </Col>
                                    <Col span={7} style={{ paddingLeft: 7, paddingRight: 3, paddingBottom: 10 }}>
                                        <Input placeholder="过滤条件值" defaultValue={item.value}
                                            readOnly
                                        />
                                    </Col>
                                </div>
                            ))}
                        </Col>
                    </div>
                );
            case 'timer':
                return (
                    <div>
                        <Col span={6} style={{ paddingBottom: 10 }}>
                            <Input placeholder="cron表达式" defaultValue={trigger.cron} key="cron"
                                readOnly
                            />
                        </Col>
                    </div>
                );
            case 'scene':
                return (
                    <div>
                        <Col span={6} style={{ paddingBottom: 10 }}>
                            <Select placeholder="请选择场景" mode="multiple" defaultValue={trigger.scene.sceneIds}>
                                {
                                    sceneListNoPage.map((item, index) => {
                                        return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Col>
                    </div>
                )
            default:
                return null;
        }
    };

    return (
        <div style={{ paddingBottom: 5 }} key={props.position}>
            <Card size="small" bordered={false} style={{ backgroundColor: '#F5F5F6' }}>
                <Row style={{ marginLeft: -2 }}>
                    <span>触发器: {props.position + 1}</span>
                </Row>

                <Row gutter={16} style={{ paddingLeft: 10 }}>
                    <Col span={24} style={{ paddingBottom: 10 }}>
                        <div style={{ display: 'flex' }}>
                            <Col span={6}>
                                <Select placeholder="选择触发器类型" value={trigger.trigger}>
                                    <Select.Option value="manual">手动触发</Select.Option>
                                    <Select.Option value="timer">定时触发</Select.Option>
                                    <Select.Option value="device">设备触发</Select.Option>
                                    <Select.Option value="scene">场景触发</Select.Option>
                                </Select>
                            </Col>
                            {
                                triggerType === 'device' && triggerType === 'device' && (
                                    <Switch disabled key='shakeLimit.enabled' checkedChildren="开启防抖" unCheckedChildren="关闭防抖"
                                        defaultChecked={shakeLimit.enabled ? shakeLimit.enabled : false}
                                        style={{ marginLeft: 20, width: '100px'}}
                                    />
                                )
                            }
                            {shakeLimit.enabled && (
                                <Col span={12}>
                                    <Col span={24} style={{ paddingBottom: 10, paddingLeft: -1, paddingRight: 12 }}>
                                        <Input style={{ width: 80, marginLeft: 3 }} size='small' key='shakeLimit.time'
                                            defaultValue={shakeLimit.time}
                                            readOnly
                                        />秒内发生
                                <Input style={{ width: 80 }} size='small' key='shakeLimit.threshold' defaultValue={shakeLimit.threshold}
                                            readOnly
                                        />次及以上时，处理
                                <Radio.Group defaultValue={shakeLimit.alarmFirst} key='shakeLimit.alarmFirst' size='small'
                                            buttonStyle="solid"
                                            onChange={event => {
                                                props.trigger.device.shakeLimit.alarmFirst = Boolean(event.target.value);
                                            }}
                                        >
                                            <Radio.Button value={true}>第一次</Radio.Button>
                                            <Radio.Button value={false}>最后一次</Radio.Button>
                                        </Radio.Group>
                                    </Col>
                                </Col>
                            )}
                        </div>
                    </Col>
                    <Col>
                        {renderDataType()}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Form.create<Props>()(Trigger);
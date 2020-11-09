import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Avatar, Badge, Button, Card, Icon, List, message, Popconfirm, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Save from "./save";
import Service from "./service";
import productImg from "@/pages/device/product/img/product.png";
import Detail from "./detail";

interface Props {

}

const Simulator: React.FC<Props> = props => {

    const service = new Service('network/simulator');

    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<any>();
    const [data, setData] = useState();
    const search = () => {
        service.query({}).subscribe(data => {
            setData(data);
        })
    }
    useEffect(() => {
        search();
    }, []);

    const remove = (id: string) => {
        service.remove(id).subscribe(() => {
            message.error('删除成功');
            search();
        })
    }

    const start = (id: string) => {
        service.start(id).subscribe(() => {
            message.success('启动成功');
            setDetailVisible(true);
            // setCurrent(item)
            search();
        })
    }
    const stop = (id: string) => {
        service.stop(id).subscribe(() => {
            message.success('停止成功');
            search();
        })
    }

    return (
        <PageHeaderWrapper title="模拟测试">
            <Card>
                <Button onClick={() => {
                    setSaveVisible(true);
                    setCurrent({})
                }}> 新建模拟器</Button>
            </Card>
            <div style={{ marginTop: '30px' }}>

                <List<any>
                    rowKey="id"
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }}
                    dataSource={data}
                    renderItem={item => {
                        if (item && item.id) {
                            return (
                                <List.Item key={item.id}>
                                    <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                                        actions={[
                                            <Tooltip key="seeProduct" title="详情">
                                                <Icon
                                                    type="eye"
                                                    onClick={() => {
                                                        if (item.status.value === 'stop') {
                                                            message.success('模拟器未启动！')
                                                        } else {
                                                            setDetailVisible(true);
                                                            setCurrent(item)
                                                        }
                                                    }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="update" title='编辑'>
                                                <Icon
                                                    type="edit"

                                                    onClick={() => {
                                                        setCurrent(item);
                                                        setSaveVisible(true);
                                                    }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="action" title={item.status.value === 'stop' ? '启动' : '停止'}>
                                                <Icon
                                                    type="play-circle"
                                                    onClick={() => {
                                                        setCurrent(item);
                                                        item.status.value === 'stop' ? start(item.id) : stop(item.id)
                                                    }}
                                                />
                                            </Tooltip>,
                                            <Tooltip key="more_actions" title="删除">
                                                <Popconfirm
                                                    title="删除此模拟器？"
                                                    onConfirm={() => {
                                                        if (item.status.value === 'running') {
                                                            message.success('运行中，删除失败！')
                                                        } else {
                                                            remove(item.id)
                                                        }
                                                    }}>
                                                    <Icon type="close" />
                                                </Popconfirm>
                                            </Tooltip>,
                                        ]}
                                    >
                                        <Card.Meta
                                            avatar={<Avatar size={40} src={productImg} />}
                                            title={item.name}
                                        />
                                        <div style={{display: 'flex',width: '100%'}}>
                                            <div style={{ width: '50%', textAlign: 'center' }}>

                                                <p  >状态</p>
                                                <p style={{fontSize: 14, fontWeight:600}}>
                                                    <Badge color={item.status.value === 'stop' ? 'red' : 'green'}
                                                        text={item.status.text} />
                                                </p>
                                            </div>
                                            <div style={{ width: '50%', textAlign: 'center'}}>

                                                <p >类型</p>
                                                <p style={{fontSize: 14, fontWeight:600}}>
                                                    <Tooltip key="findDevice" title="点击查看设备">
                                                        <a>{item.networkType}</a>
                                                    </Tooltip>
                                                </p>
                                            </div>

                                        </div>
                                    </Card>
                                </List.Item>
                            );
                        }
                        return '';
                    }}
                />
            </div>
            {saveVisible && (
                <Save
                    data={current}
                    close={() => {
                        setSaveVisible(false);
                        search()
                    }}
                />
            )}

            {
                detailVisible && (
                    <Detail close={() => setDetailVisible(false)} data={current} />
                )
            }

        </PageHeaderWrapper>
    )
}
export default Simulator;

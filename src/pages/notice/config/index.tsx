import { PageHeaderWrapper } from "@ant-design/pro-layout"
import React from "react";
import { Card, Form, Row, Col, Select, Input, List, Tooltip, Icon, Dropdown, Avatar, Menu, Tag } from "antd";
import StandardFormRow from "./components/standard-form-row";
import TagSelect from "./components/tag-select";
import { FormComponentProps } from "antd/lib/form";
import styles from './index.less';
import { ChartCard, MiniArea } from "@/pages/analysis/components/Charts";
import moment from "moment";

interface Props extends FormComponentProps {

}
interface State {

}
const Config: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator } } = props;

    const formItemLayout = {
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const itemMenu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                    1st menu item
            </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
                    2nd menu item
            </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
                    3d menu item
            </a>
            </Menu.Item>
        </Menu>
    );

    const CardInfo: React.FC<{
        activeUser: React.ReactNode;
        newUser: React.ReactNode;
    }> = ({ activeUser, newUser }) => (
        <div
            className={styles.cardInfo}
        >
            <div>
                <p>配置名称</p>
                <p>{activeUser}</p>
            </div>
            <div>
                <p>当前状态</p>
                <p style={{ color: 'red' }}>{newUser}</p>
            </div>
        </div >
    );

    let visitData: any[] = [];
    const beginDay = new Date().getTime();

    const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
    for (let i = 0; i < fakeY.length; i += 1) {
        visitData.push({
            x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
            y: fakeY[i],
        });
    }
    return (
        <PageHeaderWrapper
            title="组件管理"
        >

            <div className={styles.filterCardList}>

                <Card bordered={false}>
                    <Form layout="inline">
                        <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
                            <Form.Item>
                                {getFieldDecorator('category')(
                                    <TagSelect expandable>
                                        <TagSelect.Option value="cat1">邮件</TagSelect.Option>
                                        <TagSelect.Option value="cat2">钉钉</TagSelect.Option>
                                        <TagSelect.Option value="cat3">短信</TagSelect.Option>
                                        <TagSelect.Option value="cat4">语音</TagSelect.Option>
                                        <TagSelect.Option value="cat5">微信</TagSelect.Option>
                                    </TagSelect>,
                                )}
                            </Form.Item>
                        </StandardFormRow>
                        <StandardFormRow title="其它选项" grid last>
                            <Row gutter={16}>
                                <Col lg={8} md={10} sm={10} xs={24}>
                                    <Form.Item {...formItemLayout} label="配置名称">
                                        {getFieldDecorator(
                                            'author',
                                            {},
                                        )(
                                            // <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                                            //     <Select.Option value="lisa">王昭君</Select.Option>
                                            // </Select>,
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                                {/* <Col lg={8} md={10} sm={10} xs={24}>
                                <Form.Item {...formItemLayout} label="好评度">
                                    {getFieldDecorator(
                                        'rate',
                                        {},
                                    )(
                                        <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                                            <Select.Option value="good">优秀</Select.Option>
                                            <Select.Option value="normal">普通</Select.Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                            </Col> */}
                            </Row>
                        </StandardFormRow>
                    </Form>
                </Card>
                <br />
                <List<any>
                    rowKey="id"
                    grid={{ gutter: 24, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    // loading={loading}
                    dataSource={[
                        {
                            id: 1203191,
                            type: 'TCP客户端',
                            name: 'test-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203192,
                            type: 'TCP服务',
                            name: 'tcp-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203193,
                            type: 'MQTT客户端',
                            name: 'mqtt-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203194,
                            type: 'MQTT服务',
                            name: 'test-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203195,
                            type: 'HTTP客户端',
                            name: 'http-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203196,
                            type: 'TCP服务',
                            name: 'tcp-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203197,
                            type: 'MQTT客户端',
                            name: 'mqtt-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203198,
                            type: 'MQTT服务',
                            name: 'test-script',
                            status: '已停止',
                            describe: '描述'
                        },
                        {
                            id: 1203199,
                            type: 'HTTP客户端',
                            name: 'http-script',
                            status: '已停止',
                            describe: '描述'
                        }
                    ]}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <Card
                                hoverable
                                bodyStyle={{ paddingBottom: 20 }}
                                actions={[
                                    <Tooltip key="download" title="下载">
                                        <Icon type="download" />
                                    </Tooltip>,
                                    <Tooltip key="edit" title="编辑">
                                        <Icon type="edit" />
                                    </Tooltip>,
                                    <Tooltip key="bug" title="调试" >
                                        <Icon type="bug" />
                                    </Tooltip>,
                                    <Dropdown key="ellipsis" overlay={itemMenu}>
                                        <Icon type="ellipsis" />
                                    </Dropdown>,
                                ]}
                            >
                                <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.type} />
                                <div
                                    className={styles.cardItemContent}
                                >
                                    <CardInfo
                                        activeUser={item.name}
                                        newUser={item.status}
                                    />
                                </div>
                                <ChartCard
                                    bordered={false}
                                    // loading={loading}
                                    title='访问量'
                                    action={
                                        <Tooltip
                                            title='访问量'
                                        >
                                            <Icon type="info-circle-o" />
                                        </Tooltip>
                                    }
                                    // total={numeral(8846).format('0,0')}
                                    // footer={
                                    //     <Field
                                    //         label={
                                    //             <FormattedMessage id="analysis.analysis.day-visits" defaultMessage="Daily Visits" />
                                    //         }
                                    //         value={numeral(1234).format('0,0')}
                                    //     />
                                    // }
                                    contentHeight={66}
                                >
                                    <MiniArea color="#589EFF" data={[{ "x": "2020-01-07", "y": 7 }, { "x": "2020-01-08", "y": 5 }, { "x": "2020-01-09", "y": 4 }, { "x": "2020-01-10", "y": 2 }, { "x": "2020-01-11", "y": 4 }, { "x": "2020-01-12", "y": 7 }, { "x": "2020-01-13", "y": 5 }, { "x": "2020-01-14", "y": 6 }, { "x": "2020-01-15", "y": 5 }, { "x": "2020-01-16", "y": 9 }, { "x": "2020-01-17", "y": 6 }, { "x": "2020-01-18", "y": 3 }, { "x": "2020-01-19", "y": 1 }, { "x": "2020-01-20", "y": 5 }, { "x": "2020-01-21", "y": 3 }, { "x": "2020-01-22", "y": 6 }, { "x": "2020-01-23", "y": 5 }]} />
                                </ChartCard>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>

        </PageHeaderWrapper>
    )
}
export default Form.create<Props>()(Config);

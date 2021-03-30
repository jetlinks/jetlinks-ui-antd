import React, { Fragment, useEffect, useState } from "react";
import { Modal, Tabs, Table, Tag, Tooltip, Form, Row, Col, DatePicker, Button } from "antd";
import { RuleInstanceItem } from "@/pages/rule-engine/instance/data";
import { ColumnProps, PaginationConfig } from 'antd/es/table';
import Service from "../../service";
import styles from './index.less';
import moment, { Moment } from 'moment';
import { FormComponentProps } from "antd/lib/form";
const { TabPane } = Tabs;


interface Props extends FormComponentProps {
  data: Partial<RuleInstanceItem>
  close: Function
  id: string
}

interface State {
  searchParam: any
  realTimeDataLogs: any[]
  realTimeDataEvents: any[]
  dataLogs: any
  dataEvents: any,
  nodeData: any[],
  createTime: any
}

const columns: ColumnProps<RuleInstanceItem>[] = [
  {
    title: '时间',
    dataIndex: 'timestamp',
    align: 'center',
    width: 180,
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '节点',
    align: 'center',
    dataIndex: 'nodeId',
    ellipsis: true,
    width: 130,
    render: (message: string) => {
      return (
        <Tooltip placement="left" arrowPointAtCenter title={message}>{message}</Tooltip>
      )
    }
  },
  {
    title: '日志级别',
    align: 'center',
    dataIndex: 'level',
    render: (text: {} | null | undefined) => {
      let color: string;
      if (text === 'debug' || text === '调试') {
        color = 'green'
      } else if (text === 'error') {
        color = 'red'
      } else {
        color = 'orange'
      }
      return (
        <Tag color={color}>{text}</Tag>
      )
    }
  },
  {
    title: '内容',
    align: 'center',
    ellipsis: true,
    width: 200,
    dataIndex: 'message',
    render: (message: string) => {
      return (
        <Tooltip placement="left" arrowPointAtCenter title={message}>{message}</Tooltip>
      )
    }
  },
  {
    title: '操作',
    width: '250px',
    align: 'center',
    render: (record) => {
      let content = '';
      try {
        content = JSON.stringify(JSON.parse(record.message), null, 2);
      } catch (error) {
        content = record.message;
      }
      return (
        <Fragment>
          <a
            onClick={() =>
              Modal.confirm({
                width: '50VW',
                title: '详细信息',
                content: <pre>{content}</pre>,
                okText: '确定',
                cancelText: '关闭',
              })
            }
          >
            查看
          </a>
        </Fragment>
      );
    },
  },
];

const columnsEvents: ColumnProps<RuleInstanceItem>[] = [
  {
    title: '时间',
    dataIndex: 'createTime',
    width: 200,
    align: 'center',
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '节点',
    align: 'center',
    dataIndex: 'nodeId'
  },
  {
    title: '内容',
    width: 200,
    align: 'center',
    ellipsis: true,
    dataIndex: 'ruleData',
    render: (message: string) => {
      return (
        <Tooltip placement="left" arrowPointAtCenter title={message}>{message}</Tooltip>
      )
    }
  },
  {
    title: '操作',
    width: '250px',
    align: 'center',
    render: (record) => {
      let content = '';
      try {
        content = JSON.stringify(JSON.parse(record.message), null, 2);
      } catch (error) {
        content = record.message;
      }
      return (
        <Fragment>
          <a
            onClick={() =>
              Modal.confirm({
                width: '50VW',
                title: '详细信息',
                content: <pre>{content}</pre>,
                okText: '确定',
                cancelText: '关闭',
              })
            }
          >
            查看
          </a>
        </Fragment>
      );
    },
  }
];

const Detail: React.FC<Props> = props => {
  const service = new Service('rule-engine');
  const { getFieldDecorator } = props.form;

  const initState: State = {
    searchParam: {
      pageSize: 10,
      ruleInstanceId: props.data.id,
      sorts: {
        order: "desc",
        field: "createTime"
      }
    },
    createTime: "",
    realTimeDataLogs: [],
    realTimeDataEvents: [],
    dataLogs: {},
    dataEvents: {},
    nodeData: []
  };
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [dataLogs, setDataLogs] = useState(initState.dataLogs);
  const [dataEvents, setDataEvents] = useState(initState.dataEvents);
  // const [nodeData, setNodeData] = useState(initState.nodeData)
  // const getNode = () => {
  //   return new Promise((resolve, reject) => {
  //     if (props.data.id as string !== '') {
  //       apis.ruleInstance.node(props.data.id as string, {}).then(resp => {
  //         if (resp.status === 200) {
  //           let data: any[] = [];
  //           resp.result.map((i: any) => {
  //             nodeMap.set(i.id, i.name)
  //             data.push({ id: i.id, name: i.name })
  //           })
  //           setNodeData(data)
  //           resolve();
  //         }
  //       }).catch((err) => {
  //         reject(err);
  //       })
  //     }
  //   })
  // };

  const eventsChange = (
    pagination: PaginationConfig,
  ) => {
    const data = props.form.getFieldsValue();
    let terms = {}
    if (data.createTimeEvents) {
      const formatDate = data.createTimeEvents.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      terms = {
        createTime$btw: formatDate.join(',')
      }
    }
    getEventsList({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      ruleInstanceId: props.data.id,
      sorts: {
        order: "desc",
        field: "createTime"
      },
      terms: terms
    });
  };
  const logsChange = (
    pagination: PaginationConfig
  ) => {
    const data = props.form.getFieldsValue();
    let terms = {}
    if (data.createTimeLogs) {
      const formatDate = data.createTimeLogs.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      terms = {
        createTime$btw: formatDate.join(',')
      }
    }
    getLogsList({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      ruleInstanceId: props.data.id,
      sorts: {
        order: "desc",
        field: "createTime"
      },
      terms: terms
    });
  };
  const searchLogs = () => {
    const data = props.form.getFieldsValue();
    let terms = {}
    if (data.createTimeLogs) {
      const formatDate = data.createTimeLogs.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      terms = {
        createTime$btw: formatDate.join(',')
      }
    }
    getLogsList({
      pageSize: 10,
      pageIndex: 0,
      ruleInstanceId: props.data.id,
      sorts: {
        order: "desc",
        field: "createTime"
      },
      terms: terms
    });
  }
  const searchEvents = () => {
    const data = props.form.getFieldsValue();
    let terms = {}
    if (data.createTimeEvents) {
      const formatDate = data.createTimeEvents.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      terms = {
        createTime$btw: formatDate.join(',')
      }
    }
    getEventsList({
      pageSize: 10,
      pageIndex: 0,
      ruleInstanceId: props.data.id,
      sorts: {
        order: "desc",
        field: "createTime"
      },
      terms: terms
    });
  }

  const getEventsList = (params?: any) => {
    setSearchParam(params);
    service.getRuleInstanceEventsList(props.id, params).subscribe(
      (res) => { setDataEvents(res) },
      () => {
      })
  }

  const getLogsList = (params?: any) => {
    setSearchParam(params);
    service.getRuleInstanceLogsList(props.id, params).subscribe(
      (res) => { setDataLogs(res) },
      () => {
      })
  }

  useEffect(() => {
    getLogsList(searchParam);
    getEventsList(searchParam);
  }, []);

  return (
    <Modal width="1000px"
           visible
           title={`${props.data.name}日志`}
           onCancel={() => props.close()}
           onOk={() => props.close()}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="运行数据" key="1">
          <div className={styles.box}>
            <div className={styles.boxLeft}>
              <div className={styles.search}>
                <Form>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col style={{ height: 56 }} md={8} sm={24} key='createTimeEvents'>
                      <Form.Item>
                        {getFieldDecorator('createTimeEvents', {
                          initialValue: '',
                          rules: []
                        })(
                          <DatePicker.RangePicker
                            style={{ width: '200%' }}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <div style={{ float: 'right', marginBottom: 24, marginRight: 30, marginTop: 4 }}>
                      <Button type="primary" onClick={searchEvents}> 查询</Button>
                      <Button style={{ marginLeft: 8 }} onClick={() => { props.form.resetFields(); searchEvents(); }}>重置</Button>
                    </div>
                  </Row>
                </Form>
              </div>
              <Table
                onChange={eventsChange}
                dataSource={dataEvents?.datalist || []}
                rowKey={(item: any) => item.time}
                columns={columnsEvents}
                pagination={{
                  current: dataEvents?.pageIndex + 1,
                  total: dataEvents?.total,
                  pageSize: dataEvents?.pageSize
                }}
              />
            </div>
          </div>
        </TabPane>
        <TabPane tab="运行日志" key="2">
          <div className={styles.box}>
            <div className={styles.boxLeft}>
              <div className={styles.search}>
                <Form>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col style={{ height: 56 }} md={8} sm={24} key='createTimeLogs'>
                      <Form.Item>
                        {getFieldDecorator('createTimeLogs', {
                          initialValue: '',
                          rules: []
                        })(
                          <DatePicker.RangePicker
                            style={{ width: '200%' }}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <div style={{ float: 'right', marginBottom: 24, marginRight: 30, marginTop: 4 }}>
                      <Button type="primary" onClick={searchLogs}> 查询</Button>
                      <Button style={{ marginLeft: 8 }} onClick={() => { props.form.resetFields(); searchLogs(); }}>重置</Button>
                    </div>
                  </Row>
                </Form>
              </div>
              <Table
                dataSource={dataLogs?.datalist || []}
                rowKey={(item: any) => item.time}
                columns={columns}
                onChange={logsChange}
                pagination={{
                  current: dataLogs?.pageIndex + 1,
                  total: dataLogs?.total,
                  pageSize: dataLogs?.pageSize
                }}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal >
  )
};

export default Form.create<Props>()(Detail);

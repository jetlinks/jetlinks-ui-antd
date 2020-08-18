import React, { useEffect, useState } from "react";
import { Modal, Tabs, Table, Tag, Tooltip } from "antd";
import { RuleInstanceItem } from "@/pages/rule-engine/instance/data";
import { ColumnProps } from 'antd/es/table';
import encodeQueryParam from '@/utils/encodeParam';
import apis from "@/services";
import styles from './detail.less';
import moment from 'moment';
import SearchForm from "./SearchForm";
import { getWebsocket } from '@/layouts/GlobalWebSocket';
const { TabPane } = Tabs;


interface Props {
  data: Partial<RuleInstanceItem>
  close: Function
}

interface State {
  searchParam: any
  realTimeDataLogs: any[]
  realTimeDataEvents: any[]
  dataLogs: any
  dataEvents: any,
  nodeData: any[]
}
const columnsRealTime: ColumnProps<RuleInstanceItem>[] = [
  {
    title: '时间',
    dataIndex: 'time',
    align: 'center',
    width: 200,
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '内容',
    align: 'center',
    width: 150,
    ellipsis: true,
    dataIndex: 'message',
    render: (message: string) => {
      return (
        <Tooltip placement="left" arrowPointAtCenter title={message}>{message}</Tooltip>
      )
    }
  }
]

const columns: ColumnProps<RuleInstanceItem>[] = [
  {
    title: '时间',
    dataIndex: 'time',
    align: 'center',
    width: 200,
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '节点',
    align: 'center',
    dataIndex: 'nodeId'
  },
  {
    title: '水平',
    align: 'center',
    dataIndex: 'level',
    render: (text: {} | null | undefined, record: any) => {
      let color = ''
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
  }
]

const columnsEvents: ColumnProps<RuleInstanceItem>[] = [
  {
    title: '时间',
    dataIndex: 'time',
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
    dataIndex: 'message',
    render: (message: string) => {
      return (
        <Tooltip placement="left" arrowPointAtCenter title={message}>{message}</Tooltip>
      )
    }
  }
]

const Detail: React.FC<Props> = props => {

  let nodeMap = new Map();

  const initState: State = {
    searchParam: {
      pageSize: 10,
      sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    realTimeDataLogs: [],
    realTimeDataEvents: [],
    dataLogs: {},
    dataEvents: {},
    nodeData: []
  }
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [realTimeDataLogs, setRealTimeDataLogs] = useState(initState.realTimeDataLogs);
  const [realTimeDataEvents, setRealTimeDataEvents] = useState(initState.realTimeDataEvents);
  const [dataLogs, setDataLogs] = useState(initState.dataLogs);
  const [dataEvents, setDataEvents] = useState(initState.dataEvents);
  const [nodeData, setNodeData] = useState(initState.nodeData)
  const getNode = () =>{
    return new Promise((resolve, reject) => {
      if (props.data.id as string !== '') {
        apis.ruleInstance.node(props.data.id as string, {}).then(resp => {
          if (resp.status === 200) {
            let data: any[] = []
            resp.result.map((i: any) => {
              nodeMap.set(i.id, i.name)
              data.push({id: i.realTimeDataEvents, name: i.name})
            })
            setNodeData(data)
            resolve();
          }
        }).catch((err) => {
          reject(err);
        })
      }
    })
  }
  
  const getDataLogs = (params?: any) => {
    const temp = { ...searchParam, ...params };
    setSearchParam(temp);
    apis.ruleInstance.log(props.data.id as string, encodeQueryParam(temp)).then(resp => {
      if (resp.status === 200) {
        let datalist: any[] = [];
        resp.result.data.map((item: any) => {
          if(nodeData.length > 0){
            datalist.push({
              time: item.createTime,
              nodeId: nodeData.filter((x: any) => x.id === item.nodeData).map((i: any) => i.name),
              message: item.message,
              level: item.level
            })
          }else{
            datalist.push({
              time: item.createTime,
              nodeId: nodeMap.get(item.nodeId) || '--',
              message: item.message,
              level: item.level
            })
          }
        });
        setDataLogs({
          datalist,
          pageIndex: resp.result.pageIndex,
          pageSize: resp.result.pageSize,
          total: resp.result.total
        })
      }
    })
  }
  const getDataEvents = (params?: any) => {
    const temp = { ...searchParam, ...params };
    setSearchParam(temp);
    apis.ruleInstance.event(props.data.id as string, encodeQueryParam(temp)).then(resp => {
      if (resp.status === 200) {
        let datalist: any[] = [];
        resp.result.data.map((item: any) => {
          if(nodeData.length > 0){
            datalist.push({
              time: item.createTime,
              nodeId: nodeData.filter((x: any) => x.id === item.nodeData).map((i: any) => i.name),
              message: JSON.stringify(JSON.parse(item.ruleData).data)
            })
          }else{
            datalist.push({
              time: item.createTime,
              nodeId: nodeMap.get(item.nodeId) || '--',
              message: JSON.stringify(JSON.parse(item.ruleData).data)
            })
          }
        });
        setDataEvents({
          datalist,
          pageIndex: resp.result.pageIndex,
          pageSize: resp.result.pageSize,
          total: resp.result.total
        })
      }
    })
  }
  const eventsChange = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    getDataEvents({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter.field ? sorter : searchParam.sorter,
    });
  };
  const logsChange = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    getDataLogs({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter.field ? sorter : searchParam.sorter,
    });
  };
  useEffect(() => {
    getNode().then(res => {
      getDataLogs(searchParam);
      getDataEvents(searchParam);
    })
  }, [])

  useEffect(() => {
    let tempLogs = getWebsocket(
      `rule-engine-realTime-logs${props.data.id}`,
      `/rule-engine/${props.data.id}/*/logger/*`,
      {},
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        if (payload.message !== undefined || payload.timestamp !== undefined) {
          let arr: any = {
            message: payload.message,
            time: payload.timestamp
          }
          setRealTimeDataLogs(prev => ([arr, ...prev]));
        }
        if (realTimeDataLogs.length >= 10) {
          setRealTimeDataLogs(prev => ([...prev.slice(0, 10)]))
        }
      }
    )
    let tempEvents = getWebsocket(
      `rule-engine-realTime-events${props.data.id}`,
      `/rule-engine/${props.data.id}/*/event/*`,
      {},
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        if (payload.data !== undefined) {
          let arr: any = {
            time: new Date(),
            message: JSON.stringify(payload.data)
          }
          setRealTimeDataEvents(prev => ([arr, ...prev]));
        }
        if (realTimeDataEvents.length >= 10) {
          setRealTimeDataEvents(prev => ([...prev.slice(0, 10)]))
        }
      }
    )

    return () => {
      tempLogs && tempLogs.unsubscribe();
      tempEvents && tempEvents.unsubscribe();
    };
  }, [realTimeDataLogs, realTimeDataEvents])

  return (
    <Modal width="1000px"
      visible
      title={`${props.data.name}日志`}
      onCancel={() => props.close()}
      onOk={() => props.close()}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="运行日志" key="1">
          <div className={styles.box}>
            <div className={styles.boxLeft}>
              <div className={styles.search}>
                <SearchForm
                  formItems={[
                    {
                      label: '',
                      key: 'createTime$btw'
                    }
                  ]}
                  search={(params: any) => {
                    setSearchParam(params);
                    getDataLogs({ terms: params, pageSize: 10 });
                  }}
                />
              </div>
              <Table
                dataSource={dataLogs.datalist || []}
                rowKey="id" 
                columns={columns}
                showHeader={false}
                onChange={logsChange}
                pagination={{
                  current: dataLogs.pageIndex + 1,
                  total: dataLogs.total,
                  pageSize: dataLogs.pageSize
                }}
              />
            </div>
            <div className={styles.boxRight}>
              <h4>运行日志：</h4>
              <Table dataSource={(realTimeDataLogs || {})} rowKey="id" columns={columnsRealTime} pagination={false} />
            </div>
          </div>
        </TabPane>
        <TabPane tab="运行数据" key="2">
          <div className={styles.box}>
            <div className={styles.boxLeft}>
              <div className={styles.search}>
                <SearchForm
                  formItems={[
                    {
                      label: '',
                      key: 'createTime$btw'
                    }
                  ]}
                  search={(params: any) => {
                    setSearchParam(params);
                    getDataEvents({ terms: params, pageSize: 10 });
                  }}
                />
              </div>
              <Table
                onChange={eventsChange}
                dataSource={dataEvents.datalist || []}
                rowKey="id"
                columns={columnsEvents}
                showHeader={false}
                pagination={{
                  current: dataEvents.pageIndex + 1,
                  total: dataEvents.total,
                  pageSize: dataEvents.pageSize
                }}
              />
            </div>
            <div className={styles.boxRight}>
              <h4>运行日志：</h4>
              <Table dataSource={(realTimeDataEvents || {})} rowKey="id" columns={columnsRealTime} pagination={false} />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default Detail

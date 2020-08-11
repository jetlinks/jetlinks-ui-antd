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


interface Props{
  data: Partial<RuleInstanceItem>
  close: Function
}

interface State {
  nodeData: any[]
  searchParam: any
  realTimeDataLogs: any[]
  realTimeDataEvents: any[]
  dataLogs: any[]
  dataEvents: any[]
  createTime: ''
}

const columnsRealTime: ColumnProps<RuleInstanceItem>[] = [
  {
    key: 'time',
    title: '时间',
    dataIndex: 'time',
    align: 'center',
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    key: 'message',
    title: '内容',
    align: 'center',
    dataIndex: 'message'
  }
]

const columns: ColumnProps<RuleInstanceItem>[] = [
  {
    key: 'time',
    title: '时间',
    dataIndex: 'time',
    align: 'center',
    width: 200,
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    key: 'nodeId',
    title: '节点',
    align: 'center',
    dataIndex: 'nodeId'
  },
  {
    key: 'level',
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
    key: 'message',
    title: '内容',
    align: 'center',
    ellipsis: true,
    width: 200,
    dataIndex: 'message',
    render: (message: string) => {
      return (
        <Tooltip title={message}>{message}</Tooltip>
      )
    }
  }
]

const columnsEvents: ColumnProps<RuleInstanceItem>[] = [
  {
    key: 'time',
    title: '时间',
    dataIndex: 'time',
    width: 200,
    align: 'center',
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    key: 'nodeId',
    title: '节点',
    align: 'center',
    dataIndex: 'nodeId'
  },
  {
    key: 'message',
    title: '内容',
    width: 200,
    align: 'center',
    ellipsis: true,
    dataIndex: 'message',
    render: (message: string) => {
      return (
        <Tooltip title={message}>{message}</Tooltip>
      )
    }
  }
]
const Detail: React.FC<Props> = props => {

  const nodeMap: any = new Map();

  const initState: State = {
    searchParam: {
      pageSize: 10,
      sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    createTime: '',
    realTimeDataLogs: [],
    realTimeDataEvents: [],
    dataLogs: [],
    dataEvents: [],
    nodeData: []
  }
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [realTimeDataLogs, setRealTimeDataLogs] = useState(initState.realTimeDataLogs);
  const [realTimeDataEvents, setRealTimeDataEvents] = useState(initState.realTimeDataEvents);
  const [dataLogs, setDataLogs] = useState(initState.dataLogs);
  const [dataEvents, setDataEvents] = useState(initState.dataEvents);

  const getNode = (instanceId: string) => {
    if (instanceId !== '') {
      apis.ruleInstance.node(instanceId, {}).then(resp => {
        if (resp.status === 200) {
          resp.result.forEach((item: { id: any; name: any; }) => {
            nodeMap.set(item.id, item.name)
          });
        }
      }).catch(() => {
      })
    }
  }
  const getDataLogs = (params?: any) => {
    const temp = { ...searchParam, ...params };
    setSearchParam(temp);
    apis.ruleInstance.log(props.data.id as string, encodeQueryParam(temp)).then(resp => {
      if (resp.status === 200) {
        let datalist: any = [];
        resp.result.data.map((item: any) => {
          datalist.push({
            time: item.createTime,
            nodeId: nodeMap.get(item.nodeId) || '--',
            message: item.message,
            level: item.level
          })
        });
        // console.log(datalist)
        setDataLogs(datalist)
      }
    })
  }
  const getDataEvents = (params?: any) => {
    const temp = { ...searchParam, ...params };
    setSearchParam(temp);
    apis.ruleInstance.event(props.data.id as string, encodeQueryParam(temp)).then(resp => {
      if (resp.status === 200) {
        let datalist: any = [];
        resp.result.data.map((item: any) => {
          // console.log(nodeMap.get(item.nodeId))
          // console.log(item.nodeId)
          datalist.push({
            time: item.createTime,
            nodeId: nodeMap.get(item.nodeId) || '--',
            message: JSON.stringify(JSON.parse(item.ruleData).data)
          })
        });
        setDataEvents(datalist)
      }
    })
  }

  useEffect(() => {
    // console.log(props.data)
    getNode(props.data.id as string);
    getDataLogs(searchParam);
    getDataEvents(searchParam);

    let tempLogs = getWebsocket(
      `rule-engine-realTime-logs${props.data.id}`,
      `/rule-engine/${props.data.id}/*/logger/*`,
      {},
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        let arr: any = {
          message: payload.message,
          time: payload.timestamp
        }

        if(payload.message !== undefined || payload.timestamp !== undefined){
          setRealTimeDataLogs(prev => ([arr, ...prev]));
        }
        if(realTimeDataLogs.length >= 10){
          // console.log('eeee')
          setRealTimeDataLogs(prev => ([...prev.slice(0,10)]))
        }
        // console.log(realTimeDataLogs)
      },
    )
    let tempEvents = getWebsocket(
      `rule-engine-realTime-events${props.data.id}`,
      `/rule-engine/${props.data.id}/*/event/*`,
      {},
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        let arr: any = {
          message: payload.message,
          time: payload.timestamp
        }
        if(payload.message !== undefined || payload.timestamp !== undefined){
          setRealTimeDataEvents(prev => ([arr, ...prev]));
        }
        if(realTimeDataEvents.length >= 10){
          // console.log('cccc')
          setRealTimeDataEvents(prev => ([...prev.slice(0,10)]))
        }
        // console.log(realTimeDataEvents)
      },
    )

    return () => {
      tempLogs && tempLogs.unsubscribe();
      tempEvents && tempEvents.unsubscribe();
    };
  }, [realTimeDataLogs,realTimeDataEvents])

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
                      key: 'createTime$LIKE'
                    }
                  ]}
                  search={(params: any) => {
                    setSearchParam(params);
                    getDataLogs({ terms: params, pageSize: 10 });
                  }}
                />
              </div>
              <Table dataSource={(dataLogs || {})} rowKey="id" columns={columns} showHeader={false} />
            </div>
            <div className={styles.boxRight}>
              <h4>运行日志：</h4>
              <Table dataSource={(realTimeDataLogs || {})} rowKey="id" columns={columnsRealTime} pagination={false}/>
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
                      key: 'createTime$LIKE'
                    }
                  ]}
                  search={(params: any) => {
                    setSearchParam(params);
                    getDataEvents({ terms: params, pageSize: 10 });
                  }}
                />
              </div>
              <Table dataSource={(dataEvents || {})} rowKey="id" columns={columnsEvents} showHeader={false} />
            </div>
            <div className={styles.boxRight}>
              <h4>运行日志：</h4>
              <Table dataSource={(realTimeDataEvents || {})} rowKey="id" columns={columnsRealTime} pagination={false}/>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default Detail

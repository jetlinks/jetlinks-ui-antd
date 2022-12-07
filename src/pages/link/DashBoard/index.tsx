import { PageContainer } from '@ant-design/pro-layout';
import DashBoard from '@/components/DashBoard';
import { Radio, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useRequest } from 'umi';
import Service from './service';
import moment from 'moment';
import './index.less';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import Echarts, { echarts } from '@/components/DashBoard/echarts';
import { isNoCommunity } from '@/utils/util';

type RefType = {
  getValues: Function;
};
type TopEchartsItemNodeType = {
  value: any;
  max?: any;
  title: string;
  formatter?: string;
  bottom?: string;
};

const service = new Service('dashboard');

const TopEchartsItemNode = (props: TopEchartsItemNodeType) => {
  let formatterCount = 0;
  const options = {
    series: [
      {
        type: 'gauge',
        min: 0,
        max: props.max || 100,
        startAngle: 200,
        endAngle: -20,
        center: ['50%', '65%'],
        title: {
          show: false,
        },
        axisTick: {
          distance: -20,
          lineStyle: {
            width: 1,
            color: 'rgba(0,0,0,0.15)',
          },
        },
        splitLine: {
          distance: -22,
          length: 9,
          lineStyle: {
            width: 1,
            color: '#000',
          },
        },
        axisLabel: {
          distance: -22,
          color: 'auto',
          fontSize: 12,
          width: 30,
          padding: [6, -4, 0, -4],
          formatter: (value: number) => {
            if (value === 0) {
              formatterCount = 0;
            }
            formatterCount += 1;
            if ([1, 3, 6, 9, 11].includes(formatterCount)) {
              return value + (props.formatter || '%');
            }
            return '';
          },
        },
        pointer: {
          length: '80%',
          width: 4,
          itemStyle: {
            color: 'auto',
          },
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 20,
          itemStyle: {
            borderWidth: 3,
            borderColor: '#fff',
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, .25)',
            color: 'auto',
          },
        },
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.25, 'rgba(36, 178, 118, 1)'],
              [
                0.4,
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(66, 147, 255, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(36, 178, 118, 1)',
                  },
                ]),
              ],
              [
                0.5,
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(250, 178, 71, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(66, 147, 255, 1)',
                  },
                ]),
              ],
              [
                1,
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(250, 178, 71, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(247, 111, 93, 1)',
                  },
                ]),
              ],
            ],
          },
        },
        detail: {
          show: false,
        },
        data: [{ value: props.value || 0 }],
      },
    ],
  };

  return (
    <div className={'echarts-item'}>
      <div className={'echarts-item-left'}>
        <div className={'echarts-item-title'}>{props.title}</div>
        <div className={'echarts-item-value'}>
          {props.value}
          {props.formatter || '%'}
        </div>
        {props.bottom && <div className={'echarts-item-bottom'}>{props.bottom}</div>}
      </div>
      <div className={'echarts-item-right'}>
        <>
          {
            // @ts-ignore
            <Echarts options={options} />
          }
        </>
      </div>
    </div>
  );
};

export default () => {
  const [networkOptions, setNetworkOptions] = useState<EChartsOption | undefined>(undefined);
  const [cpuOptions, setCpuOptions] = useState<EChartsOption | undefined>(undefined);
  const [jvmOptions, setJvmOptions] = useState<EChartsOption | undefined>(undefined);
  const [serverId, setServerId] = useState(undefined);
  const [timeToolOptions] = useState([
    { label: '最近1小时', value: 'hour' },
    { label: '今日', value: 'today' },
    { label: '近一周', value: 'week' },
  ]);

  const [topValues, setTopValues] = useState({
    cpu: 0,
    jvm: 0,
    jvmTotal: 0,
    usage: 0,
    usageTotal: 0,
    systemUsage: 0,
    systemUsageTotal: 0,
  });

  const NETWORKRef = useRef<RefType>(); // 网络流量
  const CPURef = useRef<RefType>(); // CPU使用率
  const JVMRef = useRef<RefType>(); // JVM内存使用率

  const [subscribeTopic] = useSendWebsocketMessage();

  const { data: serverNode, run: serverNodeRun } = useRequest(service.serverNode, {
    formatResult: (res) => res.result.map((item: any) => ({ label: item.name, value: item.id })),
    manual: true,
  });

  const arrayReverse = (data: any[]): any[] => {
    const newArray = [];
    for (let i = data.length - 1; i >= 0; i--) {
      newArray.push(data[i]);
    }
    return newArray;
  };

  const getTimeFormat = (type: string) => {
    switch (type) {
      case 'year':
        return 'YYYY-MM-DD';
      case 'month':
      case 'week':
        return 'MM-DD';
      case 'hour':
        return 'HH:mm';
      default:
        return 'HH';
    }
  };

  const getInterval = (type: string) => {
    switch (type) {
      case 'year':
        return '30d';
      case 'month':
      case 'week':
        return '1d';
      case 'hour':
        return '1m';
      default:
        return '1h';
    }
  };

  const handleNetworkOptions = (data: Record<string, any>, xAxis: string[]) => {
    setNetworkOptions({
      xAxis: {
        type: 'category',
        data: xAxis,
        boundaryGap: false,
      },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value) => `${value}M`,
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '50px',
        right: '50px',
      },
      color: ['#979AFF'],
      series: Object.keys(data).length
        ? Object.keys(data).map((key) => ({
            data: data[key]._data.map((item: number) => Number((item / 1024 / 1024).toFixed(2))),
            name: key,
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: 'rgba(151, 154, 255, 0)',
                },
                {
                  offset: 0,
                  color: 'rgba(151, 154, 255, .24)',
                },
              ]),
            },
          }))
        : [
            {
              data: [],
              type: 'line',
            },
          ],
    });
  };

  const handleJVMOptions = (data: Record<string, any>, xAxis: string[]) => {
    setJvmOptions({
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: arrayReverse(xAxis),
      },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value) => `${value}%`,
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '50px',
        right: '30px',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      color: ['#60DFC7'],
      series: Object.keys(data).length
        ? Object.keys(data).map((key) => ({
            data: arrayReverse(data[key]),
            name: key,
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: 'rgba(96, 223, 199, 0)',
                },
                {
                  offset: 0,
                  color: 'rgba(96, 223, 199, .24)',
                },
              ]),
            },
          }))
        : [
            {
              data: [],
              type: 'line',
            },
          ],
    });
  };

  const handleCpuOptions = (data: Record<string, any>, xAxis: string[]) => {
    setCpuOptions({
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: arrayReverse(xAxis),
      },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value) => `${value}%`,
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '50px',
        right: '30px',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      color: ['#2CB6E0'],
      series: Object.keys(data).length
        ? Object.keys(data).map((key) => ({
            data: arrayReverse(data[key]),
            name: key,
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: 'rgba(44, 182, 224, 0)',
                },
                {
                  offset: 0,
                  color: 'rgba(44, 182, 224, .24)',
                },
              ]),
            },
          }))
        : [
            {
              data: [0],
              type: 'line',
            },
          ],
    });
  };

  const getAllEcharts = () => {
    const networkData = NETWORKRef.current!.getValues();
    const cpuData = CPURef.current!.getValues();
    const jvmData = JVMRef.current!.getValues();

    service
      .queryMulti([
        {
          dashboard: 'systemMonitor',
          object: 'network',
          measurement: 'traffic',
          dimension: 'agg',
          group: 'network',
          params: {
            type: networkData.type,
            interval: getInterval(networkData.time.type),
            from: networkData.time.start,
            to: networkData.time.end,
          },
        },
        {
          dashboard: 'systemMonitor',
          object: 'stats',
          measurement: 'info',
          dimension: 'history',
          group: 'cpu',
          params: {
            from: cpuData.time.start,
            to: cpuData.time.end,
          },
        },
        {
          dashboard: 'systemMonitor',
          object: 'stats',
          measurement: 'info',
          dimension: 'history',
          group: 'jvm',
          params: {
            from: jvmData.time.start,
            to: jvmData.time.end,
          },
        },
      ])
      .then((res) => {
        if (res.status === 200) {
          const _networkOptions = {};
          const _networkXAxis = new Set<string>();
          const _jvmOptions = {};
          const _jvmXAxis = new Set<string>();
          const _cpuOptions = {};
          const _cpuXAxis = new Set<string>();
          if (res.result?.length) {
            res.result.forEach((item: any) => {
              const value = item.data.value;
              const nodeID = item.data.clusterNodeId;
              if (item.group === 'network') {
                const _data: any[] = [];
                value.forEach((networkItem: any) => {
                  _data.push(networkItem.value);
                  _networkXAxis.add(networkItem.timeString);
                });
                _networkOptions[nodeID] = {
                  _data: _networkOptions[nodeID]
                    ? _networkOptions[nodeID]._data.concat(_data)
                    : _data,
                };
              } else if (item.group === 'cpu') {
                const memoryJvmHeapFree = value.memoryJvmHeapFree;
                const memoryJvmHeapTotal = value.memoryJvmHeapTotal;
                const _value = (
                  ((memoryJvmHeapTotal - memoryJvmHeapFree) / memoryJvmHeapTotal) *
                  100
                ).toFixed(2);
                if (!_jvmOptions[nodeID]) {
                  _jvmOptions[nodeID] = [];
                }
                _jvmXAxis.add(moment(value.timestamp).format(getTimeFormat(jvmData.time.type)));
                _jvmOptions[nodeID].push(_value);
              } else {
                if (!_cpuOptions[nodeID]) {
                  _cpuOptions[nodeID] = [];
                }
                _cpuXAxis.add(moment(value.timestamp).format(getTimeFormat(cpuData.time.type)));
                _cpuOptions[nodeID].push(Number(value.cpuSystemUsage).toFixed(2));
              }
            });
          }
          handleNetworkOptions(_networkOptions, [..._networkXAxis.keys()]);
          handleJVMOptions(_jvmOptions, [..._jvmXAxis.keys()]);
          handleCpuOptions(_cpuOptions, [..._cpuXAxis.keys()]);
        }
      });
  };

  const getNetworkEcharts = () => {
    const data = NETWORKRef.current!.getValues();

    if (data) {
      service
        .queryMulti([
          {
            dashboard: 'systemMonitor',
            object: 'network',
            measurement: 'traffic',
            dimension: 'agg',
            group: 'network',
            params: {
              type: data.type,
              interval: getInterval(data.time.type),
              from: data.time.start,
              to: data.time.end,
            },
          },
        ])
        .then((res) => {
          if (res.status === 200) {
            const _networkOptions = {};
            const _networkXAxis = new Set<string>();
            if (res.result.length) {
              res.result.forEach((item: any) => {
                const value = item.data.value;
                const _data: any[] = [];
                const nodeID = item.data.clusterNodeId;
                value.forEach((networkItem: any) => {
                  _data.push(networkItem.value);
                  _networkXAxis.add(networkItem.timeString);
                });

                _networkOptions[nodeID] = {
                  _data: _networkOptions[nodeID]
                    ? _networkOptions[nodeID]._data.concat(_data)
                    : _data,
                };
              });
            }
            handleNetworkOptions(_networkOptions, [..._networkXAxis.keys()]);
          }
        });
    }
  };

  const getCPUEcharts = () => {
    const data = CPURef.current!.getValues();
    if (data) {
      service
        .queryMulti([
          {
            dashboard: 'systemMonitor',
            object: 'stats',
            measurement: 'info',
            dimension: 'history',
            group: 'cpu',
            params: {
              from: data.time.start,
              to: data.time.end,
            },
          },
        ])
        .then((res) => {
          if (res.status === 200) {
            const _cpuOptions = {};
            const _cpuXAxis = new Set<string>();
            if (res.result?.length) {
              res.result.forEach((item: any) => {
                const value = item.data.value;
                const nodeID = item.data.clusterNodeId;
                _cpuXAxis.add(moment(value.timestamp).format(getTimeFormat(data.time.type)));
                if (!_cpuOptions[nodeID]) {
                  _cpuOptions[nodeID] = [];
                }
                _cpuOptions[nodeID].push(Number(value.cpuSystemUsage).toFixed(2));
              });
            }
            handleCpuOptions(_cpuOptions, [..._cpuXAxis.keys()]);
          }
        });
    }
  };

  const getJVMEcharts = () => {
    const data = JVMRef.current!.getValues();
    if (data) {
      service
        .queryMulti([
          {
            dashboard: 'systemMonitor',
            object: 'stats',
            measurement: 'info',
            dimension: 'history',
            group: 'jvm',
            params: {
              from: data.time.start,
              to: data.time.end,
            },
          },
        ])
        .then((res) => {
          if (res.status === 200) {
            const _jvmOptions = {};
            const _jvmXAxis = new Set<string>();
            if (res.result?.length) {
              res.result.forEach((item: any) => {
                const value = item.data.value;
                const memoryJvmHeapFree = value.memoryJvmHeapFree;
                const memoryJvmHeapTotal = value.memoryJvmHeapTotal;
                const nodeID = item.data.clusterNodeId;

                const _value = (
                  ((memoryJvmHeapTotal - memoryJvmHeapFree) / memoryJvmHeapTotal) *
                  100
                ).toFixed(2);
                if (!_jvmOptions[nodeID]) {
                  _jvmOptions[nodeID] = [];
                }
                _jvmXAxis.add(moment(value.timestamp).format(getTimeFormat(data.time.type)));
                _jvmOptions[nodeID].push(_value);
              });
            }
            handleJVMOptions(_jvmOptions, [..._jvmXAxis.keys()]);
          }
        });
    }
  };

  useEffect(() => {
    getAllEcharts();
  }, []);

  useEffect(() => {
    const id = 'operations-statistics-system-info-realTime';
    const topic = '/dashboard/systemMonitor/stats/info/realTime';
    const sub = subscribeTopic!(id, topic, {
      type: 'all',
      serverNodeId: serverId,
      interval: '1s',
      agg: 'avg',
    })
      ?.pipe(map((res) => res.payload))
      .subscribe((plyload: any) => {
        const value = plyload.value;
        const cpu = value.cpu;
        const memory = value.memory;
        const disk = value.disk;
        setTopValues({
          cpu: cpu.systemUsage,
          jvm: Number(((memory.jvmHeapUsage / 100) * (memory.jvmHeapTotal / 1024)).toFixed(1)),
          jvmTotal: Math.ceil(memory.jvmHeapTotal / 1024),
          usage: Number(((disk.total / 1024) * (disk.usage / 100)).toFixed(1)),
          usageTotal: Math.ceil(disk.total / 1024),
          systemUsage: Number(
            ((memory.systemTotal / 1024) * (memory.systemUsage / 100)).toFixed(1),
          ),
          systemUsageTotal: Math.ceil(memory.systemTotal / 1024),
        });
      });

    return () => {
      sub?.unsubscribe();
    };
  }, [serverId]);

  useEffect(() => {
    if (isNoCommunity) {
      serverNodeRun();
    }
  }, []);

  useEffect(() => {
    if (serverNode && serverNode.length) {
      setServerId(serverNode[0].value);
    }
  }, [serverNode]);

  return (
    <PageContainer>
      <div className={'link-dash-board'}>
        {serverNode && serverNode.length > 1 ? (
          <div style={{ backgroundColor: '#fff', padding: '24px 24px 0 24px' }}>
            <Select
              value={serverId}
              options={serverNode}
              onChange={(value) => {
                setServerId(value);
              }}
              style={{ width: 300 }}
            />
          </div>
        ) : null}
        <div className={'echarts-items'}>
          <TopEchartsItemNode title={'CPU使用率'} value={topValues.cpu} />
          <TopEchartsItemNode
            title={'JVM内存占用'}
            formatter={'G'}
            value={topValues.jvm}
            max={topValues.jvmTotal}
            bottom={`总JVM内存  ${topValues.jvmTotal}G`}
          />
          <TopEchartsItemNode
            title={'磁盘占用'}
            formatter={'G'}
            value={topValues.usage}
            max={topValues.usageTotal}
            bottom={`总磁盘大小  ${topValues.usageTotal}G`}
          />
          <TopEchartsItemNode
            title={'系统内存占用'}
            formatter={'G'}
            value={topValues.systemUsage}
            max={topValues.systemUsageTotal}
            bottom={`总系统内存  ${topValues.systemUsageTotal}G`}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <DashBoard
            title={'网络流量'}
            ref={NETWORKRef}
            initialValues={{ type: 'bytesRead' }}
            defaultTime={'hour'}
            timeToolOptions={timeToolOptions}
            height={400}
            closeInitialParams={true}
            showTime
            showTimeTool={true}
            extraParams={{
              key: 'type',
              Children: (
                <Radio.Group buttonStyle={'solid'}>
                  <Radio.Button value={'bytesRead'}>上行</Radio.Button>
                  <Radio.Button value={'bytesSent'}>下行</Radio.Button>
                </Radio.Group>
              ),
            }}
            options={networkOptions}
            onParamsChange={getNetworkEcharts}
          />
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <DashBoard
            showTime
            title={'CPU使用率趋势'}
            closeInitialParams={true}
            ref={CPURef}
            height={400}
            defaultTime={'hour'}
            options={cpuOptions}
            timeToolOptions={timeToolOptions}
            onParamsChange={getCPUEcharts}
          />
          <DashBoard
            showTime
            title={'JVM内存使用率趋势'}
            closeInitialParams={true}
            ref={JVMRef}
            height={400}
            defaultTime={'hour'}
            options={jvmOptions}
            timeToolOptions={timeToolOptions}
            onParamsChange={getJVMEcharts}
          />
        </div>
      </div>
    </PageContainer>
  );
};

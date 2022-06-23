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

type RefType = {
  getValues: Function;
};
type TopEchartsItemNodeType = {
  value: any;
  title: string;
};

const service = new Service('dashboard');

const TopEchartsItemNode = (props: TopEchartsItemNodeType) => {
  const options = {
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
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
          distance: -18,
          color: 'auto',
          fontSize: 12,
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
        <div className={'echarts-item-value'}>{props.value}%</div>
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

  const [topValues, setTopValues] = useState({
    cpu: 0,
    jvm: 0,
    usage: 0,
    systemUsage: 0,
  });

  const NETWORKRef = useRef<RefType>(); // 网络流量
  const CPURef = useRef<RefType>(); // CPU使用率
  const JVMRef = useRef<RefType>(); // JVM内存使用率

  const [subscribeTopic] = useSendWebsocketMessage();

  const { data: serverNode } = useRequest(service.serverNode, {
    formatResult: (res) => res.result.map((item: any) => ({ label: item.name, value: item.id })),
  });

  const arrayReverse = (data: any[]): any[] => {
    const newArray = [];
    for (let i = data.length - 1; i >= 0; i--) {
      newArray.push(data[i]);
    }
    return newArray;
  };

  const getInterval = (type: string) => {
    switch (type) {
      case 'year':
        return '30d';
      case 'week':
      case 'month':
        return '1d';
      default:
        return '1h';
    }
  };

  const handleNetworkOptions = (data: Record<string, any>, xAxis: string[]) => {
    setNetworkOptions({
      xAxis: {
        type: 'category',
        data: xAxis,
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '80px',
        right: '2%',
      },
      color: ['#979AFF'],
      series: Object.keys(data).map((key) => ({
        data: data[key]._data,
        name: key,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(151, 154, 255, 0)',
            },
            {
              offset: 1,
              color: 'rgba(151, 154, 255, .24)',
            },
          ]),
        },
      })),
    });
  };

  const handleJVMOptions = (data: Record<string, any>, xAxis: string[]) => {
    setJvmOptions({
      xAxis: {
        type: 'category',
        data: arrayReverse(xAxis),
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '50px',
        right: '2%',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10,
        },
        {
          start: 0,
          end: 10,
        },
      ],
      color: ['#60DFC7'],
      series: Object.keys(data).map((key) => ({
        data: arrayReverse(data[key]),
        name: key,
        type: 'line',
        smooth: true,
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
      })),
    });
  };

  const handleCpuOptions = (data: Record<string, any>, xAxis: string[]) => {
    setCpuOptions({
      xAxis: {
        type: 'category',
        data: arrayReverse(xAxis),
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '50px',
        right: '2%',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10,
        },
        {
          start: 0,
          end: 10,
        },
      ],
      color: ['#2CB6E0'],
      series: Object.keys(data).map((key) => ({
        data: arrayReverse(data[key]),
        name: key,
        type: 'line',
        smooth: true,
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
      })),
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
            interval: getInterval(cpuData.time.type),
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
            interval: getInterval(jvmData.time.type),
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

          res.result.forEach((item: any) => {
            const value = item.data.value;
            const nodeID = item.data.clusterNodeId;
            if (item.group === 'network') {
              const _data: any[] = [];
              value.forEach((networkItem: any) => {
                _data.push(Number(networkItem.value).toFixed(2));
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
              _jvmXAxis.add(moment(value.timestamp).format('YYYY-MM-DD HH:mm:ss'));
              _jvmOptions[nodeID].push(_value);
            } else {
              if (!_cpuOptions[nodeID]) {
                _cpuOptions[nodeID] = [];
              }
              _cpuXAxis.add(moment(value.timestamp).format('YYYY-MM-DD HH:mm:ss'));
              _cpuOptions[nodeID].push(Number(value.cpuSystemUsage).toFixed(2));
            }
          });
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
            res.result.forEach((item: any) => {
              const value = item.data.value;
              const _data: any[] = [];
              const nodeID = item.data.clusterNodeId;
              value.forEach((networkItem: any) => {
                _data.push(Number(networkItem.value).toFixed(2));
                _networkXAxis.add(networkItem.timeString);
              });

              _networkOptions[nodeID] = {
                _data: _networkOptions[nodeID]
                  ? _networkOptions[nodeID]._data.concat(_data)
                  : _data,
              };
            });
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
              interval: getInterval(data.time.type),
            },
          },
        ])
        .then((res) => {
          if (res.status === 200) {
            const _cpuOptions = {};
            const _cpuXAxis = new Set<string>();
            res.result.forEach((item: any) => {
              const value = item.data.value;
              const nodeID = item.data.clusterNodeId;
              _cpuXAxis.add(moment(value.timestamp).format('YYYY-MM-DD HH:mm:ss'));
              if (!_cpuOptions[nodeID]) {
                _cpuOptions[nodeID] = [];
              }
              _cpuOptions[nodeID].push(Number(value.cpuSystemUsage).toFixed(2));
            });
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
              interval: getInterval(data.time.type),
            },
          },
        ])
        .then((res) => {
          if (res.status === 200) {
            const _jvmOptions = {};
            const _jvmXAxis = new Set<string>();
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
              _jvmXAxis.add(moment(value.timestamp).format('YYYY-MM-DD HH:mm:ss'));
              _jvmOptions[nodeID].push(_value);
            });
            handleJVMOptions(_jvmOptions, [..._jvmXAxis.keys()]);
          }
        });
    }
  };

  useEffect(() => {
    if (serverId) {
      getAllEcharts();
    }

    const id = 'operations-statistics-system-info-realTime';
    const topic = '/dashboard/systemMonitor/stats/info/realTime';
    const sub = subscribeTopic!(id, topic, {
      type: 'all',
      serverNodeId: serverId,
      interval: '5s',
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
          jvm: memory.jvmHeapUsage,
          usage: disk.usage,
          systemUsage: memory.systemUsage,
        });
      });

    return () => {
      sub?.unsubscribe();
    };
  }, [serverId]);

  useEffect(() => {
    if (serverNode && serverNode.length) {
      setServerId(serverNode[0].value);
    }
  }, [serverNode]);

  return (
    <PageContainer>
      <div className={'link-dash-board'}>
        {serverNode && serverNode.length ? (
          <Select
            value={serverId}
            options={serverNode}
            onChange={(value) => {
              setServerId(value);
            }}
            style={{ width: 300, marginBottom: 24 }}
          />
        ) : null}
        <div className={'echarts-items'}>
          <TopEchartsItemNode title={'CPU使用率'} value={topValues.cpu} />
          <TopEchartsItemNode title={'JVM内存'} value={topValues.jvm} />
          <TopEchartsItemNode title={'磁盘占用率'} value={topValues.usage} />
          <TopEchartsItemNode title={'磁盘占用率'} value={topValues.systemUsage} />
          {/*<div className={'echarts-item'}>*/}
          {/*  */}
          {/*  <Progress*/}
          {/*    type="circle"*/}
          {/*    strokeWidth={8}*/}
          {/*    width={160}*/}
          {/*    percent={topValues.cpu}*/}
          {/*    format={(percent) => (*/}
          {/*      <div>*/}
          {/*        <div className={'echarts-item-title'}>CPU使用率</div>*/}
          {/*        <div className={'echarts-item-value'}>{percent}%</div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div className={'echarts-item'}>*/}
          {/*  <Progress*/}
          {/*    type="circle"*/}
          {/*    strokeWidth={8}*/}
          {/*    width={160}*/}
          {/*    percent={topValues.jvm}*/}
          {/*    format={(percent) => (*/}
          {/*      <div>*/}
          {/*        <div className={'echarts-item-title'}>JVM内存</div>*/}
          {/*        <div className={'echarts-item-value'}>{percent}%</div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div className={'echarts-item'}>*/}
          {/*  <Progress*/}
          {/*    type="circle"*/}
          {/*    strokeWidth={8}*/}
          {/*    width={160}*/}
          {/*    percent={topValues.usage}*/}
          {/*    format={(percent) => (*/}
          {/*      <div>*/}
          {/*        <div className={'echarts-item-title'}>磁盘占用率</div>*/}
          {/*        <div className={'echarts-item-value'}>{percent}%</div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div className={'echarts-item'}>*/}
          {/*  <Progress*/}
          {/*    type="circle"*/}
          {/*    strokeWidth={8}*/}
          {/*    width={160}*/}
          {/*    percent={topValues.systemUsage}*/}
          {/*    format={(percent) => (*/}
          {/*      <div>*/}
          {/*        <div className={'echarts-item-title'}>系统内存</div>*/}
          {/*        <div className={'echarts-item-value'}>{percent}%</div>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
        <div style={{ marginBottom: 24 }}>
          <DashBoard
            title={'网络流量'}
            ref={NETWORKRef}
            initialValues={{ type: 'bytesSent' }}
            height={400}
            closeInitialParams={true}
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
            defaultTime={'week'}
            options={networkOptions}
            onParamsChange={getNetworkEcharts}
          />
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <DashBoard
            title={'CPU使用率趋势'}
            closeInitialParams={true}
            ref={CPURef}
            height={400}
            defaultTime={'week'}
            options={cpuOptions}
            onParamsChange={getCPUEcharts}
          />
          <DashBoard
            title={'JVM内存使用率趋势'}
            closeInitialParams={true}
            ref={JVMRef}
            height={400}
            defaultTime={'week'}
            options={jvmOptions}
            onParamsChange={getJVMEcharts}
          />
        </div>
      </div>
    </PageContainer>
  );
};

import { PageContainer } from '@ant-design/pro-layout';
import DashBoard from '@/components/DashBoard';
import { Radio, Select, Progress } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useRequest } from 'umi';
import Service from './service';
import moment from 'moment';
import './index.less';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';

type RefType = {
  getValues: Function;
};

const service = new Service('dashboard');

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

  const handleNetworkOptions = (data: Record<string, any>) => {
    setNetworkOptions({
      xAxis: {
        type: 'category',
        data: Object.keys(data),
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '3%',
        right: '2%',
      },
      series: [
        {
          data: Object.values(data),
          type: 'line',
        },
      ],
    });
  };

  const handleJVMOptions = (data: Record<string, any>) => {
    setJvmOptions({
      xAxis: {
        type: 'category',
        data: Object.keys(data).map((item) => {
          return moment(Number(item)).format('YYYY-MM-DD HH:mm:ss');
        }),
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '3%',
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
      series: [
        {
          data: Object.values(data),
          type: 'line',
        },
      ],
    });
  };

  const handleCpuOptions = (data: Record<string, any>) => {
    setCpuOptions({
      xAxis: {
        type: 'category',
        data: Object.keys(data).map((item) => {
          return moment(Number(item)).format('YYYY-MM-DD HH:mm:ss');
        }),
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        left: '3%',
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
      series: [
        {
          data: Object.values(data),
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
            interval: networkData.time.type === 'today' ? '1h' : '1d',
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
          const _jvmOptions = {};
          const _cpuOptions = {};

          res.result.forEach((item: any) => {
            const value = item.data.value;
            if (item.group === 'network') {
              value.forEach((networkItem: any) => {
                _networkOptions[networkItem.timeString] = networkItem.value;
              });
            } else if (item.group === 'cpu') {
              const memoryJvmHeapFree = value.memoryJvmHeapFree;
              const memoryJvmHeapTotal = value.memoryJvmHeapTotal;
              _jvmOptions[value.timestamp] = (
                ((memoryJvmHeapTotal - memoryJvmHeapFree) / memoryJvmHeapTotal) *
                100
              ).toFixed(2);
            } else {
              _cpuOptions[value.timestamp] = value.cpuSystemUsage;
            }
          });
          handleNetworkOptions(_networkOptions);
          handleJVMOptions(_jvmOptions);
          handleCpuOptions(_cpuOptions);
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
              interval: data.time.type === 'today' ? '1h' : '1d',
              from: data.time.start,
              to: data.time.end,
            },
          },
        ])
        .then((res) => {
          if (res.status === 200) {
            const _options = {};
            res.result.forEach((item: any) => {
              const value = item.data.value;
              value.forEach((networkItem: any) => {
                _options[networkItem.timeString] = networkItem.value;
              });
            });
            handleNetworkOptions(_options);
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
            const _options = {};
            res.result.forEach((item: any) => {
              const value = item.data.value;
              _options[value.timestamp] = value.cpuSystemUsage;
            });
            handleCpuOptions(_options);
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
            const _options = {};
            res.result.forEach((item: any) => {
              const value = item.data.value;
              const memoryJvmHeapFree = value.memoryJvmHeapFree;
              const memoryJvmHeapTotal = value.memoryJvmHeapTotal;
              _options[value.timestamp] = (
                ((memoryJvmHeapTotal - memoryJvmHeapFree) / memoryJvmHeapTotal) *
                100
              ).toFixed(2);
            });
            handleJVMOptions(_options);
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
            style={{ width: 300 }}
          />
        ) : null}
        <div className={'echarts-items'}>
          <div className={'echarts-item'}>
            <Progress
              type="circle"
              strokeWidth={8}
              width={160}
              percent={topValues.cpu}
              format={(percent) => (
                <div>
                  <div className={'echarts-item-title'}>CPU使用率</div>
                  <div className={'echarts-item-value'}>{percent}%</div>
                </div>
              )}
            />
          </div>
          <div className={'echarts-item'}>
            <Progress
              type="circle"
              strokeWidth={8}
              width={160}
              percent={topValues.jvm}
              format={(percent) => (
                <div>
                  <div className={'echarts-item-title'}>JVM内存</div>
                  <div className={'echarts-item-value'}>{percent}%</div>
                </div>
              )}
            />
          </div>
          <div className={'echarts-item'}>
            <Progress
              type="circle"
              strokeWidth={8}
              width={160}
              percent={topValues.usage}
              format={(percent) => (
                <div>
                  <div className={'echarts-item-title'}>磁盘占用率</div>
                  <div className={'echarts-item-value'}>{percent}%</div>
                </div>
              )}
            />
          </div>
          <div className={'echarts-item'}>
            <Progress
              type="circle"
              strokeWidth={8}
              width={160}
              percent={topValues.systemUsage}
              format={(percent) => (
                <div>
                  <div className={'echarts-item-title'}>系统内存</div>
                  <div className={'echarts-item-value'}>{percent}%</div>
                </div>
              )}
            />
          </div>
        </div>
        <div>
          <DashBoard
            title={'网络流量'}
            ref={NETWORKRef}
            initialValues={{ type: 'bytesSent' }}
            height={400}
            closeInitialParams={true}
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
        <div style={{ display: 'flex' }}>
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

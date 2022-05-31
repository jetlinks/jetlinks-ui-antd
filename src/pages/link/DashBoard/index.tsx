import { PageContainer } from '@ant-design/pro-layout';
import DashBoard from '@/components/DashBoard';
import { Radio, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useRequest } from 'umi';
import Service from './service';

type RefType = {
  getValues: Function;
};

const service = new Service('dashboard');

export default () => {
  const [networkOptions] = useState<EChartsOption | undefined>(undefined);
  const [cpuOptions] = useState<EChartsOption | undefined>(undefined);
  const [jvmOptions] = useState<EChartsOption | undefined>(undefined);
  const [serverId, setServerId] = useState(undefined);

  const NETWORKRef = useRef<RefType>(); // 网络流量
  const CPURef = useRef<RefType>(); // CPU使用率
  const JVMRef = useRef<RefType>(); // JVM内存使用率

  const { data: serverNode } = useRequest(service.serverNode, {
    formatResult: (res) => res.result.map((item: any) => ({ label: item.name, value: item.id })),
  });

  const getNetworkEcharts = () => {
    const data = NETWORKRef.current!.getValues();
    if (data) {
      service.queryMulti([
        {
          dashboard: 'systemMonitor',
          object: 'network',
          measurement: 'traffic',
          dimension: 'agg',
          group: 'network',
          params: {
            type: data.type,
            from: data.time.start,
            to: data.time.end,
          },
        },
      ]);
    }
  };

  const getCPUEcharts = () => {
    const data = CPURef.current!.getValues();
    if (data) {
      service.queryMulti([
        {
          dashboard: 'systemMonitor',
          object: 'stats',
          measurement: 'traffic',
          dimension: 'agg',
          group: 'cpu',
          params: {
            from: data.time.start,
            to: data.time.end,
          },
        },
      ]);
    }
  };

  const getJVMEcharts = () => {
    const data = CPURef.current!.getValues();
    if (data) {
      service.queryMulti([
        {
          dashboard: 'systemMonitor',
          object: 'stats',
          measurement: 'traffic',
          dimension: 'agg',
          group: 'jvm',
          params: {
            from: data.time.start,
            to: data.time.end,
          },
        },
      ]);
    }
  };

  useEffect(() => {
    if (serverId) {
      getNetworkEcharts();
    }
  }, [serverId]);

  useEffect(() => {
    if (serverNode && serverNode.length) {
      setServerId(serverNode[0].value);
    }
  }, [serverNode]);

  return (
    <PageContainer>
      <div>
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

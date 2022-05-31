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
  const [options, setOptions] = useState<EChartsOption>({});
  const [serverId, setServerId] = useState(undefined);

  const NETWORKRef = useRef<RefType>(); // 网络流量
  const CPURef = useRef<RefType>(); // CPU使用率
  const JVMRef = useRef<RefType>(); // JVM内存使用率

  const { data: serverNode } = useRequest(service.serverNode, {
    formatResult: (res) => res.result.map((item: any) => ({ label: item.name, value: item.id })),
  });

  const getFormValues = () => {
    const data = NETWORKRef.current!.getValues();
    console.log(data);
  };

  const getEcharts = async (data: any) => {
    console.log(data);
    setOptions({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    });
  };

  useEffect(() => {
    if (serverId) {
      getFormValues();
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
            options={options}
            onParamsChange={getEcharts}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <DashBoard
            title={'CPU使用率趋势'}
            closeInitialParams={true}
            ref={CPURef}
            height={400}
            defaultTime={'week'}
            options={options}
            onParamsChange={getEcharts}
          />
          <DashBoard
            title={'JVM内存使用率趋势'}
            closeInitialParams={true}
            ref={JVMRef}
            height={400}
            defaultTime={'week'}
            options={options}
            onParamsChange={getEcharts}
          />
        </div>
      </div>
    </PageContainer>
  );
};

import { PageContainer } from '@ant-design/pro-layout';
import DashBoard from '@/components/DashBoard';
import { Radio } from 'antd';
import { useState } from 'react';
import type { EChartsOption } from 'echarts';

export default () => {
  const [options, setOptions] = useState<EChartsOption>({});

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

  return (
    <PageContainer>
      <div>
        <div>
          <DashBoard
            title={'网络流量'}
            initialValues={{ test: false }}
            height={400}
            extraParams={{
              key: 'test',
              Children: (
                <Radio.Group buttonStyle={'solid'}>
                  <Radio.Button value={true}>上行</Radio.Button>
                  <Radio.Button value={false}>下行</Radio.Button>
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
            initialValues={{ test: false }}
            height={400}
            defaultTime={'week'}
            options={options}
            onParamsChange={getEcharts}
          />
          <DashBoard
            title={'JVM内存使用率趋势'}
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

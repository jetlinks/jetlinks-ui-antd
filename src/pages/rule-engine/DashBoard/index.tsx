import { PageContainer } from '@ant-design/pro-layout';
import { EChartsOption } from 'echarts';
import { useState } from 'react';
import { Statistic, StatisticCard } from '@ant-design/pro-card';
import { Card, Select } from 'antd';
import './index.less';
import Header from '@/components/DashBoard/header';
import Echarts from '@/components/DashBoard/echarts';

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};

const Dashboard = () => {
  const [options, setOptions] = useState<EChartsOption>({});

  const getEcharts = async (params: any) => {
    // 请求数据
    console.log(params);

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
      <div style={{ display: 'flex' }}>
        <StatisticCard
          title="今日告警"
          statistic={{
            value: 75,
            suffix: '次',
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/PmKfn4qvD/mubiaowancheng-lan.svg"
              width="100%"
              alt="进度条"
            />
          }
          footer={
            <>
              <Statistic value={15.1} title="当月告警" suffix="次" layout="horizontal" />
            </>
          }
          style={{ width: '24%', marginRight: '5px' }}
        />
        <StatisticCard
          statistic={{
            title: '告警配置',
            value: 2176,
            icon: (
              <img
                style={imgStyle}
                src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                alt="icon"
              />
            ),
          }}
          style={{ width: '25%', marginRight: '5px' }}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Statistic value={76} title="正常" suffix="次" layout="horizontal" />
              <Statistic value={76} title="禁用" suffix="次" layout="horizontal" />
            </div>
          }
        />
        <div style={{ width: '50%' }}>
          <StatisticCard
            title="最新告警"
            statistic={{
              // title: '最新告警'
              value: undefined,
            }}
            chart={
              <ul>
                {[
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '1极告警',
                  },
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '1极告警',
                  },
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '1极告警',
                  },
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '1极告警',
                  },
                ].map((item) => (
                  <li>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>{item.dateTime}</div>
                      <div>{item.name}</div>
                      <div>{item.product}</div>
                      <div>{item.level}</div>
                    </div>
                  </li>
                ))}
              </ul>
            }
          />
        </div>
      </div>
      <Card style={{ marginTop: 10 }}>
        <div
          // className={classNames(Style['dash-board-echarts'], className)}
          style={{
            height: 200,
          }}
        >
          <Header
            title={'告警统计'}
            extraParams={{
              key: 'test',
              Children: (
                <Select
                  options={[
                    { label: '设备', value: 'device' },
                    { label: '产品', value: 'product' },
                  ]}
                ></Select>
              ),
            }}
            onParamsChange={getEcharts}
          />
          <Echarts options={options} />
        </div>
      </Card>
    </PageContainer>
  );
};
export default Dashboard;

import { PageContainer } from '@ant-design/pro-layout';
import { EChartsOption } from 'echarts';
import { useEffect, useRef, useState } from 'react';
import { Card, Col } from 'antd';
import './index.less';
import Service from './service';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import DashBoard, { DashBoardTopCard } from '@/components/DashBoard';
import { FireOutlined } from '@ant-design/icons';
import styles from './index.less';
import moment from 'moment';

const service = new Service();
export const state = model<{
  today: number;
  thisMonth: number;
  config: number;
  enabledConfig: number;
  disabledConfig: number;
  alarmList: any[];
}>({
  today: 0,
  thisMonth: 0,
  config: 0,
  enabledConfig: 0,
  disabledConfig: 0,
  alarmList: [],
});

type DashboardItem = {
  group: string;
  data: Record<string, any>;
};

type RefType = {
  getValues: Function;
};
const Dashboard = observer(() => {
  const [options, setOptions] = useState<EChartsOption>({});

  // 今日告警
  const today = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: 'today',
    params: {
      time: '1d',
      targetType: 'device',
      format: 'HH:mm:ss',
      from: moment(new Date(new Date().setHours(0, 0, 0, 0))).format('YYYY-MM-DD HH:mm:ss'),
      to: 'now',
      // limit: 24,
    },
  };
  // 当月告警
  const thisMonth = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: 'thisMonth',
    params: {
      time: '1M',
      targetType: 'device',
      format: 'yyyy-MM',
      limit: 1,
      from: 'now-1M',
    },
  };
  // 告警趋势
  const chartData = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: 'alarmTrend',
    params: {
      time: '1M',
      targetType: 'device', // product、device、org、other
      from: 'now-1y', // now-1d、now-1w、now-1M、now-1y
      format: 'M月',
      to: 'now',
      limit: 12,
    },
  };
  // 告警排名
  const order = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'rank',
    dimension: 'agg',
    group: 'alarmRank',
    params: {
      time: '1h',
      targetType: 'device',
      from: 'now-1w',
      to: 'now',
      limit: 10,
    },
  };

  const getDashboard = async () => {
    const resp = await service.dashboard([today, thisMonth, order]);
    if (resp.status === 200) {
      const _data = resp.result as DashboardItem[];
      state.today = _data.find((item) => item.group === 'today')?.data.value;
      state.thisMonth = _data.find((item) => item.group === 'thisMonth')?.data.value;
    }
  };

  const getAlarmConfig = async () => {
    const countResp = await service.getAlarmConfigCount({});
    const enabledResp = await service.getAlarmConfigCount({
      terms: [
        {
          column: 'state',
          value: 'enabled',
        },
      ],
    });
    const disabledResp = await service.getAlarmConfigCount({
      terms: [
        {
          column: 'state',
          value: 'disabled',
        },
      ],
    });
    if (countResp.status === 200) {
      state.config = countResp.result;
    }
    if (enabledResp.status === 200) {
      state.enabledConfig = enabledResp.result;
    }
    if (disabledResp.status === 200) {
      state.disabledConfig = disabledResp.result;
    }
  };

  useEffect(() => {
    getDashboard();
    getAlarmConfig();
  }, []);

  const getEcharts = async () => {
    // 请求数据
    const resp = await service.dashboard([chartData]);

    if (resp.status === 200) {
      const xData: string[] = [];
      const sData: number[] = [];
      resp.result.forEach((item: any) => {
        xData.push(item.data.timeString);
        sData.push(item.data.value);
      });
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: xData.reverse(),
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: sData.reverse(),
          },
        ],
      });
    }
  };

  const alarmCountRef = useRef<RefType>();
  return (
    <PageContainer>
      <div className={'alarm-dash-board'}>
        <DashBoardTopCard>
          <DashBoardTopCard.Item
            title="今日告警"
            value={state.today}
            footer={[{ title: '当月告警', value: state.thisMonth, status: 'success' }]}
            span={6}
          >
            <img src={require('/public/images/media/dashboard-1.png')} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title="告警配置"
            value={state.config}
            footer={[
              { title: '正常', value: state.enabledConfig, status: 'success' },
              { title: '禁用', value: state.disabledConfig, status: 'error' },
            ]}
            span={6}
          >
            <img src={require('/public/images/media/dashboard-1.png')} />
          </DashBoardTopCard.Item>

          <Col span={12}>
            <div className={'dash-board-top-item'}>
              <div className={'content-left'}>
                <div className={'content-left-title'}>最新告警</div>
                <div>
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
                    ].map((item) => (
                      <li>
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', margin: 10 }}
                        >
                          <div>
                            <FireOutlined style={{ marginRight: 5 }} /> {item.dateTime}
                          </div>
                          <div>{item.name}</div>
                          <div>{item.product}</div>
                          <div>{item.level}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </DashBoardTopCard>
      </div>
      <Card style={{ marginTop: 10 }}>
        <DashBoard
          title="告警统计"
          height={400}
          options={options}
          onParamsChange={getEcharts}
          ref={alarmCountRef}
          echartsAfter={
            <div className={styles.alarmRank}>
              <h4>告警排名</h4>
              <ul className={styles.rankingList}>
                {[
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '543',
                  },
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '3445',
                  },
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '123123',
                  },
                  {
                    dateTime: '2022-01-01 00:00:00',
                    name: '一楼烟感告警',
                    product: '产品',
                    level: '3123',
                  },
                ].map((item, i) => (
                  <li key={item.dateTime}>
                    <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                      {i + 1}
                    </span>
                    <span className={styles.rankingItemTitle} title={item.name}>
                      {item.name}
                    </span>
                    <span className={styles.rankingItemValue}>{item.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
      </Card>
    </PageContainer>
  );
});
export default Dashboard;

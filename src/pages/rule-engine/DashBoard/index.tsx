import { PageContainer } from '@ant-design/pro-layout';
import { EChartsOption } from 'echarts';
import { useEffect, useRef, useState } from 'react';
import { Badge, Card, Col, Tooltip, Select } from 'antd';
import './index.less';
import Service from './service';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import DashBoard, { DashBoardTopCard } from '@/components/DashBoard';
import styles from './index.less';
import moment from 'moment';
import Echarts from '@/components/DashBoard/echarts';
import encodeQuery from '@/utils/encodeQuery';

const service = new Service();
export const state = model<{
  today: number;
  thisMonth: number;
  config: number;
  enabledConfig: number;
  disabledConfig: number;
  alarmList: any[];
  ranking: { targetId: string; targetName: string; count: number }[];
  fifteenOptions: any;
}>({
  today: 0,
  thisMonth: 0,
  config: 0,
  enabledConfig: 0,
  disabledConfig: 0,
  alarmList: [],
  ranking: [],
  fifteenOptions: {},
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
      time: '1h',
      // targetType: 'device',
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
      time: '1d',
      // targetType: 'device',
      format: 'yyyy-MM',
      limit: 1,
      from: 'now-1M',
    },
  };

  const fifteen = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: '15day',
    params: {
      time: '1d',
      format: 'yyyy-MM-dd',
      targetType: 'product',
      from: 'now-15d',
      to: 'now',
      limit: 15,
    },
  };

  const getDashboard = async () => {
    const resp = await service.dashboard([today, thisMonth, fifteen]);
    if (resp.status === 200) {
      const _data = resp.result as DashboardItem[];
      state.today = _data.find((item) => item.group === 'today')?.data.value;
      state.thisMonth = _data.find((item) => item.group === 'thisMonth')?.data.value;

      const fifteenData = _data.filter((item) => item.group === '15day').map((item) => item.data);
      state.fifteenOptions = {
        xAxis: {
          type: 'category',
          data: fifteenData.map((item) => item.timeString),
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        grid: {
          top: '2%',
          bottom: 0,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        series: [
          {
            name: '告警数',
            data: fifteenData.map((item) => item.value),
            type: 'bar',
            itemStyle: {
              color: '#2F54EB',
            },
          },
        ],
      };
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

  const getCurrentAlarm = async () => {
    const alarmLevel = await service.getAlarmLevel();
    const sorts = { alarmTime: 'desc' };
    const currentAlarm = await service.getAlarm(encodeQuery({ sorts }));
    if (currentAlarm.status === 200) {
      if (alarmLevel.status === 200) {
        const levels = alarmLevel.result.levels;
        state.alarmList = currentAlarm.result?.data.map((item: { level: any }) => ({
          ...item,
          levelName: levels.find((l: any) => l.level === item.level)?.title,
        }));
      } else {
        state.alarmList = currentAlarm.result?.data;
      }
    }
  };
  useEffect(() => {
    getDashboard();
    getAlarmConfig();
    getCurrentAlarm();
  }, []);

  const getEcharts = async (params: any) => {
    let time = '1h';
    let format = 'HH';
    if (params.time.type === 'week' || params.time.type === 'month') {
      time = '1d';
      format = 'M月dd日';
    } else if (params.time.type === 'year') {
      time = '1M';
      format = 'yyyy年-M月';
    }

    // 告警趋势
    const chartData = {
      dashboard: 'alarm',
      object: 'record',
      measurement: 'trend',
      dimension: 'agg',
      group: 'alarmTrend',
      params: {
        targetType: params.targetType, // product、device、org、other
        format: format,
        time: time,
        // from: 'now-1y', // now-1d、now-1w、now-1M、now-1y
        // to: 'now',
        limit: 12,
        // time: params.time.type === 'today' ? '1h' : '1d',
        from: moment(params.time.start).format('YYYY-MM-DD HH:mm:ss'),
        to: moment(params.time.end).format('YYYY-MM-DD HH:mm:ss'),
        // limit: 30,
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
        // time: '1h',
        time: time,
        targetType: params.targetType,
        from: moment(params.time.start).format('YYYY-MM-DD HH:mm:ss'),
        to: moment(params.time.end).format('YYYY-MM-DD HH:mm:ss'),
        limit: 9,
      },
    };
    // 请求数据
    const resp = await service.dashboard([chartData, order]);

    if (resp?.status === 200) {
      const xData: string[] = [];
      const sData: number[] = [];
      resp.result
        .filter((item: any) => item.group === 'alarmTrend')
        .forEach((item: any) => {
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

      state.ranking = resp.result
        ?.filter((item: any) => item.group === 'alarmRank')
        .map((d: { data: { value: any } }) => d.data?.value)
        .sort((a: { count: number }, b: { count: number }) => b.count - a.count);
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
            <Echarts options={state.fifteenOptions} />
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
                <div className={'new-alarm-items'}>
                  <ul>
                    {state.alarmList.slice(0, 3).map((item) => (
                      <li key={item.id}>
                        <div className={'new-alarm-item'}>
                          <div className={'new-alarm-item-time'}>
                            <img src={require('/public/images/alarm/bashboard.png')} alt="" />
                            {moment(item.alarmTime).format('YYYY-MM-DD hh:mm:ss')}
                          </div>
                          <div className={'new-alarm-item-content ellipsis'}>
                            <Tooltip title={item.alarmName}>{item.alarmName}</Tooltip>
                          </div>
                          <div className={'new-alarm-item-state'}>
                            <Badge
                              status={item.state?.value === 'warning' ? 'error' : 'default'}
                              text={
                                <span
                                  className={item.state?.value === 'warning' ? 'error' : 'default'}
                                >
                                  {item.state?.text}
                                </span>
                              }
                            />
                          </div>
                          <div className={`new-alarm-item-level level-${item.level}`}>
                            {item.levelName}
                          </div>
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
          height={600}
          showTimeTool={true}
          options={options}
          initialValues={{
            targetType: 'device',
          }}
          extraParams={{
            key: 'targetType',
            Children: (
              <Select
                options={[
                  { label: '设备', value: 'device' },
                  { label: '产品', value: 'product' },
                  { label: '部门', value: 'org' },
                  { label: '其它', value: 'other' },
                ]}
              />
            ),
          }}
          onParamsChange={getEcharts}
          ref={alarmCountRef}
          defaultTime={'week'}
          echartsAfter={
            <div className={styles.alarmRank}>
              <h4>告警排名</h4>
              <ul className={styles.rankingList}>
                {state.ranking?.map((item, i) => (
                  <li key={item.targetId}>
                    <img
                      src={require(`/public/images/rule-engine/dashboard/ranking/${i + 1}.png`)}
                      alt=""
                    />
                    {/*<span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>*/}
                    {/*  {i + 1}*/}
                    {/*</span>*/}
                    <span className={styles.rankingItemTitle} title={item.targetName}>
                      {item.targetName}
                    </span>
                    <span className={styles.rankingItemValue}>{item.count}</span>
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

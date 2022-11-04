import DashBoard, { DashBoardTopCard } from '@/components/DashBoard';
import Echarts from '@/components/DashBoard/echarts';
import { DatePicker, Progress, Empty } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import { service } from '@/pages/iot-card/CardManagement';
import type { EChartsOption } from 'echarts';
import classNames from 'classnames';

const DefaultEchartsOptions: any = {
  yAxis: {
    type: 'value',
    show: false,
  },
  grid: {
    top: '7%',
    left: '2%',
    right: '5%',
    bottom: 20,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
};

const Dashboard = () => {
  const [options, setOptions] = useState<EChartsOption>({});
  const [dayOptions, setDayOptions] = useState<EChartsOption>({});
  const [monthOptions, setMonthOptions] = useState<EChartsOption>({});
  const [yearOptions, setYearOptions] = useState<EChartsOption>({});
  const [dayTotal, setDayTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [yearTotal, setYearTotal] = useState(0);
  const [topList, setTopList] = useState<any[]>([]);
  const [topTotal, setTotal] = useState(0);
  const echartsRef = useRef<any>();

  const getData = (start: number, end: number): Promise<{ xValue: any[]; data: any[] }> => {
    return new Promise((resolve) => {
      service
        .queryFlow(start, end, {
          orderBy: 'date',
        })
        .then((resp) => {
          if (resp.status === 200) {
            const sortArray = resp.result.sort(
              (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            resolve({
              xValue: sortArray.map((item: any) => item.date),
              data: sortArray.map((item: any) => item.value && item.value.toFixed(2)),
            });
          }
        });
    });
  };

  const getDataTotal = () => {
    const dTime = [
      moment(new Date()).startOf('day').valueOf(),
      moment(new Date()).endOf('day').valueOf(),
    ];
    const mTime = [moment().startOf('month').valueOf(), moment().endOf('month').valueOf()];
    const yTime = [moment().startOf('year').valueOf(), moment().endOf('year').valueOf()];
    const grid: any = {
      top: '2%',
      left: '0',
      right: 0,
      bottom: 0,
    };
    getData(dTime[0], dTime[1]).then((resp) => {
      setDayTotal(resp.data.reduce((r, n) => r + n, 0));
      setDayOptions({
        ...DefaultEchartsOptions,
        grid,
        xAxis: {
          type: 'category',
          data: resp.xValue,
          show: false,
        },
        series: [
          {
            name: '流量',
            data: resp.data,
            type: 'line',
            color: '#FBA500',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#FBA500', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
    getData(mTime[0], mTime[1]).then((resp) => {
      setMonthTotal(resp.data.reduce((r, n) => r + n, 0));
      setMonthOptions({
        ...DefaultEchartsOptions,
        grid,
        xAxis: {
          type: 'category',
          data: resp.xValue,
          show: false,
        },
        series: [
          {
            name: '流量',
            data: resp.data,
            type: 'line',
            color: '#498BEF',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#498BEF', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
    getData(yTime[0], yTime[1]).then((resp) => {
      setYearTotal(resp.data.reduce((r, n) => r + n, 0));
      setYearOptions({
        ...DefaultEchartsOptions,
        grid,
        xAxis: {
          type: 'category',
          data: resp.xValue,
          show: false,
        },
        series: [
          {
            name: '流量',
            data: resp.data,
            type: 'line',
            color: '#58E1D3',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#58E1D3', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
  };

  const getEcharts = (data: any) => {
    console.log(data);
    let startTime = data.time.start;
    let endTime = data.time.end;
    if (data.time.type === 'week' || data.time.type === 'month') {
      startTime = moment(data.time.start).startOf('days').valueOf();
      endTime = moment(data.time.end).startOf('days').valueOf();
    }
    getData(startTime, endTime).then((resp) => {
      setOptions({
        ...DefaultEchartsOptions,
        xAxis: {
          type: 'category',
          data: resp.xValue,
        },
        series: [
          {
            name: '流量统计',
            data: resp.data,
            type: 'line',
            color: '#498BEF',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#498BEF', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
  };

  const getTopRang = (star: number, end: number) => {
    service
      .queryFlow(star, end, {
        orderBy: 'usage',
      })
      .then((resp) => {
        if (resp.status === 200) {
          const arr = resp.result.slice(0, 10).sort((a: any, b: any) => b.value - a.value);
          setTotal(arr.length ? arr[0].value : 0);
          setTopList(arr);
          // const testArr = new Array(10).fill(1).map((item, index) => {
          //   return {
          //     cardNum: '123123123123' + index,
          //     value: 50 + index
          //   }
          // })
          // setTotal(60)
          // setTopList(testArr as any[]);
        }
      });
  };

  useEffect(() => {
    getDataTotal();

    getEcharts(echartsRef?.current?.getValues());

    const dTime = [
      moment().subtract(6, 'days').startOf('day').valueOf(),
      moment().endOf('day').valueOf(),
    ];
    getTopRang(dTime[0], dTime[1]);
  }, []);

  return (
    <PageContainer>
      <div className={'iot-card-dash-board'}>
        <DashBoardTopCard>
          <DashBoardTopCard.Item
            title="昨日流量消耗"
            value={
              <>
                <span>{dayTotal.toFixed(2)}</span>
                <span>M</span>
              </>
            }
            footer={false}
            span={8}
          >
            <Echarts options={dayOptions} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title="当月流量消耗"
            value={
              <>
                <span>{monthTotal.toFixed(2)}</span>
                <span>M</span>
              </>
            }
            footer={false}
            span={8}
          >
            <Echarts options={monthOptions} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title="本年流量消耗"
            value={
              <>
                <span>{yearTotal.toFixed(2)}</span>
                <span>M</span>
              </>
            }
            footer={false}
            span={8}
          >
            <Echarts options={yearOptions} />
          </DashBoardTopCard.Item>
        </DashBoardTopCard>
      </div>
      <div className={styles['total-echarts']}>
        <div className={styles['total-echarts-left']}>
          <DashBoard
            title="流量统计"
            height={604}
            showTimeTool={true}
            ref={echartsRef}
            options={options}
            onParamsChange={getEcharts}
            defaultTime={'week'}
            timeToolOptions={[
              { label: '昨日', value: 'yesterday' },
              { label: '近一周', value: 'week' },
              { label: '近一月', value: 'month' },
            ]}
          />
        </div>
        <div className={styles['total-echarts-right']}>
          <div className={styles.topName} style={{ height: 50 }}>
            <span>流量使用TOP10</span>
            <div>
              {
                // @ts-ignore
                <DatePicker.RangePicker
                  defaultValue={[moment().subtract(6, 'days'), moment(new Date(), 'YYYY-MM-DD')]}
                  format={'YYYY-MM-DD'}
                  onChange={(dates) => {
                    getTopRang(
                      dates?.[0].startOf('days').valueOf(),
                      dates?.[1].endOf('days').valueOf(),
                    );
                  }}
                />
              }
            </div>
          </div>
          <div className={styles.rankingList} style={{ height: 490 }}>
            {topList.length ? (
              topList.map((item: any, index) => {
                return (
                  <div className={styles.rankItem} key={item.cardNum}>
                    <div className={classNames(styles.number, styles[`number-item-${index + 1}`])}>
                      {index + 1}
                    </div>
                    <div className={styles.cardNum}>{item.cardNum}</div>
                    <div className={styles.progress}>
                      <Progress
                        strokeColor={'#ADC6FF'}
                        trailColor={'#E0E4E8'}
                        strokeLinecap="butt"
                        showInfo={false}
                        percent={Math.ceil((item.value / topTotal) * 100)}
                      />
                    </div>
                    <div className={styles.total}>{item?.value?.toFixed(2)} M</div>
                  </div>
                );
              })
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
export default Dashboard;

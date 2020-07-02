import React, {useEffect, useState} from 'react';
import {Col, Icon, Row, Tooltip} from 'antd';
import {FormattedMessage} from 'umi-plugin-react/locale';
import Charts, {Gauge} from './Charts';
import numeral from 'numeral';
import {IVisitData} from '../data.d';
import GaugeColor from './Charts/GaugeColor/index';
import apis from '@/services';
import moment from 'moment';
import {getWebsocket} from '@/layouts/GlobalWebSocket';


const {ChartCard, MiniArea, MiniBar, Field} = Charts;

interface State {
  cpu: number;
  memoryMax: number;
  memoryUsed: number;
  messageData: any[];
  sameDay: number;
  month: number;
  metadata: any;
  eventData: any[];
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {marginBottom: 24},
};

const IntroduceRow = ({loading, visitData}: { loading: boolean; visitData: IVisitData[] }) => {
  const initState: State = {
    cpu: 0,
    memoryMax: 0,
    memoryUsed: 0,
    messageData: [],
    sameDay: 0,
    month: 0,
    metadata: {},
    eventData: [],
  };

  const [cpu, setCpu] = useState(initState.cpu);
  const [memoryMax, setMemoryMax] = useState(initState.memoryMax);
  const [memoryUsed, setMemoryUsed] = useState(initState.memoryUsed);
  const [sameDay, setSameDay] = useState(initState.sameDay);
  const [month, setMonth] = useState(initState.month);
  const [deviceOnline, setDeviceOnline] = useState(initState.month);
  const [deviceCount, setDeviceCount] = useState(initState.month);
  const [deviceNotActive, setDeviceNotActive] = useState(initState.month);
  const [messageData] = useState(initState.messageData);

  const calculationDate = () => {
    const dd = new Date();
    dd.setDate(dd.getDate() - 30);
    const y = dd.getFullYear();
    const m = (dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}` : (dd.getMonth() + 1);
    const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate();
    return `${y}-${m}-${d} 00:00:00`;
  };

  const deviceMessage = () => {
    const list = [
      {
        'dashboard': 'device',
        'object': 'message',
        'measurement': 'quantity',
        'dimension': 'agg',
        'group': 'sameDay',
        'params': {
          'time': '1d',
          'format': 'yyyy-MM-dd',
        },
      },
      {
        'dashboard': 'device',
        'object': 'message',
        'measurement': 'quantity',
        'dimension': 'agg',
        'group': 'sameMonth',
        'params': {
          'limit': 30,
          'time': '1d',
          'format': 'yyyy-MM-dd',
          'from': calculationDate(),
        },
      },
      {
        'dashboard': 'device',
        'object': 'message',
        'measurement': 'quantity',
        'dimension': 'agg',
        'group': 'month',
        'params': {
          'time': '1M',
          'format': 'yyyy-MM-dd',
          'from': calculationDate(),
        },
      },
    ];
    apis.analysis.getMulti(list)
      .then((response: any) => {
        const tempResult = response?.result;
        if (response.status === 200) {
          tempResult.forEach((item: any) => {
            switch (item.group) {
              case 'sameDay':
                setSameDay(item.data.value);
                break;
              case 'month':
                setMonth(item.data.value);
                break;
              case 'sameMonth':
                messageData.push(
                  {
                    'x': moment(new Date(item.data.timeString)).format('YYYY-MM-DD'),
                    'y': Number(item.data.value),
                  });
                break;
              default:
                break;
            }
          });
        }
      });
  };

  const deviceStatus = () => {
    const list = [
      // 设备状态信息-在线
      {
        'dashboard': 'device',
        'object': 'status',
        'measurement': 'record',
        'dimension': 'current',
        'group': 'deviceOnline',
        'params': {
          'state': 'online',
        },
      },// 设备状态信息-总数
      {
        'dashboard': 'device',
        'object': 'status',
        'measurement': 'record',
        'dimension': 'current',
        'group': 'deviceCount',
      },// 设备状态信息-未激活
      {
        'dashboard': 'device',
        'object': 'status',
        'measurement': 'record',
        'dimension': 'current',
        'group': 'deviceNotActive',
        'params': {
          'state': 'notActive',
        },
      },// 设备状态信息-历史在线
      {
        'dashboard': 'device',
        'object': 'status',
        'measurement': 'record',
        'dimension': 'aggOnline',
        'group': 'aggOnline',
        'params': {
          'limit': 20,
          'time': '1d',
          'format': 'yyyy-MM-dd',
        },
      },
    ];
    apis.analysis.getMulti(list)
      .then((response: any) => {
        const tempResult = response?.result;
        if (response.status === 200) {
          tempResult.forEach((item: any) => {
            switch (item.group) {
              case 'aggOnline':
                visitData.push(
                  {
                    'x': moment(new Date(item.data.timeString)).format('YYYY-MM-DD'),
                    'y': Number(item.data.value),
                  });
                break;
              case 'deviceOnline':
                setDeviceOnline(item.data.value);
                break;
              case 'deviceCount':
                setDeviceCount(item.data.value);
                break;
              case 'deviceNotActive':
                setDeviceNotActive(item.data.value);
                break;
              default:
                break;
            }
          });
        }
      });
  };

  useEffect(() => {
    deviceStatus();
    deviceMessage();

    let tempCup = getWebsocket(
      `home-page-statistics-cpu-realTime`,
      `/dashboard/systemMonitor/cpu/usage/realTime`,
      {
        params: {
          'history': 1,
        },
      },
    ).subscribe(
      (resp: any) => {
        const {payload} = resp;
        setCpu(payload.value);
      },
    );

    let tempJvm = getWebsocket(
      `home-page-statistics-jvm-realTime`,
      `/dashboard/jvmMonitor/memory/info/realTime`,
      {
        params: {
          'history': 1,
        },
      },
    ).subscribe(
      (resp: any) => {
        const {payload} = resp;
        setMemoryMax(payload.value.max);
        setMemoryUsed(payload.value.used);
      },
    );

    return () => {
      tempCup && tempCup.unsubscribe();
      tempJvm && tempJvm.unsubscribe();
    };
  }, []);

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title='当前在线'
          action={
            <Tooltip
              title='刷新'
            >
              <Icon type="sync" onClick={() => {
                deviceStatus();
              }}/>
            </Tooltip>
          }
          total={numeral(deviceOnline).format('0,0')}
          footer={
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
              <Field style={{marginRight: 80, float: 'left'}}
                     label={
                       <FormattedMessage id="analysis.analysis.device-total" defaultMessage="设备总量"/>
                     }
                     value={numeral(deviceCount).format('0,0')}
              />
              <Field
                label={
                  <FormattedMessage id="analysis.analysis.device-activation" defaultMessage="未激活设备"/>
                }
                value={numeral(deviceNotActive).format('0,0')}
              />
            </div>
          }
          contentHeight={46}
        >
          <MiniBar data={visitData}/>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="analysis.analysis.device-day-visits" defaultMessage="日访消息量"/>}
          action={
            <Tooltip
              title='刷新'
            >
              <Icon type="sync" onClick={() => {
                deviceMessage();
              }}/>
            </Tooltip>
          }
          total={numeral(sameDay).format('0,0')}
          footer={
            <Field
              label={
                <FormattedMessage id="analysis.analysis.device-visits" defaultMessage="当月设备消息量"/>
              }
              value={numeral(month).format('0,0')}
            />
          }
          contentHeight={46}
        >
          <MiniArea color="#975FE4" data={messageData}/>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title='CPU使用率'
          contentHeight={120}
        >
          <GaugeColor height={169} percent={cpu}/>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title='JVM内存'
          contentHeight={120}
        >
          <Gauge height={169} percent={memoryUsed} memoryMax={memoryMax}/>
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;

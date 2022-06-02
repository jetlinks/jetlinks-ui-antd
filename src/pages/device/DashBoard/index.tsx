import { PageContainer } from '@ant-design/pro-layout';
import { Card, Badge } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './index.less';
import Service from './service';
import encodeQuery from '@/utils/encodeQuery';
import { useRequest } from 'umi';
import DashBoard from '@/components/DashBoard';
import type { EChartsOption } from 'echarts';
import Echarts from '@/components/DashBoard/echarts';
import moment from 'moment';
import { AMap } from '@/components';
import { Marker } from 'react-amap';
import { EnvironmentOutlined } from '@ant-design/icons';

interface TopCardProps {
  isEcharts: boolean;
  title: string;
  total?: number | string;
  topRender?: any;
  bottomRender: () => React.ReactNode;
}

type RefType = {
  getValues: Function;
};

const service = new Service('device/instance');
const TopCard = (props: TopCardProps) => {
  return (
    <div className={'top-card-item'}>
      {props.isEcharts ? (
        <div className={'top-card-top'}>
          <div className={'top-card-top-charts'}>
            <div>{props.title}</div>
            <div className={'top-card-top-charts-total'}>{props.total}</div>
            <div style={{ height: 45, width: '100%' }}>{props.topRender}</div>
          </div>
        </div>
      ) : (
        <div className={'top-card-top'}>
          <div className={'top-card-top-left'}></div>
          <div className={'top-card-top-right'}>
            <div className={'top-card-title'}>{props.title}</div>
            <div className={'top-card-total'}>{props.total}</div>
          </div>
        </div>
      )}

      <div className={'top-card-bottom'}>{props.bottomRender()}</div>
    </div>
  );
};

const DeviceBoard = () => {
  const [deviceOnline, setDeviceOnline] = useState(0);
  const [deviceOffline, setDeviceOffline] = useState(0);
  const [productPublish, setProductPublish] = useState(0);
  const [productUnPublish, setProductUnPublish] = useState(0);
  const [options, setOptions] = useState<EChartsOption>({});
  const [onlineOptions, setOnlineOptions] = useState<EChartsOption>({});
  const [yesterdayCount, setYesterdayCount] = useState(0);
  const [deviceOptions, setDeviceOptions] = useState<EChartsOption>({});
  const [month, setMonth] = useState(0);
  const [point, setPoint] = useState([]);

  const ref = useRef<RefType>();

  const { data: deviceTotal } = useRequest(service.deviceCount, {
    formatResult: (res) => res.result,
  });
  const { data: productTotal } = useRequest(service.productCount, {
    defaultParams: [{}],
    formatResult: (res) => res.result,
  });

  //设备数量
  const deviceStatus = async () => {
    const onlineRes = await service.deviceCount(encodeQuery({ terms: { state: 'online' } }));
    if (onlineRes.status === 200) {
      setDeviceOnline(onlineRes.result);
    }
    const offlineRes = await service.deviceCount(encodeQuery({ terms: { state: 'offline' } }));
    if (offlineRes.status === 200) {
      setDeviceOffline(offlineRes.result);
    }
  };

  //产品数量
  const productStatus = async () => {
    const pusblish = await service.productCount({
      terms: [
        {
          column: 'state',
          value: '1',
        },
      ],
    });
    if (pusblish.status === 200) {
      setProductPublish(pusblish.result);
    }
    const unpublish = await service.productCount({
      terms: [
        {
          column: 'state',
          value: '0',
        },
      ],
    });
    if (unpublish.status === 200) {
      setProductUnPublish(unpublish.result);
    }
  };

  //当前在线
  const getOnline = async () => {
    const res = await service.dashboard([
      {
        dashboard: 'device',
        object: 'status',
        measurement: 'record',
        dimension: 'aggOnline',
        group: 'aggOnline',
        params: {
          state: 'online',
          limit: 15,
          from: 'now-15d',
          time: '1d',
        },
      },
    ]);
    if (res.status === 200) {
      const x = res.result.map((item: any) => item.data.timeString);
      const y = res.result.map((item: any) => item.data.value);
      setYesterdayCount(y?.[1]);
      setOnlineOptions({
        xAxis: {
          type: 'category',
          data: x,
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data: y,
            type: 'bar',
          },
        ],
      });
    }
  };
  //今日设备消息量
  const getDevice = async () => {
    const res = await service.dashboard([
      {
        dashboard: 'device',
        object: 'message',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'today',
        params: {
          time: '1h',
          format: 'yyyy-MM-dd HH:mm:ss',
          limit: 24,
          from: 'now-1d',
        },
      },
      {
        dashboard: 'device',
        object: 'message',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'thisMonth',
        params: {
          time: '1M',
          format: 'yyyy-MM',
          limit: 1,
          from: 'now-1M',
        },
      },
    ]);
    if (res.status === 200) {
      const thisMonth = res.result.find((item: any) => item.group === 'thisMonth').data.value;
      setMonth(thisMonth);
      const today = res.result.filter((item: any) => item.group !== 'thisMonth');
      const x = today.map((item: any) => item.data.timeString);
      const y = today.map((item: any) => item.data.value);
      setDeviceOptions({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false,
          data: x,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data: y,
            type: 'line',
            areaStyle: {},
          },
        ],
      });
    }
  };

  const getEcharts = async () => {
    const data = ref.current!.getValues();
    if (data) {
      console.log(Math.ceil((data.time.end - data.time.start) / (1 * 24 * 3600 * 1000) + 1));
      const res = await service.dashboard([
        {
          dashboard: 'device',
          object: 'message',
          measurement: 'quantity',
          dimension: 'agg',
          group: 'device_msg',
          params: {
            time: '1d',
            format: 'yyyy.MM.dd',
            limit: Math.ceil((data.time.end - data.time.start) / (1 * 24 * 3600 * 1000) + 1),
            from: moment(data.time.start).format('yyyy-MM-DD'),
            to: moment(data.time.end).format('yyyy-MM-DD'),
          },
        },
      ]);
      if (res.status === 200) {
        const x = res.result.map((item: any) => item.data.timeString);
        const y = res.result.map((item: any) => item.data.value);
        setOptions({
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: y,
              type: 'line',
              areaStyle: {},
            },
          ],
        });
      }
    }
  };
  //地图数据
  const geo = async (data?: any) => {
    const res = await service.getGeo(data);
    if (res.status === 200) {
      console.log(res.result.features);
      setPoint(res.result.features);
    }
  };

  useEffect(() => {
    deviceStatus();
    productStatus();
    getOnline();
    getDevice();
    geo({});
  }, []);

  return (
    <PageContainer>
      <div className={'device-dash-board'}>
        <Card className={'top-card-items'} bodyStyle={{ display: 'flex', gap: 12 }}>
          <TopCard
            title={'产品数量'}
            total={productTotal}
            isEcharts={false}
            bottomRender={() => (
              <>
                <Badge status="success" text="已发布" />
                <span style={{ padding: '0 4px' }}>{productPublish}</span>
                <Badge status="error" text="未发布" />{' '}
                <span style={{ padding: '0 4px' }}>{productUnPublish}</span>
              </>
            )}
          />
          <TopCard
            title={'设备数量'}
            total={deviceTotal}
            isEcharts={false}
            bottomRender={() => (
              <>
                <Badge status="success" text="在线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOnline}</span>
                <Badge status="error" text="离线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOffline}</span>
              </>
            )}
          />
          <TopCard
            title={'当前在线'}
            total={22}
            isEcharts={true}
            topRender={
              <div style={{ height: 56 }}>
                <Echarts options={onlineOptions} />
              </div>
            }
            bottomRender={() => <>昨日在线：{yesterdayCount} </>}
          />
          <TopCard
            title={'今日设备消息量'}
            total={2221}
            isEcharts={true}
            topRender={
              <div style={{ height: 56 }}>
                <Echarts options={deviceOptions} />
              </div>
            }
            bottomRender={() => <>当月设备消息量：{month} </>}
          />
        </Card>
        <DashBoard
          title={'设备消息'}
          options={options}
          // closeInitialParams={true}
          ref={ref}
          height={500}
          defaultTime={'week'}
          onParamsChange={getEcharts}
        />
        <Card style={{ marginTop: 10 }}>
          <div>设备分布</div>
          <div>
            <AMap
              AMapUI
              style={{
                height: 500,
                width: '100%',
              }}
            >
              {point.map((item: any) => (
                //@ts-ignore
                <Marker
                  position={{
                    longitude: item.geometry.coordinates?.[0],
                    latitude: item.geometry.coordinates?.[1],
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        backgroundColor: '#666666',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: 5,
                      }}
                    >
                      {item.properties.deviceName}
                    </div>
                    <div>
                      <EnvironmentOutlined style={{ color: 'blue', fontSize: 22 }} />
                    </div>
                  </div>
                </Marker>
              ))}
            </AMap>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
export default DeviceBoard;

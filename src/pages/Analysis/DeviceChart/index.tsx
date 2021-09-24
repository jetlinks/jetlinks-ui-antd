import { StatisticCard } from '@ant-design/pro-card';
import { service } from '@/pages/Analysis';
import { useEffect } from 'react';
import { groupBy, map } from 'rxjs/operators';
import { mergeMap, of, toArray, zip } from 'rxjs';
import moment from 'moment';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { Column } from '@ant-design/charts';
import { Badge, Col, Row } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

type DeviceChartType = {
  deviceOnline: number;
  aggOnline: Record<string, any>[];
  deviceCount: number;
  deviceNotActive: number;
};
const DeviceChartModel = model<DeviceChartType>({
  deviceCount: 0,
  aggOnline: [],
  deviceOnline: 0,
  deviceNotActive: 0,
});
const DeviceChart = observer(() => {
  const getDeviceData = () => {
    const requestParams = [
      // 设备状态信息-在线
      {
        dashboard: 'device',
        object: 'status',
        measurement: 'record',
        dimension: 'current',
        group: 'deviceOnline',
        params: {
          state: 'online',
        },
      }, // 设备状态信息-总数
      {
        dashboard: 'device',
        object: 'status',
        measurement: 'record',
        dimension: 'current',
        group: 'deviceCount',
      }, // 设备状态信息-未激活
      {
        dashboard: 'device',
        object: 'status',
        measurement: 'record',
        dimension: 'current',
        group: 'deviceNotActive',
        params: {
          state: 'notActive',
        },
      }, // 设备状态信息-历史在线
      {
        dashboard: 'device',
        object: 'status',
        measurement: 'record',
        dimension: 'aggOnline',
        group: 'aggOnline',
        params: {
          limit: 20,
          time: '1d',
          format: 'yyyy-MM-dd',
        },
      },
    ];
    service
      .getMulti(requestParams)
      .pipe(
        mergeMap(
          (item) =>
            item.result as {
              group: string;
              data: Record<string, any>;
              formatData?: { x: unknown; y: unknown };
            }[],
        ),
        groupBy((item) => item.group),
        mergeMap((group$) =>
          zip(
            of(group$.key),
            group$.pipe(
              map((item) =>
                item.group === 'aggOnline'
                  ? {
                      x: moment(new Date(item.data.timeString)).format('YYYY-MM-DD'),
                      y: Number(item.data.value),
                    }
                  : item.data.value,
              ),
              toArray(),
            ),
          ),
        ),
        map((item) =>
          item[0] === 'aggOnline' ? [item[0], item[1].reverse()] : [item[0], ...item[1]],
        ),
      )
      .subscribe((data) => {
        // eslint-disable-next-line prefer-destructuring
        DeviceChartModel[data[0]] = data[1];
      });
  };

  useEffect(() => {
    getDeviceData();
  }, []);

  return (
    <StatisticCard
      title="设备统计"
      extra={<SyncOutlined onClick={() => getDeviceData()} />}
      chart={
        <Column
          width={200}
          height={180}
          xField="x"
          yField="y"
          label={{
            position: 'middle',
            style: {
              fill: '#FFFFFF',
              opacity: 0.6,
            },
          }}
          xAxis={{
            label: {
              autoHide: true,
              autoRotate: false,
            },
          }}
          meta={{
            x: { alias: '日期' },
            y: { alias: '数量' },
          }}
          data={DeviceChartModel.aggOnline}
        />
      }
      footer={
        <Row>
          <Col span={8}>
            <>
              {' '}
              <Badge status="warning" text="未激活" />
              {DeviceChartModel.deviceNotActive}
            </>
          </Col>
          <Col span={8}>
            <>
              {' '}
              <Badge status="processing" text="总数" />· {DeviceChartModel.deviceCount}
            </>
          </Col>
          <Col span={8}>
            <>
              <Badge status="success" text="在线" /> {DeviceChartModel.deviceOnline}
            </>
          </Col>
        </Row>
      }
    />
  );
});

export default DeviceChart;

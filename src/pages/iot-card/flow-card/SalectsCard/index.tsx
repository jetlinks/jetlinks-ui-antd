import React, { useEffect, useState } from 'react';
import { Card, Col, Radio, Row } from 'antd';
import styles from '../style.less';
import apis from '@/services';
import moment from 'moment';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";

export interface State {
  gatewayDataList: any[];
  ticksDataList: any[];
  currentTime: string;
}

const SalectsCard = ({ loading, id }: { loading: boolean; id: string }) => {
  let gatewayMonitor: (dataNum: string) => void;
  const initState: State = {
    gatewayDataList: [],
    ticksDataList: [],
    currentTime: '',
  };

  const [gatewayData, setGatewayData] = useState(initState.gatewayDataList);
  const [ticksDataList, setTicksDataList] = useState(initState.ticksDataList);

  useEffect(() => {
    gatewayMonitor('7');
  }, []);

  gatewayMonitor = (dateNum: string) => {
    apis.flowCard.queryDateNum(id, dateNum)
      .then((response: any) => {
        const tempResult = response?.result;
        if (response.status === 200) {
          const dataList: any[] = [];
          const ticksList: any[] = [];
          tempResult.forEach((item: any) => {
            dataList.push({
              year: moment(item.date).format('MM-DD'),
              value: item.usage,
              type: '流量'
            });
            ticksList.push(moment(item.date,).format('MM-DD'));
          });
          setTicksDataList(ticksList);
          setGatewayData(dataList);
        }
      });
  };

  function deviceTime(e: any) {
    const value = e.target.value;
    gatewayMonitor(value);
  }

  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <div style={{ marginBottom: 8, fontWeight: 'bolder' }}>流量统计</div>
            <div className={styles.salesExtraWrap} style={{ marginBottom: 16 }}>
              <div className={styles.salesExtra}>
                <Radio.Group defaultValue="7" buttonStyle="solid" onChange={deviceTime}>
                  <Radio.Button value="7">
                    近7天流量
                  </Radio.Button>
                  <Radio.Button value="30">
                    近30天流量
                  </Radio.Button>
                  <Radio.Button value="365">
                    近一年流量
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <Row>
              <Col>
                <div className={styles.salesBar}>
                  <Chart
                    height={400}
                    data={gatewayData}
                    scale={{
                      value: { min: 0 },
                      year: {
                        range: [0, 1],
                        ticks: ticksDataList,
                      },
                    }}
                    forceFit
                  >
                    <Axis name="year" />
                    <Axis name="value" label={{
                      formatter: val => parseFloat(val).toLocaleString()
                    }} />
                    <Legend />
                    <Tooltip crosshairs={{ type: 'y' }} />
                    <Geom type="line" position="year*value*type" size={2}
                      tooltip={[
                        "year*value*type",
                        (year, value, type) => ({
                          title: year,
                          name: type,
                          value: parseFloat(value).toLocaleString()
                        })
                      ]}
                    />
                  </Chart>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default SalectsCard;

import React, { useEffect, useState } from 'react';
import { Card, Col, DatePicker, message, Radio, Row, Tabs } from 'antd';
import styles from '../style.less';
import { ISalesData } from '../data';
import Grouped from './Charts/Grouped/index';
import apis from '@/services';
import { State } from '@/pages/analysis/components/SalesCard';
import moment from 'moment';
import Select from 'antd/es/select';

const { TabPane } = Tabs;

export interface State {
  gatewayDataList: any[];
  ticksDataList: any[];
  currentTime: string;
  time: string;
  selectionTime: string;
  productDataList: any[];
  defaultList: any[];
  dataList: ISalesData[];
  state: string;
  productId: any[];
  productData: any;
}

const TopSearch = ({ loading }: { loading: boolean; }) => {

  let gatewayMonitor: (from: string, to: string, time: string, productId: any[]) => void;

  const initState: State = {
    gatewayDataList: [],
    ticksDataList: [],
    currentTime: '',
    time: '',
    selectionTime: '',
    productDataList: [],
    defaultList: [],
    dataList: [],
    state: '',
    productId: [],
    productData: {},
  };

  const [productDataList, setProductDataList] = useState(initState.productDataList);
  const [defaultList, setDefaultList] = useState(initState.defaultList);
  const [dataList, setDataList] = useState(initState.dataList);
  const [stateType, setState] = useState(initState.state);
  const [productId, setProductId] = useState(initState.productId);
  const [productData, setProductData] = useState(initState.productData);

  const [gatewayData, setGatewayData] = useState(initState.gatewayDataList);
  const [ticksDataList, setTicksDataList] = useState(initState.ticksDataList);
  const [time, setTime] = useState(initState.time);
  const [selectionTime, setSelectionTime] = useState(initState.selectionTime);

  const calculationDate = (val: number) => {
    const dd = new Date();
    dd.setDate(dd.getDate() - val);
    return `${dd.getFullYear()}-${(dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}` : (dd.getMonth() + 1)}-${dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()} ${dd.getHours() < 10 ? `0${dd.getHours()}` : dd.getHours()}:${dd.getMinutes() < 10 ? `0${dd.getMinutes()}` : dd.getMinutes()}:${dd.getSeconds() < 10 ? `0${dd.getSeconds()}` : dd.getSeconds()}`;
  };

  const timeMap = {
    '1h': '1m',
    '1d': '24m',
    '7d': '168m',
    '30d': '12h',
  };

  useEffect(() => {
    apis.deviceProdcut
      .queryNoPagin()
      .then(response => {
        const tempResult = response?.result;
        if (tempResult) {
          let list = [];
          for (let i = 0; i < tempResult.length; i++) {
            productData[tempResult[i].id] = tempResult[i].name;
            productDataList.push(<Select.Option key={tempResult[i].id}>{tempResult[i].name}</Select.Option>);
            if (i < 6) {
              list.push(tempResult[i].id);
              setDefaultList(defaultList.push(tempResult[i].id));
            }
          }
          setProductId(list);
          let da = new Date();
          da.setHours(da.getHours() - 1);
          setSelectionTime(calculationDate(0));
          setTime('1m');

          gatewayMonitor(formatData(da), calculationDate(0), '1m',defaultList);
        }
      })
      .catch(() => {
      });
  }, []);

  gatewayMonitor = (from, to, time, productId) => {

    let formatData = '';

    if (time === '1m') {
      formatData = 'HH时mm分';
    } else if (time === '12h') {
      formatData = 'MM月dd日HH时';
    } else {
      formatData = 'MM月dd日HH时mm分';
    }
    const list = [];
    productId.forEach(item => {
      list.push({
        'dashboard': 'device',
        'object': 'message',
        'measurement': 'quantity',
        'dimension': 'agg',
        'group': item,
        'params': {
          'productId': item,
          'time': time || '1m',
          'format': formatData,
          'from': from,
          'to': to,
        },
      });
    });

    apis.analysis.getMulti(list)
      .then((response: any) => {
        const tempResult = response?.result;
        if (tempResult) {
          const dataList = [];
          tempResult.forEach(item => {
            dataList.push({
              label: productData[item.group],
              消息量: item.data.value
            });
          });
          setGatewayData(dataList);
        }
      });
  };

  function handleChange(value) {
    if (value.length > 6) {
      message.error('设备型号最多只能勾选6个');
      return false;
    }
    setProductId(value);
    const dd = new Date(selectionTime);
    gatewayMonitor(formatData(dd), formatData(new Date()), time, value);
  }

  function deviceTime(e) {
    const value = e.target.value;
    setTime(timeMap[value]);
    const dd = new Date(selectionTime);

    if (value === '1h') {
      dd.setHours(dd.getHours() - 1);
    } else if (value === '1d') {
      dd.setDate(dd.getDate() - 1);
    } else if (value === '7d') {
      dd.setDate(dd.getDate() - 7);
    } else if (value === '30d') {
      dd.setDate(dd.getDate() - 30);
    }
    gatewayMonitor(formatData(dd), formatData(new Date()), timeMap[value], productId);
  }

  const formatData = (value: string) => {
    const dd = new Date(value);
    return `${dd.getFullYear()}-${(dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}` : (dd.getMonth() + 1)}-${dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()} ${dd.getHours() < 10 ? `0${dd.getHours()}` : dd.getHours()}:${dd.getMinutes() < 10 ? `0${dd.getMinutes()}` : dd.getMinutes()}:${dd.getSeconds() < 10 ? `0${dd.getSeconds()}` : dd.getSeconds()}`;
  };

  function onOk(value) {
    setSelectionTime(value);
    const dd = new Date(value);
    if (time === '1m') {
      dd.setHours(dd.getHours() - 1);
    } else if (time === '24m') {
      dd.setDate(dd.getDate() - 1);
    } else if (time === '168m') {
      dd.setDate(dd.getDate() - 7);
    } else if (time === '12h') {
      dd.setDate(dd.getDate() - 30);
    }
    gatewayMonitor(formatData(dd), formatData(value), time, productId);
  }

  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0, marginTop: 24 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <Radio.Group defaultValue="1h" onChange={deviceTime}>
                  <Radio.Button value="1h">
                    1小时
                  </Radio.Button>
                  <Radio.Button value="1d">
                    1天
                  </Radio.Button>
                  <Radio.Button value="7d">
                    7天
                  </Radio.Button>
                  <Radio.Button value="30d">
                    30天
                  </Radio.Button>
                </Radio.Group>
              </div>
              <DatePicker showTime defaultValue={moment(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                          placeholder="结束时间" onOk={onOk} format="YYYY-MM-DD HH:mm:ss"/>
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={'设备消息量'}
            key="sales"
          >
            <Row>
              <div>
                <Select mode="tags" defaultValue={defaultList} maxTagTextLength={3}
                        maxTagCount={3}
                        style={{ width: '50%', float: 'right', marginBottom: 32, marginRight: 25 }}
                        placeholder="设备型号" onChange={handleChange}>
                  {productDataList}
                </Select>
              </div>
              <Col>
                <div className={styles.salesBar} style={{ marginTop: 30 }}>
                  <Grouped
                    height={300}
                    title={
                      '连接数量'
                    }
                    data={gatewayData}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default TopSearch;

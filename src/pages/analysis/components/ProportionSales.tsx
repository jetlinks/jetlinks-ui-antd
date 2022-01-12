import React, { useEffect, useState } from 'react';
import { message, Card, Radio } from 'antd';
import Charts from './Charts';
import styles from '../style.less';
import { ISalesData } from '../data.d';
import apis from '@/services';
import Select from 'antd/es/select';
import encodeQueryParam from '@/utils/encodeParam';

const { Pie } = Charts;

export interface State {
  productDataList: any[];
  defaultList: any[];
  dataList: ISalesData[];
  state:string;
  productId:any[];
  productData:any;
}

const ProportionSales = ({ loading, }: { loading: boolean; }) => {

  const initState: State = {
    productDataList: [],
    defaultList: [],
    dataList: [],
    state:"",
    productId:[],
    productData:{},
  };
  const [productDataList] = useState(initState.productDataList);
  const [defaultList, setDefaultList] = useState(initState.defaultList);
  const [dataList, setDataList] = useState(initState.dataList);
  const [stateType, setState] = useState(initState.state);
  const [productId, setProductId] = useState(initState.productId);
  const [productData] = useState(initState.productData);

  const deviceStatus = (prodcutList:any, stateType) => {
    const list = [];
    prodcutList.forEach((item:any) => {
      list.push({
        'dashboard': 'device',
        'object': 'status',
        'measurement': 'record',
        'dimension': 'current',
        'group': item,
        'params': {
          'productId': item,
          'state': stateType,
        },
      });
    });
    apis.analysis.getMulti(list)
      .then((response: any) => {
        const tempResult = response?.result;
        if (response.status === 200) {
          const list = [];
          tempResult.forEach((item:any) => {
            list.push({
              x: productData[item.group],
              y: item.data.value,
            });
          });
          setDataList(list);
        }
      });
  };

  useEffect(() => {
    apis.deviceProdcut
      .queryNoPagin(encodeQueryParam({
        paging: false,
      }))
      .then(response => {
        const tempResult = response?.result;
        if (response.status === 200) {
          const list = [];
          for (let i = 0; i < tempResult.length; i++) {
            productData[tempResult[i].id] = tempResult[i].name;
            productDataList.push(<Select.Option key={tempResult[i].id}>{tempResult[i].name}</Select.Option>);
            if (i < 6) {
              list.push(tempResult[i].id);
              setDefaultList(defaultList.push(tempResult[i].id));
            }
          }
          setProductId(list);
          deviceStatus(defaultList, '');
        }
      })
      .catch(() => {
      });
  }, []);


  function handleChange(value:any) {
    if (value.length > 6){
      message.error('产品最多只能勾选6个');
      return false;
    }
    setProductId(value);
    deviceStatus(value, stateType);
  }

  function onChange(e:any) {
    let val: string = "";
    if (e.target.value !== 'all') {
      val = e.target.value;
    }
    setState(val);
    deviceStatus(productId, val);
  }

  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title='各产品设备占比'
      bodyStyle={{ padding: 24 }}
      extra={
        <div className={styles.salesCardExtra}>
          <div className={styles.salesTypeRadio}>
            <Radio.Group onChange={onChange} defaultValue="all">
              <Radio.Button value="all">
                全部设备
              </Radio.Button>
              <Radio.Button value="online">
                在线
              </Radio.Button>
              <Radio.Button value="offline">
                离线
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
      }
      style={{ marginTop: 24 }}
    >
      <div
        style={{
          minHeight: 360,
        }}
      >
        <div>
          <Select mode="tags" defaultValue={defaultList} maxTagTextLength={3}
                  maxTagCount={3}
                  style={{ width: '50%', float: 'right', marginBottom: 32 }}
                  placeholder="产品" onChange={handleChange}>
            {productDataList}
          </Select>
        </div>
        <div>
          <h4 style={{ marginTop: 8, marginBottom: 32, width: '40%' }}>
            数量统计
          </h4>
          <Pie
            hasLegend
            subTitle='总设备数'
            total={() => <span>{dataList.reduce((pre, now) => now.y + pre, 0)}</span>}
            data={dataList}
            valueFormat={value => <span>{value}</span>}
            height={265}
            lineWidth={4}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProportionSales;

import React from 'react';
import { Card, Radio } from 'antd';
import Charts from './Charts';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from '../style.less';
import Yuan from '../utils/Yuan';
import { RadioChangeEvent } from 'antd/es/radio';
import { ISalesData } from '../data';

const { Pie } = Charts;

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: ISalesData[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={
        '各类型设备占比'
      }
      bodyStyle={{ padding: 24 }}
      extra={
        <div className={styles.salesCardExtra}>
          {dropdownGroup}
          <div className={styles.salesTypeRadio}>
            <Radio.Group value={salesType} onChange={handleChangeSalesType}>
              <Radio.Button value="all">
                全部设备
              </Radio.Button>
              <Radio.Button value="online">
                网关
              </Radio.Button>
              <Radio.Button value="stores">
                设备
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
      }
      style={{ marginTop: 24 }}
    >
      <div
        style={{
          minHeight: 380,
        }}
      >
        <h4 style={{ marginTop: 8, marginBottom: 32 }}>
          数量统计
        </h4>
        <Pie
          hasLegend
          subTitle={'总设备数'}
          total={() => <span>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</span>}
          data={salesPieData}
          valueFormat={value => <span>{value}</span>}
          height={248}
          lineWidth={4}
        />
      </div>
    </Card>
  );
};

export default ProportionSales;

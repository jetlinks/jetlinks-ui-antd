import React from 'react';
import { Row, Col, Card, Tabs, DatePicker, Radio } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import Charts from './Charts';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { ISalesData } from '../data';
import styles from '../style.less';

const { Bar } = Charts;

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData: { title: string; total: number }[] = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'analysis.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const TestDemo = ({
   rangePickerValue,
   salesData,
   isActive,
   handleRangePickerChange,
   loading,
   selectDate,
 }: {
  rangePickerValue: RangePickerValue;
  isActive: (key: 'today' | 'week' | 'month' | 'year') => string;
  salesData: ISalesData[];
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: 'today' | 'week' | 'month' | 'year') => void;
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <Radio.Group defaultValue="all">
                <Radio.Button value="all">
                  全部设备
                </Radio.Button>
                <Radio.Button value="online">
                  在线
                </Radio.Button>
                <Radio.Button value="stores">
                  离线
                </Radio.Button>
              </Radio.Group>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{ width: 256 }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      >
        <TabPane
          tab={'设备数量'}
          key="sales"
        >
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <h4 className={styles.rankingTitle}>
                  物联网设备连接排行
                </h4>
                <Bar
                  height={295}
                  title={
                    '连接数量'
                  }
                  data={salesData}
                />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default TestDemo;

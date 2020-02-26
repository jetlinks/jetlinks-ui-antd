import React from 'react';
import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from '../style.less';
import { ISalesData } from '../data';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import Grouped from './Charts/Grouped/index';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const TopSearch = ({
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
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0,marginTop: 24 }}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <a className={isActive('today')} onClick={() => selectDate('today')}>
                <FormattedMessage id="analysis.analysis.all-day" defaultMessage="All Day"/>
              </a>
              <a className={isActive('week')} onClick={() => selectDate('week')}>
                <FormattedMessage id="analysis.analysis.all-week" defaultMessage="All Week"/>
              </a>
              <a className={isActive('month')} onClick={() => selectDate('month')}>
                <FormattedMessage id="analysis.analysis.all-month" defaultMessage="All Month"/>
              </a>
              <a className={isActive('year')} onClick={() => selectDate('year')}>
                <FormattedMessage id="analysis.analysis.all-year" defaultMessage="All Year"/>
              </a>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{ width: 200 }}
            />
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
            <Col>
              <div className={styles.salesBar}>
                <Grouped
                  height={400}
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

export default TopSearch;

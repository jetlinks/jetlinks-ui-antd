import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';
import PageLoading from './components/PageLoading';
import { Dispatch } from 'redux';
import { IAnalysisData } from './data.d';
import { GridContent } from '@ant-design/pro-layout';
import getFakeChartData from './mock-data';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

interface analysisProps {
  analysis: IAnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface analysisState {
  salesType: 'all' | 'online' | 'stores';
  currentTabKey: string;
  rangePickerValue: RangePickerValue;
}

@connect(
  ({
    analysis,
    loading,
  }: {
    analysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    analysis,
    loading: loading.effects['analysis/fetch'],
  }),
)
class Analysis extends Component<analysisProps, analysisState> {
  state: analysisState = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };
  reqRef!: number;
  timeoutId!: number;
  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'analysis/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'analysis/fetchSalesData',
    });
  };

  selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'analysis/fetchSalesData',
    });
  };

  isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { loading } = this.props;
    const {
      visitData,
      messageData,
    } = getFakeChartData;

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={visitData} messageData={messageData}/>
          </Suspense>
          <Suspense fallback={null}>
            <SalesCard
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              loading={loading}
              selectDate={this.selectDate}
            />
          </Suspense>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  loading={loading}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                />
              </Suspense>
            </Col>
          </Row>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;

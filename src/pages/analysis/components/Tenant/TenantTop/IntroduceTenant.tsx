import React, {useEffect, useState} from 'react';
import {Avatar, Col, Icon, Row, Spin, Tooltip} from 'antd';
import {FormattedMessage} from 'umi-plugin-react/locale';
import numeral from 'numeral';
import apis from '@/services';
import Charts from '../../Charts';
import AutoHide from "../../Hide/autoHide";
import AlarmImg from "./img/alarm.png";
import DeviceImg from "./img/device.png";
import MessagesImg from "./img/messages.png";
import ProductImg from "./img/product.png";
import encodeQueryParam from "@/utils/encodeParam";

const {ChartCard, Field} = Charts;

interface State {
  productCount: any;
  deviceCount: any;
  alarmCount: any;
  messageCount: any;
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {marginBottom: 24},
};

const IntroduceTenant = ({}: {}) => {
  const initState: State = {
    messageCount: {},
    productCount: {},
    alarmCount: {},
    deviceCount: {},
  };


  const [deviceCount, setDeviceCount] = useState(initState.deviceCount);
  const [alarmCount, setAlarmCount] = useState(initState.alarmCount);
  const [productCount, setProductCount] = useState(initState.productCount);
  const [messageCount, setMessageCount] = useState(initState.messageCount);

  const queryDeviceCount = () => {
    let map = {
      offlineCount: 0,
      onlineCount: 0,
      deviceTotal: 0,
      loading: true,
    };

    apis.deviceInstance.count(encodeQueryParam({terms: {state: 'offline'}}))
      .then(res => {
        if (res.status === 200) {
          map.offlineCount = res.result;
          setDeviceCount({...map});
        }
      }).catch();
    apis.deviceInstance.count(encodeQueryParam({terms: {state: 'online'}}))
      .then(res => {
        if (res.status === 200) {
          map.onlineCount = res.result;
          setDeviceCount({...map});
        }
      }).catch();
    apis.deviceInstance.count({})
      .then(res => {
        if (res.status === 200) {
          map.deviceTotal = res.result;
          map.loading = false;
          setDeviceCount({...map});
        }
      }).catch();
  };

  const queryProductCount = () => {
    let map = {
      publishedCount: 0,
      unpublishedCount: 0,
      productTotal: 0,
      loading: true,
    };

    apis.deviceProdcut.count(encodeQueryParam({terms: {state: 1}}))
      .then(res => {
        if (res.status === 200) {
          map.publishedCount = res.result;
          setProductCount({...map});
        }
      }).catch();
    apis.deviceProdcut.count(encodeQueryParam({terms: {state: 0}}))
      .then(res => {
        if (res.status === 200) {
          map.unpublishedCount = res.result;
          setProductCount({...map});
        }
      }).catch();
    apis.deviceProdcut.count({})
      .then(res => {
        if (res.status === 200) {
          map.productTotal = res.result;
          map.loading = false;
          setProductCount({...map});
        }
      }).catch();
  };

  const queryAlarmLogCount = () => {
    let map = {
      processedCount: 0,
      untreatedCount: 0,
      alarmLogTotal: 0,
      loading: true,
    };

    apis.deviceAlarm.findAlarmLogCount(encodeQueryParam({terms: {state: 'solve'}}))
      .then(res => {
        if (res.status === 200) {
          map.processedCount = res.result;
          setAlarmCount({...map});
        }
      }).catch();
    apis.deviceAlarm.findAlarmLogCount(encodeQueryParam({terms: {state: 'newer'}}))
      .then(res => {
        if (res.status === 200) {
          map.untreatedCount = res.result;
          setAlarmCount({...map});
        }
      }).catch();
    apis.deviceAlarm.findAlarmLogCount({})
      .then(res => {
        if (res.status === 200) {
          map.alarmLogTotal = res.result;
          map.loading = false;
          setAlarmCount({...map});
        }
      }).catch();
  };

  const queryMessageCount = () => {
    let map = {
      readCount: 0,
      unreadCount: 0,
      messageTotal: 0,
      loading: true,
    };

    apis.notification.noticesCount(encodeQueryParam({terms: {state: 'read'}}))
      .then(res => {
        if (res.status === 200) {
          map.readCount = res.result.total;
          setMessageCount({...map});
        }
      }).catch();
    apis.notification.noticesCount(encodeQueryParam({terms: {state: 'unread'}}))
      .then(res => {
        if (res.status === 200) {
          map.unreadCount = res.result.total;
          setMessageCount({...map});
        }
      }).catch();
    apis.notification.noticesCount({})
      .then(res => {
        if (res.status === 200) {
          map.loading = false;
          map.messageTotal = res.result.total;
          setMessageCount({...map});
        }
      }).catch();
  };

  useEffect(() => {
    queryProductCount();
    queryDeviceCount();
    queryAlarmLogCount();
    queryMessageCount();
  }, []);

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <Spin spinning={productCount.loading}>
          <ChartCard
            avatar={<Avatar size={60} src={ProductImg}/>}
            bordered={false}
            title='已发布产品'
            action={
              <Tooltip title='刷新'>
                <Icon type="sync" onClick={() => {
                  queryProductCount();
                }}/>
              </Tooltip>
            }
            total={<AutoHide title={numeral(productCount.publishedCount).format('0,0')} style={{width: '98%'}}/>}
            footer={
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.product-total" defaultMessage="产品数量"/>
                    }
                    value={numeral(productCount.productTotal).format('0,0')}
                  />
                </div>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.product-unpublished" defaultMessage="未发布"/>
                    }
                    value={numeral(productCount.unpublishedCount).format('0,0')}
                  />
                </div>
              </div>
            }
            contentHeight={46}
          >
          </ChartCard>
        </Spin>
      </Col>

      <Col {...topColResponsiveProps}>
        <Spin spinning={deviceCount.loading}>
          <ChartCard
            avatar={<Avatar size={60} src={DeviceImg}/>}
            bordered={false}
            title='在线设备'
            action={
              <Tooltip title='刷新'>
                <Icon type="sync" onClick={() => {
                  queryDeviceCount();
                }}/>
              </Tooltip>
            }
            total={<AutoHide title={numeral(deviceCount.onlineCount).format('0,0')} style={{width: '98%'}}/>}
            footer={
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.device-total" defaultMessage="设备总量"/>
                    }
                    value={numeral(deviceCount.deviceTotal).format('0,0')}
                  />
                </div>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.device-offline" defaultMessage="离线"/>
                    }
                    value={numeral(deviceCount.offlineCount).format('0,0')}
                  />
                </div>
              </div>
            }
            contentHeight={46}
          >
          </ChartCard>
        </Spin>
      </Col>

      <Col {...topColResponsiveProps}>
        <Spin spinning={alarmCount.loading}>
          <ChartCard
            avatar={<Avatar size={60} src={AlarmImg}/>}
            bordered={false}
            title='告警总数'
            action={
              <Tooltip title='刷新'>
                <Icon type="sync" onClick={() => {
                  queryAlarmLogCount();
                }}/>
              </Tooltip>
            }
            total={<AutoHide title={numeral(alarmCount.alarmLogTotal).format('0,0')} style={{width: '98%'}}/>}
            footer={
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.alarm-processed" defaultMessage="已处理"/>
                    }
                    value={numeral(alarmCount.processedCount).format('0,0')}
                  />
                </div>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.alarm-untreated" defaultMessage="未处理"/>
                    }
                    value={numeral(alarmCount.untreatedCount).format('0,0')}
                  />
                </div>
              </div>
            }
            contentHeight={46}
          >
          </ChartCard>
        </Spin>
      </Col>
      <Col {...topColResponsiveProps}>
        <Spin spinning={messageCount.loading}>
          <ChartCard
            avatar={<Avatar size={60} src={MessagesImg}/>}
            bordered={false}
            title='消息通知'
            action={
              <Tooltip title='刷新'>
                <Icon type="sync" onClick={() => {
                  queryMessageCount();
                }}/>
              </Tooltip>
            }
            total={<AutoHide title={numeral(messageCount.messageTotal).format('0,0')} style={{width: '98%'}}/>}
            footer={
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.message-read" defaultMessage="已读"/>
                    }
                    value={numeral(messageCount.readCount).format('0,0')}
                  />
                </div>
                <div style={{float: 'left', width: '50%'}}>
                  <Field
                    label={
                      <FormattedMessage id="analysis.analysis.message-unread" defaultMessage="未读"/>
                    }
                    value={numeral(messageCount.unreadCount).format('0,0')}
                  />
                </div>
              </div>
            }
            contentHeight={46}
          >
          </ChartCard>
        </Spin>
      </Col>
    </Row>
  );
};

export default IntroduceTenant;

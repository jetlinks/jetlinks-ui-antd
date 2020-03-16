import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Card, Col, Form, Icon, Input, List, message, Popconfirm, Row, Spin, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { router }  from 'umi';
import styles from './index.less';
import { ConnectState, Dispatch } from '@/models/connect';
import Bind from './bind';
import encodeQueryParam from '@/utils/encodeParam';
import StandardFormRow from '@/pages/network/type/components/standard-form-row';
import gateway from './img/gateway.svg';
import device from './img/device.svg';
import apis from '@/services';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';

interface Props extends FormComponentProps {
  dispatch: Dispatch;
  deviceGateway: any;
  loading: boolean;
}

interface State {
  bindVisible: boolean;
  currentItem: any;
  hasMore: boolean,
  gatewayId: string,
}

const DeviceGateway: React.FC<Props> = props => {
  const initState: State = {
    bindVisible: false,
    currentItem: {},
    hasMore: true,
    gatewayId: "",
  };

  const [bindVisible, setBindVisible] = useState(initState.bindVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [gatewayId, setGatewayId] = useState(initState.gatewayId);

  const {
    dispatch,
    deviceGateway: { result },
  } = props;

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 10 },
  };

  const handleSearch = () => {
    dispatch({
      type: 'deviceGateway/query',
      payload: encodeQueryParam({ paging: false }),
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');

  const unBindGateway = (id: string, deviceId: string) => {
    apis.deviceGateway.unBind(id, deviceId)
      .then(response => {
        if (response.status === 200) {
          message.success('解绑成功');
          handleSearch();
        }
      }).catch(() => {
    });
  };

  const onSearch = (name?: string) => {
    dispatch({
      type: 'deviceGateway/query',
      payload: encodeQueryParam({
        paging: false,
        terms: {
          name$LIKE: name,
        },
      }),
    });
  };

  const insert = (data: any) => {
    apis.deviceGateway.bind(gatewayId, data.deviceId).then(response => {
      if (response.status === 200) {
        message.success('保存成功');
        setBindVisible(false);
        handleSearch();
      }
    }).catch(() => {
    });
  };

  return (
    <PageHeaderWrapper title="网关设备">
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <Form.Item {...formItemLayout} label="设备名称">
                    <Input
                      onChange={e => {
                        onSearch(e.target.value);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <br/>
        <List<any>
          rowKey="id"
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={props.loading}
          className={styles.filterCardList}
          dataSource={result}
          renderItem={item => {
            if (item && item.id) {
              return (
                <Col {...topColResponsiveProps} key={item.id}>
                  <Spin spinning={false}>
                    <ChartCard
                      bordered={false}
                      title={item.id}
                      avatar={<img
                        style={{ width: 56, height: 56 }}
                        src={gateway}
                        alt="indicator"
                      />}
                      action={
                        <Tooltip title='绑定子设备'>
                          <Icon type="api" onClick={() => {
                            setGatewayId(item.id);
                            setBindVisible(true);
                          }}/>
                        </Tooltip>
                      }
                      total={() =>
                        <div>
                          <span style={{ fontSize: 20 }}>
                            <a onClick={() => {
                              router.push(`/device/instance/save/${item.id}`);
                            }}>
                              {item.name}
                            </a>
                          </span>
                          <span style={{ paddingLeft: 70 }}>
                            <Badge status={statusMap.get(item.state.text)} text={item.state.text}/>
                          </span>
                        </div>}
                    >
                      <span>
                        <div className={styles.StandardTable} style={{ paddingTop: 10 }}>
                          <List
                            itemLayout="horizontal"
                            dataSource={item.children}
                            renderItem={dev => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={<Avatar shape="square" size="small" src={device}/>}
                                  title={<a
                                    onClick={() => {
                                      router.push(`/device/instance/save/${dev.id}`);
                                    }}
                                  >{dev.name.length > 12 ? dev.name.substring(0, 12) + '······' : dev.name}</a>}
                                  style={{ height: 20 }}
                                />
                                <div><Badge status={statusMap.get(dev.state.text)} text={dev.state.text}/></div>
                                <div style={{ paddingLeft: 15 }}>
                                  <Popconfirm title="确认解绑该设备？" onConfirm={() => {
                                    unBindGateway(item.id, dev.id);
                                  }}>
                                    <a>解绑</a>
                                  </Popconfirm>
                                </div>
                              </List.Item>
                            )}
                          />
                        </div>
                      </span>
                    </ChartCard>
                  </Spin>
                </Col>
              );
            }
            return ('');
          }}
        />
      </div>
      {bindVisible && (
        <Bind
          close={() => {
            setBindVisible(false);
            setCurrentItem({});
          }}
          save={(item: any) => {
            insert(item);
          }}
          data={currentItem}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ deviceGateway, loading }: ConnectState) => ({
  deviceGateway,
  loading: loading.models.deviceGateway,
}))(Form.create<Props>()(DeviceGateway));

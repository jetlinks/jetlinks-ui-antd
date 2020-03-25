import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Card, Col, Form, Icon, Input, List, message, Popconfirm, Row, Spin, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { router } from 'umi';
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
  spinning: boolean;
  bindVisible: boolean;
  hasMore: boolean,
  gatewayId: string,
}

const DeviceGateway: React.FC<Props> = props => {
  const initState: State = {
    spinning: false,
    bindVisible: false,
    hasMore: true,
    gatewayId: '',
  };

  const [bindVisible, setBindVisible] = useState(initState.bindVisible);
  const [gatewayId, setGatewayId] = useState(initState.gatewayId);
  const [spinning, setSpinning] = useState(initState.spinning);

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
      callback: (response: any) => {
        if (response.status !== 200) {
          message.error('查询错误');
        }
        setSpinning(false);
      },
    });
  };

  useEffect(() => {
    setSpinning(true);
    handleSearch();
  }, []);

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');

  const unBindGateway = (id: string, deviceId: string) => {
    setSpinning(true);
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
    setSpinning(true);
    dispatch({
      type: 'deviceGateway/query',
      payload: encodeQueryParam({
        paging: false,
        terms: {
          name$LIKE: name,
        },
        callback: (response: any) => {
          if (response.status !== 200) {
            message.error('查询错误');
          }
          setSpinning(false);
        },
      }),
    });
  };

  const insert = (data: any) => {
    setSpinning(true);
    apis.deviceGateway.bind(gatewayId, data)
      .then(response => {
        if (response.status === 200) {
          message.success('保存成功');
          handleSearch();
        }
      }).catch(() => {
    });
  };

  return (
    <PageHeaderWrapper title="网关设备">
      <Spin spinning={spinning}>
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
            rowKey="id" grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={result} className={styles.filterCardList}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <Col {...topColResponsiveProps} key={item.id} style={{ minHeight: 400 }}
                       xxl={6} xl={8} lg={12} md={24}>
                    <ChartCard
                      bordered={false} title={item.id}
                      avatar={<img style={{ width: 48, height: 48 }} src={gateway} alt="indicator"/>}
                      action={
                        <Tooltip title='绑定子设备'>
                          <Icon type="plus" style={{ fontSize: 20 }}
                                onClick={() => {
                                  setGatewayId(item.id);
                                  setBindVisible(true);
                                }}/>
                        </Tooltip>
                      }
                      total={() =>
                        <Row>
                          <span>
                            <a style={{ fontSize: 18 }} onClick={() => {
                              router.push(`/device/instance/save/${item.id}`);
                            }}>
                              {item.name}
                            </a>
                            <Badge style={{ marginLeft: 20 }} status={statusMap.get(item.state.text)}
                                   text={item.state.text}/>
                          </span>
                        </Row>}
                    >
                      <span>
                        <div className={styles.StandardTable} style={{ paddingTop: 10 }}>
                          <List
                            itemLayout="horizontal" dataSource={item.children} style={{ minHeight: 270 }}
                            pagination={{
                              pageSize: 4,
                              size: 'small',
                              hideOnSinglePage: true,
                            }}
                            renderItem={(dev: any) => (
                              <List.Item
                                actions={[<Badge status={statusMap.get(dev.state.text)} text={dev.state.text}/>,
                                  <Popconfirm title="确认解绑该设备？" onConfirm={() => {
                                    unBindGateway(item.id, dev.id);
                                  }}>
                                    <a>解绑</a>
                                  </Popconfirm>]}
                              >
                                <List.Item.Meta
                                  avatar={<Avatar shape="square" size="small" src={device}/>}
                                  title={<a
                                    onClick={() => {
                                      router.push(`/device/instance/save/${dev.id}`);
                                    }}
                                  >{dev.name}</a>}
                                  style={{ minHeight: 20 }}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      </span>
                    </ChartCard>
                  </Col>
                );
              }
              return ('');
            }}
          />
        </div>
      </Spin>
      {bindVisible && (
        <Bind
          close={() => {
            setBindVisible(false);
          }}
          save={(item: any) => {
            setBindVisible(false);
            insert(item);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ deviceGateway, loading }: ConnectState) => ({
  deviceGateway,
  loading: loading.models.deviceGateway,
}))(Form.create<Props>()(DeviceGateway));

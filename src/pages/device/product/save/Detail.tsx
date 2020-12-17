import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Descriptions, Icon, message, Popconfirm, Row, Spin, Tabs, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { router } from 'umi';
import { DeviceProduct } from '../data.d';
import Definition from './definition';
import { ConnectState, Dispatch } from '@/models/connect';
import apis from '@/services';
import Save from '.';
import numeral from 'numeral';
import encodeQueryParam from '@/utils/encodeParam';
import Alarm from '@/pages/device/alarm';
import Configuration from "@/pages/device/product/save/configuration";

interface Props {
  dispatch: Dispatch;
  location: Location;
  close: Function;
  save: Function;
}

interface State {
  basicInfo: Partial<DeviceProduct>;
  saveVisible: boolean;
  config: any;
  orgInfo: any;
  deviceCount: number;
  spinning: boolean;
  units: any;
}

const Detail: React.FC<Props> = props => {
  const initState: State = {
    basicInfo: {},
    saveVisible: false,
    config: [],
    orgInfo: {},
    deviceCount: 0,
    spinning: true,
    units: {},
  };
  const {
    dispatch,
    location: { pathname },
  } = props;
  const [events, setEvents] = useState<any[]>([]);
  const [functions, setFunctions] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [basicInfo, setBasicInfo] = useState(initState.basicInfo);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [config, setConfig] = useState(initState.config);
  const [orgInfo] = useState(initState.orgInfo);
  const [deviceCount, setDeviceCount] = useState(initState.deviceCount);
  const [spinning, setSpinning] = useState(initState.spinning);
  const [units, setUnits] = useState(initState.units);
  const [updateVisible, setUpdateVisible] = useState(false);

  const handleSearch = (id?: string) => {
    const list = pathname.split('/');
    const temp = id || list[list.length - 1];
    dispatch({
      type: 'deviceProduct/queryById',
      payload: temp,
      callback: (r: any) => {
        if (r.status === 200) {
          const data = r.result;
          data.orgName = orgInfo[data.orgId];
          setBasicInfo(data);
          setSpinning(false);
          if (data.metadata) {
            const metadata = JSON.parse(data.metadata);
            setEvents(metadata.events);
            setFunctions(metadata.functions);
            setProperties(metadata.properties);
            setTags(metadata.tags);
          }
          // apis.deviceProdcut
          //   .protocolConfiguration(data.messageProtocol, data.transportProtocol)
          //   .then(resp => {
          //     // console.log(resp)
          //     setConfig(resp.result);
          //   });
          apis.deviceProdcut.productConfiguration(data.id).then(resp => {
            // console.log(resp.result)
            setConfig(resp.result);
          })
        }
      },
    });

    apis.deviceInstance.count(encodeQueryParam({ terms: { 'productId': id } }))
      .then(res => {
        if (res.status === 200) {
          setDeviceCount(res.result);
        }
      }).catch();
  };

  useEffect(() => {
    apis.deviceProdcut
      .queryOrganization()
      .then(res => {
        if (res.status === 200) {
          res.result.map((e: any) => (
            orgInfo[e.id] = e.name
          ));
        }
      }).catch(() => {
      });

    apis.deviceProdcut.units().then((response: any) => {
      if (response.status === 200) {
        setUnits(response.result);
      }
    }).catch(() => {
    });

    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      handleSearch(list[list.length - 1]);
    }
  }, []);

  const saveData = (item?: any) => {
    let data: Partial<DeviceProduct>;
    const metadata = JSON.stringify({ events, properties, functions, tags });

    // TODO 这个地方有疑惑，set数据之后此处数据还是未更新。原因待查
    if (item) {
      data = { ...item, metadata };
    } else {
      data = { ...basicInfo, metadata };
    }
    apis.deviceProdcut
      .saveOrUpdate(data)
      .then(r => {
        if (r.status === 200) {
          setSaveVisible(false);
          message.success('保存成功');
          const list = pathname.split('/');
          handleSearch(list[list.length - 1]);
        }
      })
      .catch(() => {
      });
  };

  const updateData = (type: string, item: any) => {
    let metadata = JSON.stringify({ events, properties, functions, tags });
    if (type === 'event') {
      metadata = JSON.stringify({ events: item, properties, functions, tags });
    } else if (type === 'properties') {
      metadata = JSON.stringify({ events, properties: item, functions, tags });
    } else if (type === 'function') {
      metadata = JSON.stringify({ events, properties, functions: item, tags });
    } else if (type === 'tags') {
      metadata = JSON.stringify({ events, properties, functions, tags: item });
    }

    const data = { ...basicInfo, metadata };
    apis.deviceProdcut
      .saveOrUpdate(data)
      .then((re: any) => {
        if (re.status === 200) {
          message.success('保存成功');
        }
      })
      .catch(() => {
      });
  };

  const deploy = (record: any) => {
    setSpinning(true);
    dispatch({
      type: 'deviceProduct/deploy',
      payload: record.id,
      callback: response => {
        if (response.status === 200) {
          basicInfo.state = 1;
          setBasicInfo(basicInfo);
          message.success('操作成功');
          setSpinning(false);
        }
      },
    });
  };
  const unDeploy = (record: any) => {
    setSpinning(true);
    dispatch({
      type: 'deviceProduct/unDeploy',
      payload: record.id,
      callback: response => {
        if (response.status === 200) {
          basicInfo.state = 0;
          setBasicInfo(basicInfo);
          message.success('操作成功');
          setSpinning(false);
        }
      },
    });
  };

  const updateInfo = (item?: any) => {
    apis.deviceProdcut
      .update(item, basicInfo.id)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('配置信息修改成功');
          setUpdateVisible(false);
          const list = pathname.split('/');
          handleSearch(list[list.length - 1]);
        }
      })
      .catch(() => {
      });
  };

  const content = (
    <div style={{ marginTop: 30 }}>
      <Descriptions column={4}>
        <Descriptions.Item label="设备数量">
          <div>
            {numeral(deviceCount).format('0,0')}
            <a style={{ marginLeft: 10 }}
              onClick={() => {
                router.push(`/device/instance?productId=${basicInfo.id}`);
              }}
            >查看</a>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const titleInfo = (
    <Row>
      <div>
        <span>
          产品：{basicInfo.name}
        </span>
        <Badge style={{ marginLeft: 20 }} color={basicInfo.state === 1 ? 'green' : 'red'}
          text={basicInfo.state === 1 ? '已发布' : '未发布'} />
        {basicInfo.state === 1 ? (
          <Popconfirm title="确认停用？" onConfirm={() => {
            unDeploy(basicInfo);
          }}>
            <a style={{ fontSize: 12, marginLeft: 20 }}>停用</a>
          </Popconfirm>
        ) : (<Popconfirm title="确认发布？" onConfirm={() => {
          deploy(basicInfo);
        }}>
          <a style={{ fontSize: 12, marginLeft: 20 }}>发布</a>
        </Popconfirm>)}
      </div>
    </Row>
  );

  const action = (
    <Tooltip title="编辑产品信息后请重新应用配置">
      <Popconfirm title="确认重新应用该配置？" onConfirm={() => {
        deploy(basicInfo);
      }}>
        <Button icon="sync" type="primary">
          应用配置
        </Button>
      </Popconfirm>
    </Tooltip>
  );

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <PageHeaderWrapper title={titleInfo}
        content={content}
        extra={action}
      >
        <Card>
          <Tabs>
            <Tabs.TabPane tab="产品信息" key="info">
              <Descriptions
                style={{ marginBottom: 20 }}
                bordered
                column={3}
                title={
                  <span>
                    产品信息
                    <Button
                      icon="edit"
                      style={{ marginLeft: 20 }}
                      type="link"
                      onClick={() => setSaveVisible(true)}
                    >
                      编辑
                    </Button>
                  </span>
                }
              >
                <Descriptions.Item label="产品ID" span={1}>
                  {basicInfo.id}
                </Descriptions.Item>
                {/*<Descriptions.Item label="产品名称" span={1}>
                  {basicInfo.name}
                </Descriptions.Item>*/}
                <Descriptions.Item label="所属品类" span={1}>
                  {basicInfo.classifiedName}
                </Descriptions.Item>
                <Descriptions.Item label="所属机构" span={1}>
                  {basicInfo.orgName}
                </Descriptions.Item>
                <Descriptions.Item label="消息协议" span={1}>
                  {basicInfo.protocolName || basicInfo.protocolId}
                </Descriptions.Item>
                <Descriptions.Item label="链接协议" span={1}>
                  {basicInfo.transportProtocol}
                </Descriptions.Item>
                <Descriptions.Item label="设备类型" span={1}>
                  {(basicInfo.deviceType || {}).text}
                </Descriptions.Item>
                <Descriptions.Item label="说明" span={2}>
                  {basicInfo.describe}
                </Descriptions.Item>
              </Descriptions>
              {config && config.length > 0 && (
                <div style={{ width: '100%' }}>
                  <Descriptions
                    title={
                      <span>
                        配置
                      <Button
                          icon="edit"
                          style={{ marginLeft: 20 }}
                          type="link"
                          onClick={() => setUpdateVisible(true)}
                        >
                          编辑
                    </Button>
                        {/* <Button
                          style={{ marginLeft: 10 }}
                          type="link"
                          onClick={() => setUpdateVisible(true)}
                        >
                          应用配置
                    </Button> */}
                      </span>
                    }
                  ></Descriptions>
                  {
                    config.map((i: any) => (
                      <div style={{ marginBottom: "20px" }} key={i.name}>
                        <h3>{i.name}</h3>
                        <Descriptions bordered column={2} title="">
                          {
                            i.properties && i.properties.map((item: any) => (
                              <Descriptions.Item label={item.description ? (<div><span style={{marginRight: '10px'}}>{item.name}</span>
                              <Tooltip title={item.description}>
                                <Icon type="question-circle-o" />
                              </Tooltip></div>) : item.name} span={1} key={item.property}>
                                {basicInfo.configuration ? (
                                  item.type.type === 'password' ? (
                                    basicInfo.configuration[item.property]?.length > 0 ? '••••••' : null
                                  ) :
                                    basicInfo.configuration[item.property]
                                ) : null}
                              </Descriptions.Item>
                            ))
                          }
                        </Descriptions>
                      </div>
                    ))
                  }
                </div>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="物模型" key="metadata">
              <Definition
                basicInfo={basicInfo}
                eventsData={events}
                functionsData={functions}
                propertyData={properties}
                tagsData={tags}
                unitsData={units}
                saveEvents={(data: any) => {
                  setEvents(data);
                  updateData('event', data);
                }}
                saveFunctions={(data: any) => {
                  setFunctions(data);
                  updateData('function', data);
                }}
                saveProperty={(data: any[]) => {
                  setProperties(data);
                  updateData('properties', data);
                }}
                saveTags={(data: any[]) => {
                  setTags(data);
                  updateData('tags', data);
                }}
                update={() => handleSearch()}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="告警设置" key="metadata1">
              <Alarm target="product" productId={basicInfo.id} productName={basicInfo.name} targetId={basicInfo.id}
                metaData={basicInfo.metadata}
                name={basicInfo.name} />
            </Tabs.TabPane>
          </Tabs>
        </Card>

        {saveVisible && (
          <Save
            data={basicInfo}
            close={() => setSaveVisible(false)}
            save={(item: any) => {
              setBasicInfo(item);
              saveData(item);
            }}
          />
        )}

        {updateVisible && (
          <Configuration
            data={basicInfo}
            configuration={config}
            close={() => {
              setUpdateVisible(false);
            }}
            save={(item: any) => {
              updateInfo(item);
            }}
          />
        )}
      </PageHeaderWrapper>
    </Spin>
  );
};
export default connect(({ deviceProduct, loading }: ConnectState) => ({
  deviceProduct,
  loading,
}))(Detail);

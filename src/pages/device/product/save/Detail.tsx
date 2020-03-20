import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Descriptions, message, Popconfirm, Row, Spin, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { router } from 'umi';
import { DeviceProduct } from '../data.d';
import Definition from './definition';
import { ConnectState, Dispatch } from '@/models/connect';
import apis from '@/services';
import Save from '.';

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
  spinning:boolean;
}

const Detail: React.FC<Props> = props => {
  const initState: State = {
    basicInfo: {},
    saveVisible: false,
    config: {},
    orgInfo: {},
    deviceCount: 0,
    spinning:true,
  };
  const {
    dispatch,
    location: { pathname },
  } = props;
  const [events, setEvents] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [basicInfo, setBasicInfo] = useState(initState.basicInfo);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [config, setConfig] = useState(initState.config);
  const [orgInfo] = useState(initState.orgInfo);
  const [deviceCount, setDeviceCount] = useState(initState.deviceCount);
  const [spinning, setSpinning] = useState(initState.spinning);

  useEffect(() => {
    apis.deviceProdcut
      .queryOrganization()
      .then(res => {
        if (res.status === 200) {
          res.result.map(e => (
            orgInfo[e.id] = e.name
          ));
        }
      }).catch(() => {
    });

    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      dispatch({
        type: 'deviceProduct/queryById',
        payload: list[list.length - 1],
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
            apis.deviceProdcut
              .protocolConfiguration(data.messageProtocol, data.transportProtocol)
              .then(resp => {
                setConfig(resp.result);
              });
          }
        },
      });

      apis.deviceInstance.count({ 'productId': list[list.length - 1] })
        .then(res => {
          if (res.status === 200) {
            setDeviceCount(res.result);
          }
        }).catch();
    }
  }, [basicInfo.id]);

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
          message.success('保存成功');
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

  const content = (
    <div style={{ marginTop: 30 }}>
      <Descriptions column={4}>
        <Descriptions.Item label="设备数量">
          <div>
            {deviceCount}
            <a style={{ marginLeft: 10 }}
               onClick={() => {
                 router.push(`/device/instance?productId$LIKE=${basicInfo.id}`);
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
            型号：{basicInfo.name}
          </span>
        <Badge style={{ marginLeft: 20 }} color={basicInfo.state === 1 ? 'green' : 'red'}
               text={basicInfo.state === 1 ? '已发布' : '未发布'}/>
        {basicInfo.state === 1?(
          <Popconfirm title="确认停用？" onConfirm={() => {
            unDeploy(basicInfo);
          }}>
            <a style={{fontSize:12,marginLeft:20}}>停用</a>
          </Popconfirm>
        ):(<Popconfirm title="确认发布？" onConfirm={() => {
            deploy(basicInfo);
          }}>
          <a style={{fontSize:12,marginLeft:20}}>发布</a>
        </Popconfirm>)}
      </div>
    </Row>
  );

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <PageHeaderWrapper title={titleInfo}
                         content={content}
      >
        <Card>
          <Tabs>
            <Tabs.TabPane tab="型号信息" key="info">
              <Descriptions
                style={{ marginBottom: 20 }}
                bordered
                column={2}
                title={
                  <span>
                    型号信息
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
                <Descriptions.Item label="产品名称" span={1}>
                  {basicInfo.name}
                </Descriptions.Item>
                <Descriptions.Item label="所属机构" span={1}>
                  {basicInfo.orgName}
                </Descriptions.Item>
                <Descriptions.Item label="消息协议" span={1}>
                  {basicInfo.messageProtocol}
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
              {config && config.name && (
                <Descriptions
                  style={{ marginBottom: 20 }}
                  bordered
                  column={2}
                  title={
                    <span>
                      {config.name}
                    </span>
                  }
                >
                  {config.properties &&
                  config.properties.map((item: any) => (
                    <Descriptions.Item label={item.property} span={1} key={item.property}>
                      {basicInfo.configuration[item.property]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="功能定义" key="metadata">
              <Definition
                eventsData={events}
                functionsData={functions}
                propertyData={properties}
                tagsData={tags}
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
              />
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
      </PageHeaderWrapper>
    </Spin>
  );
};
export default connect(({ deviceProduct, loading }: ConnectState) => ({
  deviceProduct,
  loading,
}))(Detail);

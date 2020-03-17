import React, { useState, useEffect } from 'react';
import { Tabs, Descriptions, Card, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
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
}

const Detail: React.FC<Props> = props => {
  const initState: State = {
    basicInfo: {},
    saveVisible: false,
    config: {},
    orgInfo: {},
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
        callback: (response: any) => {
          const data = response.result;
          data.orgName = orgInfo[data.orgId];
          setBasicInfo(data);
          const metadata = JSON.parse(data.metadata);
          setEvents(metadata.events);
          setFunctions(metadata.functions);
          setProperties(metadata.properties);
          setTags(metadata.tags);

          apis.deviceProdcut
            .protocolConfiguration(data.messageProtocol, data.transportProtocol)
            .then(resp => {
              setConfig(resp.result);
            });
        },
      });
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
      .then(reponse => {
        if (reponse.status === 200) {
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
    } else if(type === "tags"){
      metadata = JSON.stringify({ events, properties, functions, tags:item });
    }

    const data = { ...basicInfo, metadata };
    apis.deviceProdcut
      .saveOrUpdate(data)
      .then(reponse => {
        if (reponse.status === 200) {
          message.success('保存成功');
        }
      })
      .catch(() => {
      });
  };

  return (
    <PageHeaderWrapper title={basicInfo.name}>
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
                  <Descriptions.Item label={item.property} span={1}>
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
                // saveData();
                updateData('event', data);
              }}
              saveFunctions={(data: any) => {
                setFunctions(data);
                // saveData();
                updateData('function', data);
              }}
              saveProperty={(data: any[]) => {
                setProperties(data);
                // saveData({});
                updateData('properties', data);
              }}
              saveTags={(data: any[]) => {
                setTags(data);
                // saveData({});
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
  );
};
export default connect(({ deviceProduct, loading }: ConnectState) => ({
  deviceProduct,
  loading,
}))(Detail);

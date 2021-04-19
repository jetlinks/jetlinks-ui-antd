import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Badge, Card, Descriptions, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import img from '@/pages/edge-gateway/device/img/edge-device.png';
import Status from './status/status';
import Video from './video';
import RuleEngine from './rule-engine';
import Network from './network';
import Alarm from './alarm';
import apis from '@/services';
import moment from 'moment';

interface Props {
  location: Location;
}
interface State {
  loading: boolean;
  info: any;
  deviceId: string;
  tabList: any[];
  edgeTag: boolean;
}

const Detail: React.FC<Props> = props => {
  const {
    location: { pathname },
  } = props;
  const initState: State = {
    loading: false,
    edgeTag: false,
    info: {},
    deviceId: '',
    tabList: [],
  };
  const [edgeTag, setEdgeTag] = useState(initState.edgeTag);
  const [loading, setLoading] = useState(initState.loading);
  const [info, setInfo] = useState(initState.info);
  const [deviceId, setDeviceId] = useState(initState.deviceId);
  const [tabList, setTabList] = useState(initState.tabList);

  const statusColor = new Map();
  statusColor.set('online', 'green');
  statusColor.set('offline', 'red');
  statusColor.set('notActive', 'blue');
  const content = {
    info: (
      <div>
        <Descriptions bordered>
          <Descriptions.Item label="产品名称">{info.productName}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{info.deviceType?.text}</Descriptions.Item>
          {/* <Descriptions.Item label="所属机构">{info.orgId}</Descriptions.Item> */}
          <Descriptions.Item label="链接协议">{info.transport}</Descriptions.Item>
          <Descriptions.Item label="消息协议">{info.protocolName}</Descriptions.Item>
          <Descriptions.Item label="IP地址">{info.address}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {info.state?.value !== 'notActive'
              ? moment(info.registerTime).format('YYYY-MM-DD HH:mm:ss')
              : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="最后上线时间">
            {info.state?.value !== 'notActive' && !!info.onlineTime
              ? moment(info.onlineTime).format('YYYY-MM-DD HH:mm:ss')
              : '/'}
          </Descriptions.Item>
          <Descriptions.Item label="说明">{info.description}</Descriptions.Item>
        </Descriptions>
      </div>
    ),
    status: (
      <Status
        refresh={() => {
          getInfo(deviceId);
        }}
        edgeTag={edgeTag}
        device={info}
      />
    ),
    video: <Video device={info} edgeTag={edgeTag} />,
    ruleEngine: <RuleEngine device={info} />,
    network: <Network device={info} />,
    alarm: <Alarm device={info} />,
  };

  const getInfo = (id: string) => {
    setLoading(true);
    apis.edgeDevice.info(id).then(res => {
      if (res.status === 200) {
        setInfo(res.result);
        let tabList = [];
        if (res.result.state?.value === 'online') {
          tabList = [
            {
              key: 'info',
              tab: '基本信息',
            },
            {
              key: 'status',
              tab: '运行状态',
            },
            {
              key: 'video',
              tab: '视频模块',
            },
            {
              key: 'ruleEngine',
              tab: '规则引擎',
            },
            {
              key: 'network',
              tab: '设备接入',
            },
            {
              key: 'alarm',
              tab: '告警设置',
            },
          ];
        } else {
          tabList = [
            {
              key: 'info',
              tab: '基本信息',
            },
            {
              key: 'status',
              tab: '运行状态',
            },
          ];
        }
        setTabList([...tabList]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (pathname.indexOf('detail') > 0) {
      let tag = location.hash.split('=')[1] === 'true' ? true : false;
      setEdgeTag(tag);
      const list = pathname.split('/');
      setDeviceId(list[list.length - 1]);
      getInfo(list[list.length - 1]);
    }
  }, [window.location.hash]);

  return (
    <Spin tip="加载中..." spinning={loading}>
      <PageHeaderWrapper title={`设备: ${deviceId}`}>
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <Avatar size={64} src={img} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '20px', margin: '0px 30px' }}>
              {info?.name}
            </div>
            <div>
              <Badge color={statusColor.get(info.state?.value)} text={info.state?.text} />
            </div>
            <div
              style={{ marginLeft: '30px' }}
              onClick={() => {
                setLoading(true);
                apis.edgeDevice.reload(deviceId).then(res => {
                  if (res.status === 200) {
                    setLoading(false);
                  }
                });
              }}
            >
              <a>重启</a>
            </div>
          </div>
          <div>
            <Tabs defaultActiveKey="info">
              {tabList &&
                tabList.map(item => (
                  <Tabs.TabPane tab={item.tab} key={item.key}>
                    {content[item.key]}
                  </Tabs.TabPane>
                ))}
            </Tabs>
          </div>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
};
export default Detail;

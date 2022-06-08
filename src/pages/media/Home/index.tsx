import { PageContainer } from '@ant-design/pro-layout';
import { Col, message, Row, Tooltip } from 'antd';
import { PermissionButton } from '@/components';
import { getMenuPathByCode } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';
import Service from './service';
import { useState } from 'react';
import DeviceModal from './deviceModal';
import './index.less';
import { Body, Guide, Statistics } from '@/pages/home/components';
import Steps from '@/pages/home/components/Steps';

const permissionTip = '暂无权限，请联系管理员';

export const service = new Service('media/device');

export default () => {
  const dashBoardUrl = getMenuPathByCode('media/DashBoard');
  const deviceUrl = getMenuPathByCode('media/Device');
  const channelUrl = getMenuPathByCode('media/Device/Channel');
  const splitScreenUrl = getMenuPathByCode('media/SplitScreen');

  const [visible, setVisible] = useState(false);

  const { permission: devicePermission } = PermissionButton.usePermission('media/Device');

  const history = useHistory();

  const { data: deviceTotal } = useRequest(service.deviceCount, {
    formatResult: (res) => res.result,
  });

  const { data: channelTotal } = useRequest<any, any>(service.channelCount, {
    formatResult: (res) => res.result,
    defaultParams: {},
  });

  const addDevice = () => {
    if (deviceUrl && devicePermission.add) {
      history.push(deviceUrl, {
        save: true,
      });
    } else {
      message.warning(permissionTip);
    }
  };

  const jumpSplitScreen = () => {
    if (splitScreenUrl) {
      history.push(splitScreenUrl);
    } else {
      message.warning(permissionTip);
    }
  };

  const jumpChannel = () => {
    if (channelUrl) {
      setVisible(true);
    } else {
      message.warning(permissionTip);
    }
  };

  const guideList = [
    {
      key: 'EQUIPMENT',
      name: '添加视频设备',
      english: 'ADD VIDEO EQUIPMENT',
      auth: !!devicePermission.add,
      url: deviceUrl,
      param: { save: true },
    },
    {
      key: 'SCREEN',
      name: '分屏展示',
      english: 'SPLIT SCREEN DISPLAY',
      auth: !!splitScreenUrl,
      url: splitScreenUrl,
    },
    {
      key: 'CASCADE',
      name: '国标级联',
      english: 'GB CASCADE',
      auth: !!channelUrl,
      url: channelUrl,
    },
  ];

  return (
    <PageContainer>
      <DeviceModal
        visible={visible}
        url={channelUrl}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <Row gutter={24}>
        <Col span={14}>
          <Guide title={'视频中心引导'} data={guideList} />
        </Col>
        <Col span={10}>
          <Statistics
            title={'基础统计'}
            data={[
              {
                name: '设备数量',
                value: deviceTotal,
                children: require('/public/images/home/top-1.png'),
              },
              {
                name: '通道数量',
                value: channelTotal || 0,
                children: require('/public/images/home/top-2.png'),
              },
            ]}
            extra={
              <div style={{ fontSize: 14, fontWeight: 400 }}>
                <a
                  onClick={() => {
                    if (!!dashBoardUrl) {
                      history.push(`${dashBoardUrl}`);
                    } else {
                      message.warning('暂无权限，请联系管理员');
                    }
                  }}
                >
                  详情
                </a>
              </div>
            }
          />
        </Col>
        <Col span={24}>
          <Body title={'平台架构图'} english={'PLATFORM ARCHITECTURE DIAGRAM'} />
        </Col>
        <Col span={24}>
          <Steps
            title={
              <span>
                设备接入推荐步骤
                <Tooltip title={'不同的设备因为通信协议的不同，存在接入步骤的差异'}>
                  <QuestionCircleOutlined style={{ paddingLeft: 12 }} />
                </Tooltip>
              </span>
            }
            data={[
              {
                title: '添加视频设备',
                content: '根据视频设备的传输协议，在已创建的产品下添加对应的设备。',
                onClick: addDevice,
                url: require('/public/images/home/bottom-6.png'),
              },
              {
                title: '查看通道',
                content: '查看设备下的通道数据，可以进行直播、录制等操作。',
                onClick: jumpChannel,
                url: require('/public/images/home/bottom-7.png'),
              },
              {
                title: '分屏展示',
                content: '对多个通道的视频流数据进行分屏展示。',
                onClick: jumpSplitScreen,
                url: require('/public/images/home/bottom-8.png'),
              },
            ]}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

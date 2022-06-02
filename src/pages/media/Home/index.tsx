import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, message, Row, Tooltip, Typography } from 'antd';
import { PermissionButton } from '@/components';
import { getMenuPathByCode } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';
import Service from './service';
import { useState } from 'react';
import DeviceModal from './deviceModal';
import './index.less';

const permissionTip = '暂无权限，请联系管理员';

export const service = new Service('media/device');

export default () => {
  const dashBoardUrl = getMenuPathByCode('media/DashBoard');
  const deviceUrl = getMenuPathByCode('media/Device');
  const channelUrl = getMenuPathByCode('media/Device/Channel');
  const splitScreenUrl = getMenuPathByCode('media/SplitScreen');
  const cascadeUrl = getMenuPathByCode('media/Cascade');

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

  const jumpCascade = () => {
    if (cascadeUrl) {
      history.push(cascadeUrl);
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

  return (
    <PageContainer>
      <DeviceModal
        visible={visible}
        url={channelUrl}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <Card className={'media-home'}>
        <Row gutter={[12, 12]}>
          <Col span={14}>
            <div className={'media-home-top'}>
              <Typography.Title level={5}>视频中心引导</Typography.Title>
              <div className={'media-guide'}>
                <div onClick={addDevice}>添加视频设备</div>
                <div onClick={jumpSplitScreen}>分屏展示</div>
                <div onClick={jumpCascade}>国标级联</div>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div className={'media-home-top'}>
              <Typography.Title level={5}>
                基础统计
                <PermissionButton
                  isPermission={!!dashBoardUrl}
                  onClick={() => {
                    history.push(dashBoardUrl);
                  }}
                  type={'link'}
                >
                  详情
                </PermissionButton>
              </Typography.Title>
              <div className={'media-statistics'}>
                <div>
                  设备数量
                  {deviceTotal}
                </div>
                <div>
                  通道数量
                  {channelTotal}
                </div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <Typography.Title level={5}>平台架构图</Typography.Title>
            <div className={'media-home-content'}></div>
          </Col>
          <Col span={24}>
            <Typography.Title level={5}>
              <span style={{ paddingRight: 12 }}>视频设备管理推荐步骤</span>
              <Tooltip title={'请根据业务需要对下述步骤进行选择性操作'}>
                <QuestionCircleOutlined />
              </Tooltip>
            </Typography.Title>
            <div className={'media-home-steps'}>
              <div onClick={addDevice}>
                添加视频设备
                <div>根据视频设备的传输协议，在已创建的产品下添加对应的设备</div>
              </div>
              <div onClick={jumpChannel}>
                查看通道
                <div>查看设备下的通道数据，可以进行直播、录制等操作</div>
              </div>
              <div onClick={jumpSplitScreen}>
                分屏展示
                <div>对多个通道的视频流数据进行分屏展示</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

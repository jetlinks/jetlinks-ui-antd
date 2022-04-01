import { PageContainer } from '@ant-design/pro-layout';
import { InstanceModel, service } from '@/pages/device/Instance';
import { history, useParams } from 'umi';
import { Badge, Button, Card, Descriptions, Divider, message, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { observer } from '@formily/react';
import Log from '@/pages/device/Instance/Detail/Log';
// import Alarm from '@/pages/device/components/Alarm';
import Info from '@/pages/device/Instance/Detail/Info';
import Functions from '@/pages/device/Instance/Detail/Functions';
import Running from '@/pages/device/Instance/Detail/Running';
import ChildDevice from '@/pages/device/Instance/Detail/ChildDevice';
import { useIntl } from '@@/plugin-locale/localeExports';
import Metadata from '../../components/Metadata';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import MetadataAction from '@/pages/device/components/Metadata/DataBaseAction';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';

export const deviceStatus = new Map();
deviceStatus.set('online', <Badge status="success" text={'在线'} />);
deviceStatus.set('offline', <Badge status="error" text={'离线'} />);
deviceStatus.set('notActive', <Badge status="processing" text={'未启用'} />);

const InstanceDetail = observer(() => {
  const intl = useIntl();
  const [tab, setTab] = useState<string>('detail');
  const getDetail = (id: string) => {
    service.detail(id).then((response) => {
      InstanceModel.detail = response?.result;
      // 写入物模型数据
      const metadata: DeviceMetadata = JSON.parse(response.result?.metadata || '{}');
      MetadataAction.insert(metadata);
    });
  };
  const params = useParams<{ id: string }>();

  const [subscribeTopic] = useSendWebsocketMessage();

  useEffect(() => {
    if (subscribeTopic) {
      subscribeTopic(
        `instance-editor-info-status-${params.id}`,
        `/dashboard/device/status/change/realTime`,
        {
          deviceId: params.id,
        },
        // @ts-ignore
      ).subscribe((data: any) => {
        const payload = data.payload;
        const state = payload.value.type;
        InstanceModel.detail.state = {
          value: state,
          text: '',
        };
      });
    }
  }, []);

  useEffect(() => {
    Store.subscribe(SystemConst.REFRESH_DEVICE, () => {
      MetadataAction.clean();
      setTimeout(() => {
        getDetail(params.id);
      }, 200);
    });
    // return subscription.unsubscribe();
  }, []);
  const resetMetadata = async () => {
    const resp = await service.deleteMetadata(params.id);
    if (resp.status === 200) {
      message.success('操作成功');
      Store.set(SystemConst.REFRESH_DEVICE, true);
      setTimeout(() => {
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      }, 400);
    }
  };
  const list = [
    {
      key: 'detail',
      tab: intl.formatMessage({
        id: 'pages.device.instanceDetail.detail',
        defaultMessage: '实例信息',
      }),
      component: <Info />,
    },
    {
      key: 'running',
      tab: intl.formatMessage({
        id: 'pages.device.instanceDetail.running',
        defaultMessage: '运行状态',
      }),
      component: <Running />,
    },
    {
      key: 'metadata',
      tab: intl.formatMessage({
        id: 'pages.device.instanceDetail.metadata',
        defaultMessage: '物模型',
      }),
      component: (
        <Card>
          <Metadata
            type="device"
            tabAction={
              <Tooltip title="重置后将使用产品的物模型配置">
                <Button onClick={resetMetadata}>重置操作</Button>
              </Tooltip>
            }
          />
        </Card>
      ),
    },
    {
      // 物模型中有事件信息，且设备状态是在线的情况下才显示此模块
      key: 'functions',
      tab: intl.formatMessage({
        id: 'pages.device.instanceDetail.functions',
        defaultMessage: '设备功能',
      }),
      component: <Functions />,
    },
    {
      key: 'log',
      tab: intl.formatMessage({
        id: 'pages.device.instanceDetail.log',
        defaultMessage: '日志管理',
      }),
      component: <Log />,
    },
    // 产品类型为网关的情况下才显示此模块
    {
      key: 'child-device',
      tab: '子设备',
      component: <ChildDevice />,
    },
    // {
    //   key: 'alarm',
    //   tab: intl.formatMessage({
    //     id: 'pages.device.instanceDetail.alarm',
    //     defaultMessage: '告警设置',
    //   }),
    //   component: (
    //     <Card>
    //       <Alarm type="device" />
    //     </Card>
    //   ),
    // },
    // {
    //   key: 'visualization',
    //   tab: intl.formatMessage({
    //     id: 'pages.device.instanceDetail.visualization',
    //     defaultMessage: '可视化',
    //   }),
    //   component: <div>开发中...</div>,
    // },
  ];

  useEffect(() => {
    if (!InstanceModel.current && !params.id) {
      history.goBack();
    } else {
      setTab('detail');
      getDetail(params?.id || InstanceModel.current?.id || '');
    }
    return () => {
      MetadataAction.clean();
    };
  }, [params.id]);

  return (
    <PageContainer
      className={'page-title-show'}
      onBack={history.goBack}
      onTabChange={setTab}
      tabList={list}
      tabActiveKey={tab}
      content={
        <Descriptions size="small" column={4}>
          <Descriptions.Item label={'ID'}>{InstanceModel.detail?.id}</Descriptions.Item>
          <Descriptions.Item label={'所属产品'}>
            <Button
              type={'link'}
              size={'small'}
              onClick={() => {
                const url = getMenuPathByParams(
                  MENUS_CODE['device/Product/Detail'],
                  InstanceModel.detail?.productId,
                );
                history.replace(url);
              }}
            >
              {InstanceModel.detail?.productName}
            </Button>
          </Descriptions.Item>
        </Descriptions>
      }
      title={
        <>
          {InstanceModel.detail?.name}
          <Divider type="vertical" />
          {deviceStatus.get(InstanceModel.detail?.state?.value)}
        </>
      }
      // extra={[
      //   statusMap[0],
      //   <Button key="2">
      //     {intl.formatMessage({
      //       id: 'pages.device.productDetail.disable',
      //       defaultMessage: '停用',
      //     })}
      //   </Button>,
      //   <Button key="1" type="primary">
      //     {intl.formatMessage({
      //       id: 'pages.device.productDetail.setting',
      //       defaultMessage: '应用配置',
      //     })}
      //   </Button>,
      // ]}
    >
      {list.find((k) => k.key === tab)?.component}
    </PageContainer>
  );
});
export default InstanceDetail;

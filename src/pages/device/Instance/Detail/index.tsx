import { PageContainer } from '@ant-design/pro-layout';
import { InstanceModel, service } from '@/pages/device/Instance';
import { history, useParams } from 'umi';
import { Badge, Button, Card, Descriptions, Divider, message } from 'antd';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { observer } from '@formily/react';
import Log from '@/pages/device/Instance/Detail/Log';
// import Alarm from '@/pages/device/components/Alarm';
import Info from '@/pages/device/Instance/Detail/Info';
import Functions from '@/pages/device/Instance/Detail/Functions';
import Running from '@/pages/device/Instance/Detail/Running';
import ChildDevice from '@/pages/device/Instance/Detail/ChildDevice';
import Diagnose from '@/pages/device/Instance/Detail/Diagnose';
import MetadataMap from '@/pages/device/Instance/Detail/MetadataMap';
import { useIntl } from '@@/plugin-locale/localeExports';
import Metadata from '../../components/Metadata';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import MetadataAction from '@/pages/device/components/Metadata/DataBaseAction';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { PermissionButton } from '@/components';

export const deviceStatus = new Map();
deviceStatus.set('online', <Badge status="success" text={'在线'} />);
deviceStatus.set('offline', <Badge status="error" text={'离线'} />);
deviceStatus.set('notActive', <Badge status="processing" text={'未启用'} />);

const InstanceDetail = observer(() => {
  const intl = useIntl();
  const [tab, setTab] = useState<string>('detail');
  const params = useParams<{ id: string }>();
  const { permission } = PermissionButton.usePermission('device/Instance');

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
  const baseList = [
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
              <PermissionButton
                isPermission={permission.update}
                popConfirm={{
                  title: '确认重置？',
                  onConfirm: resetMetadata,
                }}
                tooltip={{
                  title: '重置后将使用产品的物模型配置',
                }}
                key={'reload'}
              >
                重置操作
              </PermissionButton>
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
    {
      key: 'diagnose',
      tab: '设备诊断',
      component: <Diagnose />,
    },
    {
      key: 'metadata-map',
      tab: '物模型映射',
      component: <MetadataMap type="device" />,
    },
  ];
  const [list, setList] = useState<{ key: string; tab: string; component: ReactNode }[]>(baseList);

  const getDetail = (id: string) => {
    service.detail(id).then((response) => {
      InstanceModel.detail = response?.result;
      const datalist = [...baseList];
      if (response.result.deviceType?.value === 'gateway') {
        // 产品类型为网关的情况下才显示此模块
        datalist.push({
          key: 'child-device',
          tab: '子设备',
          component: <ChildDevice />,
        });
      }
      setList(datalist);
      // 写入物模型数据
      const metadata: DeviceMetadata = JSON.parse(response.result?.metadata || '{}');
      MetadataAction.insert(metadata);
    });
  };

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

  useEffect(() => {
    if ((location as any).query?.key) {
      setTab((location as any).query?.key || 'detail');
    }
    const subscription = Store.subscribe(SystemConst.BASE_UPDATE_DATA, (data) => {
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(data);
        setTimeout(() => window.close(), 300);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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

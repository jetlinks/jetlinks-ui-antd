import { PageContainer } from '@ant-design/pro-layout';
import { history, useIntl, useParams } from 'umi';
import { Descriptions } from 'antd';
import { service, state } from '@/pages/device/Firmware';
import History from './History';
import { useEffect, useState } from 'react';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import Task from '@/pages/device/Firmware/Detail/Task';
import { observer } from '@formily/react';

const Detail = observer(() => {
  const intl = useIntl();
  const [data, setData] = useState<FirmwareItem | undefined>(state.current);
  const param = useParams<{ id: string }>();
  useEffect(() => {
    if (!state.current) {
      service.detail(param.id).then((resp) => {
        if (resp.status === 200) {
          setData(resp.result);
        }
      });
    }
  }, [param.id]);

  const list = [
    {
      key: 'task',
      tab: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.upgradeTask',
        defaultMessage: '升级任务',
      }),
      component: <Task />,
    },
    {
      key: 'history',
      tab: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.upgradeRecord',
        defaultMessage: '升级记录',
      }),
      component: <History />,
    },
  ];
  return (
    <PageContainer
      tabActiveKey={state.tab}
      onBack={history.goBack}
      onTabChange={(key) => {
        state.tab = key as 'task' | 'history';
      }}
      content={
        <>
          <Descriptions size="small" column={3}>
            {[
              { key: 'ID', value: data?.id },
              {
                key: intl.formatMessage({
                  id: 'pages.device.components.firmware.detail.product',
                  defaultMessage: '所属产品',
                }),
                value: data?.productName,
              },
              {
                key: intl.formatMessage({
                  id: 'pages.device.components.firmware.detail.version',
                  defaultMessage: '版本号',
                }),
                value: data?.version,
              },
              {
                key: intl.formatMessage({
                  id: 'pages.device.components.firmware.detail.versionOrder',
                  defaultMessage: '版本序号',
                }),
                value: data?.versionOrder,
              },
              {
                key: intl.formatMessage({
                  id: 'pages.device.components.firmware.detail.signMethod',
                  defaultMessage: '签名方式',
                }),
                value: data?.signMethod,
              },
              {
                key: intl.formatMessage({
                  id: 'pages.device.components.firmware.detail.sign',
                  defaultMessage: '签名',
                }),
                value: data?.sign,
              },
            ].map((item) => (
              <Descriptions.Item key={item.key} label={item.key}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      }
      title={<>固件: {state.current?.name}</>}
      tabList={list}
    >
      {list.find((k) => k.key === state.tab)?.component}
    </PageContainer>
  );
});
export default Detail;

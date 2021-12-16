import { PageContainer } from '@ant-design/pro-layout';
import { history, useParams } from 'umi';
import { Descriptions } from 'antd';
import { service, state } from '@/pages/device/Firmware';
import History from './History';
import { useEffect, useState } from 'react';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import Task from '@/pages/device/Firmware/Detail/Task';

const Detail = () => {
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
  const [tab, setTab] = useState<string>('task');
  const list = [
    {
      key: 'task',
      tab: '升级任务',
      component: <Task />,
    },
    {
      key: 'history',
      tab: '升级记录',
      component: <History />,
    },
  ];
  return (
    <PageContainer
      onBack={history.goBack}
      onTabChange={setTab}
      content={
        <>
          <Descriptions size="small" column={3}>
            {[
              { key: 'ID', value: data?.id },
              { key: '所属产品', value: data?.productName },
              { key: '版本号', value: data?.version },
              { key: '版本序号', value: data?.versionOrder },
              { key: '签名方式', value: data?.signMethod },
              { key: '签名', value: data?.sign },
            ].map((item) => (
              <Descriptions.Item label={item.key}>{item.value}</Descriptions.Item>
            ))}
          </Descriptions>
        </>
      }
      title={<>固件: {state.current?.name}</>}
      tabList={list}
    >
      {list.find((k) => k.key === tab)?.component}
    </PageContainer>
  );
};
export default Detail;

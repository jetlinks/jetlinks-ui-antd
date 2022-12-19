import { InstanceModel } from '@/pages/device/Instance';
import { Card, Empty, Input, Tabs } from 'antd';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import Property from '@/pages/device/Instance/Detail/Running/Property';
import Event from '@/pages/device/Instance/Detail/Running/Event';
import { useEffect, useState } from 'react';
import Emptys from '@/pages/device/components/Empty';
import { useDomFullHeight } from '@/hooks';

const Running = () => {
  const metadata = JSON.parse((InstanceModel.detail?.metadata || '{}') as string) as DeviceMetadata;
  const [list, setList] = useState<any[]>([]);
  const { minHeight } = useDomFullHeight(`.device-detail-running`);

  useEffect(() => {
    // setList(metadata?.events || []);
    setList([{ id: 'properties', name: '属性' }, ...(metadata?.events || [])]);
  }, [InstanceModel.detail?.metadata]);

  const operations = () => (
    <Input.Search
      style={{ maxWidth: 200, marginBottom: 10 }}
      allowClear
      placeholder="请输入事件名称"
      // placeholder="请输入名称"
      onSearch={(value: string) => {
        console.log(list);
        if (value) {
          const li = list.filter((i) => {
            return i?.name.indexOf(value) !== -1;
          });
          console.log(list, value);
          setList(li);
        } else {
          // setList(metadata?.events || []);
          setList([{ id: 'properties', name: '属性' }, ...(metadata?.events || [])]);
        }
      }}
    />
  );

  return (
    <Card className={'device-detail-running'} style={{ minHeight }}>
      {list?.length === 0 && (metadata?.properties || [])?.length === 0 ? (
        <div
          style={{
            height: minHeight - 150,
          }}
        >
          <Emptys />
        </div>
      ) : (
        <div className="tabs-full-active">
          <Tabs defaultActiveKey="1" tabPosition="left" tabBarExtraContent={{ left: operations() }}>
            {/* <Tabs.TabPane tab="属性" key="1">
              <Property data={metadata?.properties || []} />
            </Tabs.TabPane> */}
            {list?.map((item) => (
              <Tabs.TabPane tab={item.name} key={item.id}>
                {item.id === 'properties' ? (
                  <Property data={metadata?.properties || []} />
                ) : (
                  <Event data={item} />
                )}
              </Tabs.TabPane>
            ))}
          </Tabs>
          {list.length === 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Empty description="暂无数据" style={{ marginTop: '10%' }} />
              <Empty description="暂无数据" style={{ marginTop: '10%', marginLeft: '30%' }} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
export default Running;

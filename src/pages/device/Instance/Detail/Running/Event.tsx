import { SyncOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Badge, Divider, message, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { EventMetadata, ObserverMetadata } from '@/pages/device/Product/typings';
import { useEffect, useRef, useState } from 'react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import EventLog from '@/pages/device/Instance/Detail/MetadataLog/Event';

interface Props {
  data: Partial<EventMetadata> & ObserverMetadata;
}

const eventLevel = new Map();
eventLevel.set('ordinary', <Badge status="processing" text="普通" />);
eventLevel.set('warn', <Badge status="warning" text="警告" />);
eventLevel.set('urgent', <Badge status="error" text="紧急" />);

const Event = (props: Props) => {
  const { data } = props;
  const params = useParams<{ id: string }>();

  const [count, setCount] = useState<number>(0);
  const cacheCount = useRef<number>(count);
  useEffect(() => {
    if (data.id) {
      service.getEventCount(params.id, data.id).then((resp) => {
        if (resp.status === 200) {
          setCount(resp.result?.total);
          cacheCount.current = resp.result?.total;
        }
      });
    }

    data.subscribe((payload: unknown) => {
      console.log('订阅到消息', payload);
      if (payload) {
        cacheCount.current = cacheCount.current + 1;
        console.log(cacheCount.current, 'currnt');
        setCount(cacheCount.current);
      }
    });
  }, [data.id, params.id]);
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <ProCard
      title={`${data.name}: ${count}`}
      extra={
        <>
          <SyncOutlined onClick={() => message.success('刷新')} />
          <Divider type="vertical" />
          <Tooltip placement="top" title="详情">
            <UnorderedListOutlined
              onClick={() => {
                setVisible(true);
              }}
            />
          </Tooltip>
        </>
      }
      layout="center"
      bordered
      headerBordered
      colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
    >
      <div style={{ height: 60 }}>{eventLevel.get(data.expands?.level || 'warn')}</div>
      <EventLog visible={visible} close={() => setVisible(false)} data={data} />
    </ProCard>
  );
};
export default Event;

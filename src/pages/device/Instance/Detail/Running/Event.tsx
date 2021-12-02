import { SyncOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Badge, Divider, Tooltip } from 'antd';
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

  const [loading, setLoading] = useState<boolean>(false);
  const initCount = () => {
    setLoading(true);
    if (data.id) {
      service
        .getEventCount(params.id, data.id, {
          format: true,
          pageSize: 1,
        })
        .then((resp) => {
          if (resp.status === 200) {
            setCount(resp.result?.total);
            cacheCount.current = resp.result?.total;
          }
        })
        .finally(() => setLoading(false));
    }
  };
  useEffect(() => {
    initCount();
    data.subscribe((payload: unknown) => {
      if (payload) {
        cacheCount.current = cacheCount.current + 1;
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
          <SyncOutlined onClick={initCount} />
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
      loading={loading}
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

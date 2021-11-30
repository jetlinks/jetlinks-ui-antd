import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import { Divider, message, Spin } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { ObserverMetadata, PropertyMetadata } from '@/pages/device/Product/typings';
import { Line } from '@ant-design/charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';

interface Props {
  data: Partial<PropertyMetadata> & ObserverMetadata;
}

type Payload = {
  timeString: string;
  timestamp: number;
  value: number;
  formatValue: string;
  property: string;
} & Record<string, unknown>;
const Property = (props: Props) => {
  const { data } = props;
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const cacheList = useRef<Record<string, unknown>[]>(list);
  const [title, setTitle] = useState<string>('');

  const params = useParams<{ id: string }>();
  const type = data.valueType?.type;
  const value = list[list.length - 1];

  useEffect(() => {
    data.subscribe((payload: any) => {
      if (payload instanceof Array) {
        setTitle(`:${payload[payload?.length - 1].formatValue}`);
        cacheList.current = payload;
        setList(payload);
      } else if (payload instanceof Object) {
        const temp: Payload = {
          timeString: payload.timeString,
          timestamp: payload.timestamp,
          ...payload.value,
        };
        // title
        const newValue = temp?.formatValue;
        setTitle(`:${newValue}`);
        // list
        const cache = cacheList.current;
        cache.shift();
        cache.push(temp);
        setList(cache);
      }
    });
  }, [data]);

  const chart = useCallback(() => {
    switch (type) {
      case 'int':
      case 'float':
      case 'double':
      case 'long':
      case 'enum':
        return (
          <Line
            height={60}
            xField="timeString"
            yField="value"
            xAxis={false}
            yAxis={false}
            data={list}
          />
        );
      case 'object':
        return <div>{JSON.stringify(value.formatValue) || '/'}</div>;
      default:
        return null;
    }
  }, [list, type]);

  const [loading, setLoading] = useState<boolean>(false);
  const refreshProperty = async () => {
    setLoading(true);
    if (!data.id) return;
    const resp = await service.getProperty(params.id, data.id);
    setLoading(false);
    if (resp.status === 200) {
      message.success('操作成功');
    }
  };
  return (
    <ProCard
      title={`${data?.name} ${title}`}
      extra={
        <>
          <EditOutlined
            onClick={async () => {
              message.success('设置属性');
            }}
          />
          <Divider type="vertical" />
          <SyncOutlined onClick={refreshProperty} />
          <Divider type="vertical" />
          <EditOutlined onClick={refreshProperty} />
        </>
      }
      layout="center"
      bordered
      headerBordered
      colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
    >
      <Spin spinning={loading} style={{ height: 60 }}>
        {chart()}
      </Spin>
    </ProCard>
  );
};
export default Property;

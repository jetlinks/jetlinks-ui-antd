import { EditOutlined, SyncOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Popover, Spin, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { ObserverMetadata, PropertyMetadata } from '@/pages/device/Product/typings';
import { Line } from '@ant-design/charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import PropertyList from '@/pages/device/Instance/Detail/PropertyList';

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

  const [propertyValue, setPropertyValue] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const handleSetPropertyValue = async () => {
    const resp = await service.setProperty(params.id, { [`${data.id}`]: propertyValue });
    if (resp.status === 200) {
      message.success('操作成功');
    }
  };

  const renderSetProperty = () => {
    if (data.expands?.readOnly === false || data.expands?.readOnly === 'false') {
      return (
        <Popover
          trigger="click"
          title={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>设置属性</span>
              <Button size="small" type="primary" onClick={handleSetPropertyValue}>
                设置
              </Button>
            </div>
          }
          content={
            <Input value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)} />
          }
        >
          <Tooltip placement="top" title="设置属性至设备">
            <EditOutlined />
          </Tooltip>
          <Divider type="vertical" />
        </Popover>
      );
    } else {
      return null;
    }
  };
  return (
    <ProCard
      title={`${data?.name} ${title}`}
      extra={
        <>
          {renderSetProperty()}
          <Tooltip placement="top" title="获取最新属性值">
            <SyncOutlined onClick={refreshProperty} />
          </Tooltip>
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
      <Spin spinning={loading}>
        <div style={{ height: 60 }}>{chart()}</div>
      </Spin>
      <PropertyList
        data={data}
        property={data.id!}
        visible={visible}
        close={() => setVisible(false)}
      />
    </ProCard>
  );
};
export default Property;

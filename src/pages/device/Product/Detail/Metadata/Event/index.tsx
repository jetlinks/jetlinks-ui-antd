import type { EventMetadata } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';

const Event = () => {
  const columns: ProColumns<EventMetadata>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '标识',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '事件级别',
      dataIndex: 'expands.level',
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  const param = useParams<{ id: string }>();

  const [data, setData] = useState<EventMetadata[]>([]);

  const initData = async () => {
    const result = await DB.getDB().table(`${param.id}-events`).toArray();
    setData(result);
  };
  useEffect(() => {
    initData();
    // setData(propertyTable);
  }, [param]);
  return <ProTable dataSource={data} size={'small'} columns={columns} rowKey="id" search={false} />;
};
export default Event;

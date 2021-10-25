import type { TagMetadata } from '@/pages/device/Product/typings';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import DB from '@/db';

const Tag = () => {
  const columns: ProColumns<TagMetadata>[] = [
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
      title: '数据类型',
      dataIndex: 'valueType',
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: (text) => (text === 'true' || text === true ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];
  const param = useParams<{ id: string }>();

  const [data, setData] = useState<TagMetadata[]>([]);

  const initData = async () => {
    const result = await DB.getDB().table(`${param.id}-tag`).toArray();
    setData(result);
  };
  useEffect(() => {
    initData();
    // setData(propertyTable);
  }, [param]);
  return <ProTable dataSource={data} size={'small'} columns={columns} rowKey="id" search={false} />;
};
export default Tag;

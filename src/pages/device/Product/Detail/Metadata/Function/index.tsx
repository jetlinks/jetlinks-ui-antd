import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { FunctionMetadata } from '@/pages/device/Product/typings';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import DB from '@/db';

const Function = () => {
  const columns: ProColumns<FunctionMetadata>[] = [
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
      title: '是否异步',
      dataIndex: 'async',
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  const param = useParams<{ id: string }>();

  const [data, setData] = useState<FunctionMetadata[]>([]);

  const initData = async () => {
    const result = await DB.getDB().table(`${param.id}-function`).toArray();
    setData(result);
  };
  useEffect(() => {
    initData();
    // setData(propertyTable);
  }, [param]);
  return <ProTable size={'small'} dataSource={data} columns={columns} rowKey="id" search={false} />;
};
export default Function;

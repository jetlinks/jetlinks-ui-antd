import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service, state } from '@/pages/device/Firmware';
import type { HistoryItem } from '@/pages/device/Firmware/typings';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';

const History = () => {
  const param = useParams<{ id: string }>();

  const [defaultParams, setParams] = useState<Record<string, unknown>>();
  useEffect(() => {
    if (state.historyParams) {
      setParams({ ...state.historyParams });
    }
    return () => {
      state.historyParams = undefined;
      state.taskItem = undefined;
    };
  }, []);
  const columns: ProColumns<HistoryItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (text) => text.text,
    },
    {
      title: '进度(%)',
      dataIndex: 'progress',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable
      columns={columns}
      defaultParams={{
        ...defaultParams,
        firmwareId: param.id,
      }}
      request={(params) => service.history(params)}
      rowKey="id"
    />
  );
};
export default History;

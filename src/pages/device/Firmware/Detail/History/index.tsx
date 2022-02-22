import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service, state } from '@/pages/device/Firmware';
import type { HistoryItem } from '@/pages/device/Firmware/typings';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';

const History = () => {
  const intl = useIntl();
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
      title: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.history.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'deviceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.history.taskName',
        defaultMessage: '任务名称',
      }),
      dataIndex: 'taskName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.history.version',
        defaultMessage: '版本',
      }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.history.state',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      renderText: (text) => text.text,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.history.progress',
        defaultMessage: '进度(%)',
      }),
      dataIndex: 'progress',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.components.firmware.detail.history.createTime',
        defaultMessage: '创建时间',
      }),
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

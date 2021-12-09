import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { LogItem } from '@/pages/device/Instance/Detail/Log/typings';
import { Modal, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';

const Log = () => {
  const intl = useIntl();

  const [type, setType] = useState<any>({});
  useEffect(() => {
    service.getLogType().then((resp) => {
      if (resp.status === 200) {
        const list = (resp.result as { text: string; value: string }[]).reduce(
          (previousValue, currentValue) => {
            previousValue[currentValue.value] = currentValue;
            return previousValue;
          },
          {},
        );
        setType(list);
      }
    });
  }, []);
  const columns: ProColumns<LogItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '类型',
      dataIndex: 'type',
      renderText: (text) => text.text,
      valueEnum: type,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      defaultSortOrder: 'descend',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      defaultSortOrder: 'descend',
      valueType: 'dateTimeRange',
      sorter: true,
      hideInTable: true,
      search: {
        transform: (value) => ({
          timestamp$BTW: value.toString(),
        }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => {
        let content = '';
        try {
          content = JSON.stringify(JSON.parse(record.content), null, 2);
        } catch (error) {
          content = record.content;
        }
        return [
          <a
            key="editable"
            onClick={() => Modal.info({ title: '详细信息', content: <pre>{content}</pre> })}
          >
            <Tooltip title="查看">
              <EyeOutlined />
            </Tooltip>
          </a>,
        ];
      },
    },
  ];

  return (
    <ProTable<LogItem>
      columns={columns}
      defaultParams={{
        deviceId: InstanceModel.detail.id,
      }}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
      request={(params) => service.queryLog(InstanceModel.detail.id!, params)}
    />
  );
};
export default Log;

import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { LogItem } from '@/pages/device/Instance/Detail/Log/typings';
import moment from 'moment';
import { Modal, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';

const Log = () => {
  const intl = useIntl();

  const columns: ProColumns<LogItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '类型',
      dataIndex: 'type',
      renderText: (type) => type.text,
      valueEnum: [], //TODO
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      defaultSortOrder: 'descend',
      renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
      pagination={{
        pageSize: 10,
      }}
      request={(params) => service.queryLog(InstanceModel.detail.id!, params)}
    />
  );
};
export default Log;

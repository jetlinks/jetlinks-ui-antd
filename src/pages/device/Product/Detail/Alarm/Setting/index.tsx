import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { AlarmSetting } from '@/pages/device/Product/typings';
import { Button, Space } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';

const Setting = () => {
  const intl = useIntl();
  const columns: ProColumns<AlarmSetting>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.category.key',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.createTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state.text',
    },
  ];

  return (
    <ProTable
      tableAlertOptionRender={() => (
        <Space size={16}>
          <Button onClick={() => {}}>新增告警</Button>
        </Space>
      )}
      columns={columns}
      rowKey="id"
      search={false}
    />
  );
};
export default Setting;

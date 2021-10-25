import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { AlarmSetting } from '@/pages/device/Product/typings';
import { Button, Space } from 'antd';

const Setting = () => {
  const columns: ProColumns<AlarmSetting>[] = [
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
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '状态',
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

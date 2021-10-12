import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { EyeOutlined, UnlockFilled } from '@ant-design/icons';
import type { TenantMember } from '@/pages/system/Tenant/typings';
import { service } from '@/pages/system/Tenant';
import { useParams } from 'umi';

const Member = () => {
  const param = useParams<{ id: string }>();
  const columns: ProColumns<TenantMember>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      title: '姓名',
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: '管理员',
      dataIndex: 'adminMember',
      renderText: (text) => (text ? '是' : '否'),
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (text) => text.text,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <a
          key="edit"
          onClick={() => {
            console.log(JSON.stringify(record));
          }}
        >
          <Tooltip title="查看资产">
            <EyeOutlined />
          </Tooltip>
        </a>,
        <a
          key="bind"
          onClick={() => {
            console.log(JSON.stringify(record));
          }}
        >
          <Tooltip title="解绑">
            <UnlockFilled />
          </Tooltip>
        </a>,
      ],
    },
  ];
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      request={(params) => service.queryMembers(param.id, params)}
    />
  );
};
export default Member;

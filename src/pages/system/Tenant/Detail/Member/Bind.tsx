import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/system/Tenant';
import { Space } from 'antd';
import { useParams } from 'umi';
import TenantModel from '@/pages/system/Tenant/model';
import { observer } from '@formily/react';
import { useRef } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { onlyMessage } from '@/utils/util';

interface Props {
  reload: () => void;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<UserItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '姓名',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'username',
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      search: {
        transform: (value) => ({ username$LIKE: value }),
      },
    },
  ];

  const handleBind = () => {
    service.handleUser(param.id, TenantModel.bindUsers, 'bind').subscribe({
      next: () => onlyMessage('操作成功'),
      error: () => onlyMessage('操作失败', 'error'),
      complete: () => {
        TenantModel.bindUsers = [];
        actionRef.current?.reload();
        props.reload();
      },
    });
  };

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 5,
      }}
      tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      columnEmptyText={''}
      tableAlertOptionRender={() => (
        <Space size={16}>
          <a onClick={handleBind}>批量绑定</a>
        </Space>
      )}
      rowSelection={{
        selectedRowKeys: TenantModel.bindUsers.map((item) => item.userId),
        onChange: (selectedRowKeys, selectedRows) => {
          TenantModel.bindUsers = selectedRows.map((item) => ({
            name: item.name,
            userId: item.id,
          }));
        },
      }}
      request={(params) => service.queryUser(params)}
      defaultParams={{
        'id$tenant-user$not': param.id,
      }}
    />
  );
});
export default Bind;

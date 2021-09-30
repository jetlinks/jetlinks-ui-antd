import { CloseOutlined } from '@ant-design/icons';
import type { ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Card, message, Space } from 'antd';
import { observer } from '@formily/react';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useEffect, useRef } from 'react';
import { BindModel } from '@/components/BindUser/model';
import { columns, service } from '@/components/BindUser/index';

const Unbound = observer(() => {
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const listener = Store.subscribe(SystemConst.BIND_USER_STATE, () =>
      actionRef.current?.reload(),
    );
    return () => listener.unsubscribe();
  });

  const handleBindResult = {
    next: () => message.success('绑定成功'),
    error: async () => {
      message.success('绑定失败');
    },
    complete: () => {
      // 通知左侧组件刷新
      Store.set(SystemConst.BIND_USER_STATE, 'true');
      actionRef.current?.reload();
      BindModel.bindUsers = [];
    },
  };

  const handleOrgBind = () => {
    service
      .saveOrgBind(
        BindModel.bindUsers.map((item) => item.userId),
        BindModel.dimension.id!,
      )
      .subscribe(handleBindResult);
  };

  const handleRoleBind = () => {
    const data = BindModel.bindUsers.map(
      (item) =>
        ({
          ...item,
          dimensionId: BindModel.dimension.id,
          dimensionTypeId: BindModel.dimension.type,
          dimensionName: BindModel.dimension.name,
        } as BindDataItem),
    );
    service.saveRoleBind(data).subscribe(handleBindResult);
  };

  const handleBind = async () => {
    const bindType = BindModel.dimension.type;
    switch (bindType) {
      case 'role':
        handleRoleBind();
        break;
      case 'org':
        handleOrgBind();
        break;
      default:
        message.error('绑定类型数据错误');
    }
  };

  return (
    <Card
      title="绑定新用户"
      extra={
        <CloseOutlined
          onClick={() => {
            BindModel.bind = false;
          }}
        />
      }
    >
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: BindModel.bindUsers.map((item) => item.userId),
          onChange: (selectedRowKeys, selectedRows) => {
            BindModel.bindUsers = selectedRows.map((item) => ({
              userId: item.id,
              userName: item.name,
            }));
          },
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
        tableAlertOptionRender={() => (
          <Space size={16}>
            <a onClick={handleBind}>批量绑定</a>
          </Space>
        )}
        size="small"
        columns={columns}
        pagination={{
          pageSize: 7,
        }}
        request={async (params) => service.query(params)}
        defaultParams={{
          [`id$in-dimension$${BindModel.dimension.type}$not`]: BindModel.dimension.id,
        }}
      />
    </Card>
  );
});
export default Unbound;

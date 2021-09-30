import { Button, Card, message, Space } from 'antd';
import type { ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { observer } from '@formily/react';
import { BindModel } from '@/components/BindUser/model';
import { columns, service } from '@/components/BindUser/index';

const Bound = observer(() => {
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const listener = Store.subscribe(SystemConst.BIND_USER_STATE, () =>
      actionRef.current?.reload(),
    );
    return () => listener.unsubscribe();
  });

  const handleUnBindData = () => {
    const {
      dimension: { id, type },
    } = BindModel;
    service.unBindData(BindModel.unBindUsers, type!, id!).subscribe({
      next: async () => {
        message.success('解绑成功');
      },
      error: async () => {
        message.error('操作失败');
      },
      complete: () => {
        // 通知右侧组建刷新
        Store.set(SystemConst.BIND_USER_STATE, 'true');
        actionRef.current?.reload();
        BindModel.unBindUsers = [];
      },
    });
  };

  return (
    <Card title="已绑定用户">
      <ProTable
        size="small"
        rowKey="id"
        rowSelection={{
          selectedRowKeys: BindModel.unBindUsers,
          onChange: (selectedRowKeys) => {
            BindModel.unBindUsers = selectedRowKeys as string[];
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
            <a onClick={handleUnBindData}>批量解绑</a>
          </Space>
        )}
        actionRef={actionRef}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        request={async (params) => service.query(params)}
        defaultParams={{
          'id$in-dimension$role': BindModel.dimension.id,
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              BindModel.bind = true;
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            绑定用户
          </Button>,
        ]}
      />
    </Card>
  );
});

export default Bound;

import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Button, Card, Col, message, Row, Space } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type { TenantMember } from '@/pages/system/Tenant/typings';
import { service } from '@/pages/system/Tenant';
import { useParams } from 'umi';
import Bind from '@/pages/system/Tenant/Detail/Member/Bind';
import { observer } from '@formily/react';
import TenantModel from '@/pages/system/Tenant/model';
import { useRef } from 'react';

const Member = observer(() => {
  const actionRef = useRef<ActionType>();

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
  ];
  const handleUnBind = () => {
    service.handleUser(param.id, TenantModel.unBindUsers, 'unbind').subscribe({
      next: () => message.success('操作成功'),
      error: () => message.error('操作失败'),
      complete: () => {
        TenantModel.unBindUsers = [];
        actionRef.current?.reload();
      },
    });
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={TenantModel.bind ? 12 : 24}>
        <Card title="租户成员">
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
            tableAlertOptionRender={() => (
              <Space size={16}>
                <a onClick={handleUnBind}>批量解绑</a>
              </Space>
            )}
            rowSelection={{
              selectedRowKeys: TenantModel.unBindUsers,
              onChange: (selectedRowKeys, selectedRows) => {
                TenantModel.unBindUsers = selectedRows.map((item) => item.id);
              },
            }}
            request={(params) => service.queryMembers(param.id, params)}
            toolBarRender={() => [
              <Button
                size="small"
                onClick={() => {
                  TenantModel.bind = true;
                }}
                icon={<PlusOutlined />}
                type="primary"
                key="bind"
              >
                绑定用户
              </Button>,
            ]}
          />
        </Card>
      </Col>
      {TenantModel.bind && (
        <Col span={12}>
          <Card
            title="添加用户"
            extra={
              <CloseOutlined
                onClick={() => {
                  TenantModel.bind = false;
                  TenantModel.bindUsers = [];
                }}
              />
            }
          >
            <Bind reload={() => actionRef.current?.reload()} />
          </Card>
        </Col>
      )}
    </Row>
  );
});
export default Member;

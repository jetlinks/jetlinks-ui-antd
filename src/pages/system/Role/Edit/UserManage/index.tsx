import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import { Button, Card, message, Popconfirm, Space, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import ProTable from '@jetlinks/pro-table';
import BindUser from './BindUser';
import { service } from '@/pages/system/User/index';
import encodeQuery from '@/utils/encodeQuery';
import { useParams } from 'umi';
import Service from '@/pages/system/Role/service';

const UserManage = () => {
  const roleService = new Service('role');
  const params = useParams<{ id: string }>();
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [bindUserVisible, setBindUserVisible] = useState<boolean>(false);
  const unBindUser = (id: string, ids: string[]) => {
    roleService.unbindUser(id, ids).subscribe((resp) => {
      if (resp.status === 200) {
        message.success('操作成功！');
        actionRef.current?.reload();
      }
    });
  };
  const columns: ProColumns<RoleItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: intl.formatMessage({
        id: 'pages.system.userName.tips',
        defaultMessage: '用户名过长会自动收缩',
      }),
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      dataIndex: 'username',
      filters: true,
      onFilter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a key="delete">
          <Popconfirm
            title={'确认解绑'}
            onConfirm={() => {
              unBindUser(params.id, [record.id]);
            }}
          >
            <Tooltip title={'解绑'}>
              <MinusOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];
  return (
    <Card>
      <ProTable
        actionRef={actionRef}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <a
              onClick={() => {
                setSelectedRowKeys([]);
                unBindUser(params.id, [...selectedRowKeys]);
              }}
            >
              批量解绑
            </a>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            onClick={() => {
              setBindUserVisible(true);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            添加
          </Button>,
        ]}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (key) => {
            setSelectedRowKeys(key as string[]);
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        request={async (param: any) => {
          const response = await service.query(
            encodeQuery({
              pageSize: param.pageSize,
              pageIndex: param.current,
              terms: {
                'id$in-dimension$role': params.id,
              },
            }),
          );
          return {
            result: { data: response.result.data },
            success: true,
            status: 200,
            total: response.result.total,
          } as any;
        }}
        columns={columns}
        rowKey="id"
      />
      <BindUser
        visible={bindUserVisible}
        data={{
          id: params.id || '',
        }}
        cancel={() => {
          setBindUserVisible(false);
          actionRef.current?.reload();
        }}
      />
    </Card>
  );
};
export default UserManage;

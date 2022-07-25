import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, Button, Card, Popconfirm, Space, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import BindUser from './BindUser';
import { service } from '@/pages/system/User/index';
import { useParams } from 'umi';
import Service from '@/pages/system/Role/service';
import moment from 'moment';
import SearchComponent from '@/components/SearchComponent';
import { onlyMessage } from '@/utils/util';

const UserManage = () => {
  const roleService = new Service('role');
  const params = useParams<{ id: string }>();
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [bindUserVisible, setBindUserVisible] = useState<boolean>(false);
  const [param, setParam] = useState<any>({ terms: [] });

  const unBindUser = (id: string, ids: string[]) => {
    roleService.unbindUser(id, ids).subscribe((resp) => {
      if (resp.status === 200) {
        onlyMessage('操作成功！');
        actionRef.current?.reload();
      }
    });
  };
  const columns: ProColumns<UserItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      // align: 'center',
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      render: (text, record) => (
        <Badge
          status={record?.status === 1 ? 'success' : 'error'}
          text={record?.status === 1 ? '正常' : '禁用'}
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
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
              <DisconnectOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];
  return (
    <Card>
      <SearchComponent<UserItem>
        field={columns}
        target="user"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setParam({});
        // }}
      />
      <ProTable
        actionRef={actionRef}
        search={false}
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
        columnEmptyText={''}
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
        request={async (data: any) => {
          const response = await service.query({
            pageSize: data.pageSize,
            pageIndex: data.current,
            terms: [
              {
                terms: [
                  {
                    column: 'id$in-dimension$role',
                    value: params.id,
                  },
                ],
              },
              ...(param?.terms || []),
            ],
          });
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

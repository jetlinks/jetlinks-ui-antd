import Service from '@/pages/system/User/serivce';
import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import Save from './Save';
import { observer } from '@formily/react';
import { AIcon, PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';
import ResetPassword from '@/pages/system/User/ResetPassword';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

export const service = new Service('user');

const User = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { minHeight } = useDomFullHeight(`.user`, 24);

  const { permission: userPermission } = usePermissions('system/User');
  const [model, setMode] = useState<'add' | 'edit' | 'query'>('query');
  const [current, setCurrent] = useState<Partial<UserItem>>({});
  const edit = async (record: UserItem) => {
    setMode('edit');
    setCurrent(record);
  };

  const [reset, setReset] = useState<boolean>(false);

  const typeMap = new Map();
  typeMap.set('1', 'red');
  typeMap.set('2', 'gold');
  typeMap.set('3', 'blue');
  typeMap.set('4', 'purple');

  const columns: ProColumns<UserItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '姓名',
      }),
      dataIndex: 'name',
      fixed: 'left',
      // copyable: true,
      ellipsis: true,
      // tip: intl.formatMessage({
      //   id: 'pages.system.name.tips',
      //   defaultMessage: '姓名过长会自动收缩',
      // }),
      // sorter: true,
      // defaultSortOrder: 'ascend',
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
      // copyable: true,
      ellipsis: true,
      // tip: intl.formatMessage({
      //   id: 'pages.system.userName.tips',
      //   defaultMessage: '用户名过长会自动收缩',
      // }),
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      hideInSearch: false,
    },
    {
      title: '用户类型',
      dataIndex: 'type',
      render: (_, row) => row.type?.name || '',
      valueType: 'select',
      request: () =>
        service.queryUserType().then((resp: any) =>
          resp.result.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      // filters: true,
      // onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.normal',
            defaultMessage: '正常',
          }),
          status: 1,
        },
        0: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.disable',
            defaultMessage: '禁用',
          }),
          status: 0,
        },
      },
      render: (text, record) => (
        <Badge status={record.status === 1 ? 'success' : 'error'} text={text} />
      ),
    },
    {
      dataIndex: 'telephone',
      title: '手机号',
    },
    {
      dataIndex: 'email',
      title: '邮箱',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          isPermission={userPermission.update}
          key="editable"
          onClick={() => edit(record)}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          style={{ padding: 0 }}
          isPermission={userPermission.action}
          type="link"
          key="changeState"
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}.tips`,
              defaultMessage: `确认${record.status ? '禁用' : '启用'}?`,
            }),
            onConfirm: async () => {
              await service.update({
                id: record.id,
                status: record.status ? 0 : 1,
              });
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            },
          }}
          tooltip={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}`,
              defaultMessage: record.status ? '禁用' : '启用',
            }),
          }}
        >
          {record.status ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          type="link"
          key="password"
          style={{ padding: 0 }}
          tooltip={{
            title: '重置密码',
          }}
          onClick={() => {
            setReset(true);
            setCurrent(record);
          }}
          isPermission={userPermission.update}
        >
          <AIcon type={'icon-zhongzhimima'} />
        </PermissionButton>,
        <PermissionButton
          type="link"
          key="delete"
          style={{ padding: 0 }}
          isPermission={userPermission.delete}
          disabled={record.status === 1}
          tooltip={{ title: record.status === 0 ? '删除' : '请先禁用该用户，再删除。' }}
        >
          <Popconfirm
            onConfirm={async () => {
              await service.remove(record.id);
              actionRef.current?.reload();
            }}
            title="确认删除?"
          >
            <DeleteOutlined />
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  const [param, setParam] = useState({});

  return (
    <PageContainer>
      <SearchComponent<UserItem>
        field={columns}
        target="user"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          // setParam(data);
          const terms1 = data.terms[0]?.terms?.map((e) => {
            if (e.column === 'telephone' || e.column === 'email') {
              return {
                column: 'id$user-detail',
                value: [e],
              };
            } else {
              return e;
            }
          });
          if (data.terms && data.terms.length === 2) {
            const terms2 = data.terms[1]?.terms?.map((e) => {
              if (e.column === 'telephone' || e.column === 'email') {
                return {
                  column: 'id$user-detail',
                  value: [e],
                };
              } else {
                return e;
              }
            });
            setParam({
              ...param,
              terms: [{ terms: terms1 }, { terms: terms2, type: data.terms[1].type }],
            });
          } else {
            setParam({
              ...param,
              terms: [{ terms: terms1 }],
            });
          }
        }}
      />
      <ProTable<UserItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        scroll={{ x: 1366 }}
        tableClassName={'user'}
        tableStyle={{ minHeight }}
        search={false}
        columnEmptyText={''}
        headerTitle={
          <PermissionButton
            onClick={() => {
              setMode('add');
            }}
            isPermission={userPermission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>
        }
        request={async (params) => {
          // console.log(params)
          // const item = params.terms.map((e:any) => {
          //  return e.terms
          // });
          // console.log(item)
          const res = await service.queryDetailList({
            ...params,
            sorts: [{ name: 'createTime', order: 'desc' }],
          });
          return {
            code: res.message,
            result: {
              data: res.result.data,
              pageIndex: res.result.pageIndex,
              pageSize: res.result.pageSize,
              total: res.result.total,
            },
            status: res.status,
          };
        }}
      />
      <Save
        model={model}
        close={() => {
          setMode('query');
          actionRef.current?.reload();
        }}
        data={current}
      />
      <ResetPassword data={current} visible={reset} close={() => setReset(false)} />
    </PageContainer>
  );
});
export default User;

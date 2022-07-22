import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import Service from './service';
import { useIntl } from '@@/plugin-locale/localeExports';
import { observer } from '@formily/react';
import { history } from 'umi';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';
import ProTable from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import { useDomFullHeight } from '@/hooks';
import Save from './Save';

export const service = new Service('role');

const Role: React.FC = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const permissionCode = 'system/Role';
  const { permission } = PermissionButton.usePermission(permissionCode);
  const { minHeight } = useDomFullHeight(`.role`, 24);
  const [model, setMode] = useState<'add' | 'edit' | 'query'>('query');

  const columns: ProColumns<RoleItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.role.id',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
      // copyable: true,
      ellipsis: true,
      fixed: 'left',
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
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.describe',
        defaultMessage: '描述',
      }),
      ellipsis: true,
      dataIndex: 'description',
      filters: true,
      onFilter: true,
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
          key="editable"
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          isPermission={permission.update}
          style={{ padding: 0 }}
          type="link"
          onClick={() => {
            history.push(`${getMenuPathByParams(MENUS_CODE['system/Role/Detail'], record.id)}`);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          key="delete"
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: 'pages.system.role.option.delete',
              defaultMessage: '确定要删除吗',
            }),
            onConfirm: () => {
              service.remove(record.id).then((res: any) => {
                if (res.status === 200) {
                  onlyMessage(
                    intl.formatMessage({
                      id: 'pages.data.option.success',
                      defaultMessage: '操作成功!',
                    }),
                  );
                  actionRef.current?.reload();
                }
              })
            },
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.delete',
              defaultMessage: '删除',
            }),
          }}
          isPermission={permission.delete}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const [param, setParam] = useState({});

  return (
    <PageContainer>
      <SearchComponent<RoleItem>
        field={columns}
        target="role"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<RoleItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        scroll={{ x: 1366 }}
        tableClassName={'role'}
        tableStyle={{ minHeight }}
        search={false}
        headerTitle={
          <PermissionButton
            onClick={() => {
              setMode('add');
            }}
            isPermission={permission.add}
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
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
      <Save
        model={model}
        close={() => {
          setMode('query');
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
});
export default Role;

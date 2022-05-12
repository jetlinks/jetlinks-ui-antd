import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import ProTable from '@jetlinks/pro-table';
import { BadgeStatus, PermissionButton } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { StatusColorEnum } from '@/components/BadgeStatus';
import SaveModal from './save';
import PasswordModal from './password';
import Service from './service';
import { message } from 'antd';

export const service = new Service('platforms');

export default () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [param, setParam] = useState({});
  const [saveVisible, setSaveVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { permission } = PermissionButton.usePermission('system/Platforms');

  const deleteById = async (id: string) => {
    const resp: any = await service.remove(id);
    if (resp.status === 200) {
      message.success('操作成功');
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      dataIndex: 'accessName',
      title: '用户名',
    },
    {
      dataIndex: 'role',
      title: '角色',
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      width: 160,
      valueType: 'select',
      renderText: (record) =>
        record ? (
          <BadgeStatus
            status={record.value}
            text={record.text}
            statusNames={{
              started: StatusColorEnum.processing,
              disable: StatusColorEnum.error,
              notActive: StatusColorEnum.warning,
            }}
          />
        ) : (
          ''
        ),
      valueEnum: {
        disable: {
          text: '禁用',
          status: 'offline',
        },
        started: {
          text: '正常',
          status: 'started',
        },
      },
    },
    {
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <PermissionButton
          key={'update'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          onClick={() => {}}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'empowerment'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: '赋权',
          }}
          onClick={() => {}}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'api'}
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: '查看API',
          }}
          onClick={() => {}}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'password'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.action}
          tooltip={{
            title: '重置密码',
          }}
          onClick={() => {
            setPasswordVisible(true);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'delete'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.delete}
          disabled={record.state.value === 'started'}
          popConfirm={{
            title: '确认删除？',
            disabled: record.state.value === 'started',
            onConfirm: () => {
              deleteById(record.id);
            },
          }}
          tooltip={{
            title:
              record.state.value === 'started' ? <span>请先禁用,再删除</span> : <span>删除</span>,
          }}
          onClick={() => {}}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={async (data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        actionRef={actionRef}
        headerTitle={
          <PermissionButton
            key="button"
            type="primary"
            isPermission={permission.add}
            onClick={() => {
              setSaveVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>
        }
      />
      <SaveModal
        visible={saveVisible}
        onCancel={() => {
          setSaveVisible(false);
        }}
        onReload={() => {
          actionRef.current?.reload();
        }}
      />
      <PasswordModal
        visible={passwordVisible}
        onCancel={() => {
          setPasswordVisible(false);
        }}
        onReload={() => {
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

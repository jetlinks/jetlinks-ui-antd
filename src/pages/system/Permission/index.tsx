import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Badge, Button, Dropdown, Menu, message, Popconfirm, Space, Upload } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import Service from '@/pages/system/Permission/service';
import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import Save from './Save';
import SystemConst from '@/utils/const';
import { downloadObject } from '@/utils/util';
import Token from '@/utils/token';
import { getButtonPermission } from '@/utils/menu';
import { PermissionButton } from '@/components';

export const service = new Service('permission');
const Permission: React.FC = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const permissionCode = 'system/Permission';

  const [param, setParam] = useState({});
  const [model, setMode] = useState<'add' | 'edit' | 'query'>('query');
  const [current, setCurrent] = useState<Partial<PermissionItem>>({});
  const { permission } = PermissionButton.usePermission(permissionCode);

  const edit = async (record: PermissionItem) => {
    setMode('edit');
    setCurrent(record);
  };

  const menu = (
    <Menu>
      <Menu.Item key="import">
        <Upload
          action={`/${SystemConst.API_BASE}/file/static`}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          showUploadList={false}
          accept=".json"
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result: any) => {
              try {
                const data = JSON.parse(result.target.result);
                service.batchAdd(data).subscribe((resp) => {
                  if (resp.status === 200) {
                    message.success('导入成功');
                    actionRef.current?.reload();
                  }
                });
              } catch (error) {
                message.error('导入失败，请重试！');
              }
            };
          }}
        >
          <Button disabled={getButtonPermission('system/Permission', ['import'])}>导入</Button>
        </Upload>
      </Menu.Item>
      <Menu.Item key="export">
        <Popconfirm
          disabled={getButtonPermission('system/Permission', ['export'])}
          title={'确认导出？'}
          onConfirm={() => {
            service.getPermission({ ...param, paging: false }).subscribe((resp) => {
              if (resp.status === 200) {
                downloadObject(resp.result, '权限数据');
                message.success('导出成功');
              } else {
                message.error('导出错误');
              }
            });
          }}
        >
          <Button disabled={getButtonPermission('system/Permission', ['export'])}>导出</Button>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const columns: ProColumns<PermissionItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.permission.id',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
      // copyable: true,
      ellipsis: true,
      // sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      // copyable: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      // filters: true,
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
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
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
            edit(record);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          type={'link'}
          key={'state'}
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: async () => {
              await service.update({
                ...record,
                id: record.id,
                status: record.status ? 0 : 1,
              });
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            },
          }}
          isPermission={permission.action}
          tooltip={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}`,
              defaultMessage: record.status ? '禁用' : '启用',
            }),
          }}
        >
          {record.status ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          type={'link'}
          key={'delete'}
          style={{ padding: 0 }}
          isPermission={permission.delete}
          popConfirm={{
            title: '确认删除',
            onConfirm: async () => {
              if (record.status) {
                await service.remove(record.id);
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            },
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<PermissionItem>
        field={columns}
        target="permission"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<PermissionItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        headerTitle={
          <Space>
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
            <Dropdown key={'more'} overlay={menu} placement="bottom">
              <Button>批量操作</Button>
            </Dropdown>
          </Space>
        }
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'id', order: 'asc' }] })
        }
      />
      <Save
        model={model}
        close={() => {
          setMode('query');
          actionRef.current?.reload();
        }}
        data={current}
      />
    </PageContainer>
  );
});

export default Permission;

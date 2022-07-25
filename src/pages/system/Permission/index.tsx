import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Badge, Button, Dropdown, Menu, Popconfirm, Space, Tooltip, Upload } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import Service from '@/pages/system/Permission/service';
import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import Save from './Save';
import SystemConst from '@/utils/const';
import { downloadObject, onlyMessage } from '@/utils/util';
import Token from '@/utils/token';
import { getButtonPermission } from '@/utils/menu';
import { PermissionButton } from '@/components';
import { useDomFullHeight } from '@/hooks';

export const service = new Service('permission');
const Permission: React.FC = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const permissionCode = 'system/Permission';
  const { minHeight } = useDomFullHeight(`.permission`, 24);
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
            if (file.type === 'application/json') {
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = (result: any) => {
                try {
                  const data = JSON.parse(result.target.result);
                  service.batchAdd(data).subscribe((resp) => {
                    if (resp.status === 200) {
                      onlyMessage('导入成功');
                      actionRef.current?.reload();
                    }
                  });
                } catch (error) {
                  onlyMessage('导入失败，请重试！', 'error');
                }
              };
            } else {
              onlyMessage('请上传json格式', 'error');
            }
          }}
        >
          <Tooltip
            title={
              getButtonPermission('system/Permission', ['import']) ? '暂无权限，请联系管理员' : ''
            }
          >
            <Button disabled={getButtonPermission('system/Permission', ['import'])}>导入</Button>
          </Tooltip>
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
                onlyMessage('导出成功');
              } else {
                onlyMessage('导出错误', 'error');
              }
            });
          }}
        >
          <Tooltip
            title={
              getButtonPermission('system/Permission', ['export']) ? '暂无权限，请联系管理员' : ''
            }
          >
            <Button disabled={getButtonPermission('system/Permission', ['export'])}>导出</Button>
          </Tooltip>
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
      fixed: 'left',
      width: '30%',
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
      // width:120,
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
              onlyMessage(
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
          {record.status ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          type={'link'}
          key={'delete'}
          style={{ padding: 0 }}
          disabled={!!record.status}
          isPermission={permission.delete}
          tooltip={{
            title: !!record.status ? '请先禁用，再删除' : '删除',
          }}
          popConfirm={{
            title: '确认删除',
            disabled: !!record.status,
            onConfirm: async () => {
              if (!record.status) {
                await service.remove(record.id).then((res: any) => {
                  if (res.status === 200) {
                    onlyMessage(
                      intl.formatMessage({
                        id: 'pages.data.option.success',
                        defaultMessage: '操作成功!',
                      }),
                    );
                    actionRef.current?.reload();
                  }
                });
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
        columnEmptyText={''}
        scroll={{ x: 1366 }}
        tableClassName={'permission'}
        tableStyle={{ minHeight }}
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

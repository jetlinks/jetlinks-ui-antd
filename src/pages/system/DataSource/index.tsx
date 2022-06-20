import Service from '@/pages/system/DataSource/service';
import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, Popconfirm } from 'antd';
import {
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';
import Save from './Save';
import { Store } from 'jetlinks-store';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

export const service = new Service('datasource/config');

const DataSource = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const history = useHistory<Record<string, string>>();

  const { permission: userPermission } = usePermissions('system/DataSource');
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<DataSourceItem>>({});
  const { minHeight } = useDomFullHeight(`.datasource`, 24);

  useEffect(() => {
    service.getType().then((res) => {
      if (res.status === 200) {
        const list = res?.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        Store.set('datasource-type', list);
      }
    });
  }, []);

  const columns: ProColumns<DataSourceItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
      width: 250,
    },
    {
      title: '类型',
      dataIndex: 'typeId',
      ellipsis: true,
      valueType: 'select',
      request: async () => {
        const res = await service.getType();
        if (res.status === 200) {
          const list = res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
          return list;
        }
        return [];
      },
      render: (_, row) =>
        (Store.get('datasource-type') || []).find((item: any) => row.typeId === item.value)
          ?.label || row.typeId,
      filterMultiple: true,
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      valueType: 'select',
      width: 120,
      valueEnum: {
        enabled: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.normal',
            defaultMessage: '正常',
          }),
          status: 'enabled',
        },
        disabled: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.disable',
            defaultMessage: '已禁用',
          }),
          status: 'disabled',
        },
      },
      render: (_, record) => (
        <Badge
          status={record.state?.value === 'enabled' ? 'success' : 'error'}
          text={record.state?.text}
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
      fixed: 'right',
      render: (_, record) => [
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          isPermission={userPermission.update}
          key="editable"
          onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}
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
          type="link"
          isPermission={userPermission.action}
          key="manage"
          disabled={record.state?.value !== 'enabled'}
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`system/DataSource/Management`]);
            history.push(`${url}?id=${record.id}`);
          }}
          tooltip={{
            title: record.state?.value !== 'enabled' ? '请先启用数据源' : '管理',
          }}
        >
          <DatabaseOutlined />
        </PermissionButton>,
        <PermissionButton
          style={{ padding: 0 }}
          isPermission={userPermission.action}
          type="link"
          key="changeState"
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${
                record.state?.value === 'enabled' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: `确认${record.state?.value === 'enabled' ? '禁用' : '启用'}?`,
            }),
            onConfirm: async () => {
              const resp = await service.changeStatus(
                record.id,
                record.state?.value === 'enabled' ? 'disable' : 'enable',
              );
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            },
          }}
          tooltip={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.state?.value === 'enabled' ? 'disabled' : 'enabled'}`,
              defaultMessage: record.state?.value === 'enabled' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state?.value === 'enabled' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          type="link"
          key="delete"
          style={{ padding: 0 }}
          isPermission={userPermission.delete}
          disabled={record.state?.value === 'enabled'}
          tooltip={{ title: record.state?.value === 'disabled' ? '删除' : '请先禁用，再删除。' }}
        >
          <Popconfirm
            onConfirm={async () => {
              const resp: any = await service.remove(record.id);
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
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
      <SearchComponent<DataSourceItem>
        field={columns}
        target="datasource"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<DataSourceItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        rowKey="id"
        scroll={{ x: 1366 }}
        tableClassName={'datasource'}
        tableStyle={{ minHeight }}
        headerTitle={
          <PermissionButton
            onClick={() => {
              setCurrent({});
              setVisible(true);
            }}
            isPermission={userPermission.add}
            key="add"
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
      {visible && (
        <Save
          close={() => {
            setVisible(false);
          }}
          data={current}
          reload={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
});
export default DataSource;

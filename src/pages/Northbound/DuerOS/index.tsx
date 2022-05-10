import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton, ProTableCard } from '@/components';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';

export default () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useState<any>({});

  const { permission } = PermissionButton.usePermission('Northbound/DuerOS');

  const Tools = (record: any, type: 'card' | 'table') => {
    return [
      <PermissionButton
        key={'update'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.update}
        tooltip={
          type === 'table'
            ? {
                title: intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                }),
              }
            : undefined
        }
        onClick={() => {}}
      >
        <EditOutlined />
        {type !== 'table' &&
          intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
      </PermissionButton>,
      <PermissionButton
        key={'started'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.action}
        popConfirm={{
          title: intl.formatMessage({
            id: `pages.data.option.${
              record.state.value === 'started' ? 'disabled' : 'enabled'
            }.tips`,
            defaultMessage: '确认禁用？',
          }),
          onConfirm: async () => {},
        }}
        tooltip={
          type === 'table'
            ? {
                title: intl.formatMessage({
                  id: `pages.data.option.${
                    record.state.value === 'started' ? 'disabled' : 'enabled'
                  }`,
                  defaultMessage: '启用',
                }),
              }
            : undefined
        }
      >
        {record.state.value === 'started' ? <StopOutlined /> : <PlayCircleOutlined />}
        {type !== 'table' &&
          intl.formatMessage({
            id: `pages.data.option.${record.state.value === 'started' ? 'disabled' : 'enabled'}`,
            defaultMessage: record.state.value === 'started' ? '禁用' : '启用',
          })}
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
          onConfirm: () => {},
        }}
        tooltip={{
          title:
            record.state.value === 'started' ? <span>请先禁用,再删除</span> : <span>删除</span>,
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<DuerOSType>[] = [
    {
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => Tools(record, 'table'),
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<DuerOSType>
        field={columns}
        target="device-instance"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<DuerOSType>
        rowKey="id"
        search={false}
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
      />
    </PageContainer>
  );
};

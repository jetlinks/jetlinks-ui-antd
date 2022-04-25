import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { Badge, message } from 'antd';
import { EditOutlined, PlayCircleOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { PermissionButton, ProTableCard } from '@/components';
import { statusMap } from '@/pages/device/Instance';
import SearchComponent from '@/components/SearchComponent';
import SceneCard from '@/components/ProTableCard/CardItems/scene';
import Service from './service';
import { useHistory } from 'umi';
import { getMenuPathByCode } from '@/utils/menu';

export const service = new Service('rule-engine/scene');

const Scene = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('rule-engine/Scene');
  const [searchParams, setSearchParams] = useState<any>({});
  const history = useHistory();

  const Tools = (record: any, type: 'card' | 'table'): React.ReactNode[] => {
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
      >
        <EditOutlined />
        {type === 'table' &&
          intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
      </PermissionButton>,
      <PermissionButton
        key={'update'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.action}
        popConfirm={{
          title: intl.formatMessage({
            id: `pages.data.option.${
              record.state.value !== 'notActive' ? 'disabled' : 'enabled'
            }.tips`,
            defaultMessage: '确认禁用？',
          }),
          onConfirm: async () => {
            message.success(
              intl.formatMessage({
                id: 'pages.data.option.success',
                defaultMessage: '操作成功!',
              }),
            );
            actionRef.current?.reload();
          },
        }}
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
      >
        {record.state.value !== 'notActive' ? <StopOutlined /> : <PlayCircleOutlined />}
        {type === 'table' &&
          intl.formatMessage({
            id: `pages.data.option.${record.state.value !== 'notActive' ? 'disabled' : 'enabled'}`,
            defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
          })}
      </PermissionButton>,
      <PermissionButton
        key={'delete'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.delete}
        popConfirm={{
          title: intl.formatMessage({
            id:
              record.state.value === 'notActive'
                ? 'pages.data.option.remove.tips'
                : 'pages.device.instance.deleteTip',
          }),
          onConfirm: async () => {},
        }}
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
      >
        <EditOutlined />
        {type === 'table' &&
          intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<SceneItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'triggers',
      title: intl.formatMessage({
        id: 'pages.ruleEngine.scene.triggers',
        defaultMessage: '触发方式',
      }),
    },
    {
      dataIndex: 'describe',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      width: '90px',
      valueType: 'select',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueEnum: {
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'online',
        },
      },
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
      <SearchComponent
        field={columns}
        target={'rule-engine-scene'}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<SceneItem>
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        headerTitle={[
          <PermissionButton
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            isPermission={permission.add}
            onClick={() => {
              const url = getMenuPathByCode('rule-engine/Scene/Save');
              history.push(url);
            }}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
        cardRender={(record) => <SceneCard {...record} tools={Tools(record, 'card')} />}
      />
    </PageContainer>
  );
};
export default Scene;

import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { BadgeStatus, PermissionButton, ProTableCard } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import SceneCard from '@/components/ProTableCard/CardItems/scene';
import Service from './service';
import { useHistory, useIntl } from 'umi';
import { getMenuPathByCode } from '@/utils/menu';
import { StatusColorEnum } from '@/components/BadgeStatus';

export const service = new Service('scene');

enum TriggerWayType {
  manual = '手动触发',
  timer = '定时触发',
  device = '设备触发',
}

const Scene = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('rule-engine/Scene');
  const [searchParams, setSearchParams] = useState<any>({});
  const history = useHistory();

  const deleteById = async (id: string) => {
    const alarmResp = await service.sceneByAlarm(id);
    if (alarmResp.status === 200 && !alarmResp.result) {
      const resp: any = await service.remove(id);
      if (resp.status === 200) {
        actionRef.current?.reload();
      }
    } else {
      message.warning('该场景已绑定告警，不可删除');
    }
  };

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
        onClick={() => {
          const url = getMenuPathByCode('rule-engine/Scene/Save');
          history.push(`${url}?id=${record.id}`);
        }}
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
          onConfirm: async () => {
            if (record.state.value !== 'started') {
              const resp = await service.startScene(record.id);
              if (resp.status === 200) {
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            } else {
              const resp = await service.stopScene(record.id);
              if (resp.status === 200) {
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            }
          },
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
          onConfirm: () => {
            deleteById(record.id);
          },
        }}
        tooltip={{
          title:
            record.state.value === 'started' ? (
              <span>请先禁用该场景,再删除</span>
            ) : (
              <span>删除</span>
            ),
        }}
      >
        <DeleteOutlined />
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
      dataIndex: 'triggerType',
      title: intl.formatMessage({
        id: 'pages.ruleEngine.scene.triggers',
        defaultMessage: '触发方式',
      }),
      width: 120,
      valueType: 'select',
      valueEnum: {
        manual: {
          text: '手动触发',
          status: 'manual',
        },
        timer: {
          text: '定时触发',
          status: 'timer',
        },
        device: {
          text: '设备触发',
          status: 'device',
        },
      },
      renderText: (record) => TriggerWayType[record],
    },
    {
      dataIndex: 'description',
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

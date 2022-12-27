import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import {
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PermissionButton, ProTableCard } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import SceneCard from '@/components/ProTableCard/CardItems/Scene';
import Service from './service';
import { useIntl } from 'umi';
import { onlyMessage } from '@/utils/util';
import useHistory from '@/hooks/route/useHistory';
import Save from './Save/save';
import { getMenuPathByCode } from '@/utils/menu';

export const service = new Service('scene');

const Scene = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('rule-engine/Scene');
  const [searchParams, setSearchParams] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<SceneItem>>({});
  const history = useHistory();

  const deleteById = async (id: string) => {
    // const alarmResp = await service.sceneByAlarm(id);
    // if (alarmResp.status === 200 && !alarmResp.result) {
    const resp: any = await service.remove(id);
    if (resp.status === 200) {
      actionRef.current?.reload();
    }
    // } else {
    //   onlyMessage('该场景已绑定告警，不可删除', 'warning');
    // }
  };

  const Tools = (record: SceneItem): React.ReactNode[] => {
    return [
      <PermissionButton
        key={'update'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.update}
        onClick={() => {
          setVisible(true);
          setCurrent(record);
        }}
      >
        <EditOutlined />
        {intl.formatMessage({
          id: 'pages.data.option.edit',
          defaultMessage: '编辑',
        })}
      </PermissionButton>,
      record.triggerType === 'manual' && (
        <PermissionButton
          key="trigger"
          type="link"
          style={{ padding: 0 }}
          isPermission={permission.tigger}
          tooltip={{
            title: record.state?.value === 'disable' ? '未启用，不能手动触发' : '',
          }}
          disabled={record.state?.value === 'disable'}
          popConfirm={{
            disabled: record.state?.value === 'disable',
            title: '确认手动触发?',
            onConfirm: async () => {
              await service._execute(record.id);
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            },
          }}
        >
          <LikeOutlined />
          {'手动触发'}
        </PermissionButton>
      ),
      <PermissionButton
        key={'started'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.action}
        disabled={!(!!record?.triggerType && (record?.branches || [])?.length)}
        tooltip={{
          title: !(!!record.triggerType && (record.branches || [])?.length)
            ? '未配置规则的不能启用'
            : '',
        }}
        popConfirm={{
          title: intl.formatMessage({
            id: `pages.data.option.${
              record.state.value === 'started' ? 'disable' : 'enabled'
            }.tips`,
            defaultMessage: '确认禁用？',
          }),
          onConfirm: async () => {
            if (record.state.value !== 'started') {
              const resp = await service.startScene(record.id);
              if (resp.status === 200) {
                onlyMessage(
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
                onlyMessage(
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
      >
        {record.state.value === 'started' ? <StopOutlined /> : <PlayCircleOutlined />}
        {intl.formatMessage({
          id: `pages.data.option.${record.state.value === 'started' ? 'disable' : 'enabled'}`,
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
          title: record.state.value === 'started' ? <span>请先禁用该场景,再删除</span> : '',
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<SceneItem>[] = [
    {
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
      width: 300,
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
      valueType: 'select',
      valueEnum: {
        started: {
          text: '正常',
          status: 'started',
        },
        disable: {
          text: '禁用',
          status: 'disable',
        },
      },
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
        scroll={{ x: 1366 }}
        params={searchParams}
        columnEmptyText={''}
        gridColumn={1}
        onlyCard={true}
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
              setCurrent({});
              setVisible(true);
            }}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
        cardRender={(record) => (
          <SceneCard
            {...record}
            onClick={() => {
              const url = getMenuPathByCode('rule-engine/Scene/Save');
              history.push(`${url}?triggerType=${record.trigger?.type}&id=${record?.id}`);
            }}
            tools={Tools(record)}
          />
        )}
      />
      {visible && (
        <Save
          data={current}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Scene;

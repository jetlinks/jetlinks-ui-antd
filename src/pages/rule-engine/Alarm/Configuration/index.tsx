import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton } from '@/components';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import { message, Space } from 'antd';
import ProTableCard from '@/components/ProTableCard';
import Save from './Save';
import Service from '@/pages/rule-engine/Alarm/Configuration/service';
import AlarmConfig from '@/components/ProTableCard/CardItems/AlarmConfig';

const service = new Service('alarm/config');

const Configuration = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [current, setCurrent] = useState<any>();
  const columns: ProColumns<ConfigurationItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      title: '类型',
      dataIndex: 'targetType',
    },
    {
      title: '告警级别',
      dataIndex: 'level',
    },
    {
      title: '关联场景联动',
      dataIndex: 'sceneName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => state.text,
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        record.sceneTriggerType === 'manual' && (
          <PermissionButton
            key="trigger"
            isPermission={true}
            popConfirm={{
              title: '确认手动触发?',
              onConfirm: async () => {
                await service._execute(record.sceneId);
                message.success(
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
          </PermissionButton>
        ),
        <PermissionButton
          isPermission={true}
          key="edit"
          style={{ padding: 0 }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          type="link"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={true}
          key="action"
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${
                record?.state?.value === 'disable' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: `确认${record?.state?.value === 'disable' ? '禁用' : '启用'}?`,
            }),
            onConfirm: async () => {
              if (record?.state?.value === 'disable') {
                await service._enable(record.id);
              } else {
                await service._disable(record.id);
              }
              setVisible(true);
              setCurrent(record);
              message.success(
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
              id: `pages.data.option.${
                record?.state?.value === 'disable' ? 'disabled' : 'enabled'
              }`,
              defaultMessage: record?.state?.value === 'disable' ? '禁用' : '启用',
            }),
          }}
          type="link"
        >
          {record.state.value === 'disable' ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          type="link"
          isPermission={true}
          key="delete"
          style={{ padding: 0 }}
          popConfirm={{
            title: '确认删除?',
            onConfirm: () => service.remove(record.id),
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            }),
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const [param, setParam] = useState({});

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTableCard<any>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        request={(params) => service.query(params)}
        gridColumn={3}
        cardRender={(record) => (
          <AlarmConfig
            {...record}
            actions={[
              record.sceneTriggerType === 'manual' && (
                <PermissionButton
                  key="trigger"
                  isPermission={true}
                  popConfirm={{
                    title: '确认手动触发?',
                    onConfirm: async () => {
                      await service._execute(record.sceneId);
                      message.success(
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
                  手动触发
                </PermissionButton>
              ),
              <PermissionButton
                isPermission={true}
                key="edit"
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
              >
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                isPermission={true}
                style={{ padding: 0 }}
                popConfirm={{
                  title: intl.formatMessage({
                    id: `pages.data.option.${
                      record.state?.value === 'disable' ? 'disabled' : 'enabled'
                    }.tips`,
                    defaultMessage: `确认${record.state.value === 'disable' ? '禁用' : '启用'}?`,
                  }),
                  onConfirm: async () => {
                    if (record.state?.value === 'disable') {
                      await service._enable(record.id);
                    } else {
                      await service._disable(record.id);
                    }
                    setVisible(true);
                    setCurrent(record);
                    message.success(
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
                    id: `pages.data.option.${
                      record.state.value === 'disable' ? 'disabled' : 'enabled'
                    }`,
                    defaultMessage: record.state.value === 'disable' ? '禁用' : '启用',
                  }),
                }}
                key="action"
                type="link"
              >
                {record.state.value === 'disable' ? (
                  <CloseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )}
                {record.state.value === 'disable' ? '禁用' : '启用'}
              </PermissionButton>,
              <PermissionButton
                popConfirm={{
                  title: '确认删除?',
                  onConfirm: async () => {
                    await service.remove(record.id);
                    actionRef.current?.reset?.();
                  },
                }}
                isPermission={true}
                key="delete"
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={true}
              onClick={() => {
                setCurrent(undefined);
                setVisible(true);
              }}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
            >
              {intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              })}
            </PermissionButton>
          </Space>
        }
      />
      <Save data={current} visible={visible} close={() => setVisible(false)} />
    </PageContainer>
  );
};
export default Configuration;

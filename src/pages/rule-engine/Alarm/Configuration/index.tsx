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
import { useEffect, useRef, useState } from 'react';
import { Badge, message, Space } from 'antd';
import ProTableCard from '@/components/ProTableCard';
import Save from './Save';
import Service from '@/pages/rule-engine/Alarm/Configuration/service';
import AlarmConfig from '@/components/ProTableCard/CardItems/AlarmConfig';
import { Store } from 'jetlinks-store';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';

const service = new Service('alarm/config');

const Configuration = () => {
  const intl = useIntl();
  const history = useHistory();
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('rule-engine/Alarm/Configuration');

  const [current, setCurrent] = useState<any>();
  const columns: ProColumns<ConfigurationItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '类型',
      dataIndex: 'targetType',
      renderText: (text: string) => {
        const map = {
          product: '产品',
          device: '设备',
          org: '部门',
          other: '其他',
        };
        return map[text];
      },
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      render: (text: any) => (
        <span>
          {(Store.get('default-level') || []).find((item: any) => item?.level === text)?.title ||
            text}
        </span>
      ),
    },
    {
      title: '关联场景联动',
      dataIndex: 'sceneName',
      width: 250,
      render: (text: any, record: any) => (
        <PermissionButton
          type={'link'}
          isPermission={!!getMenuPathByCode(MENUS_CODE['rule-engine/Scene'])}
          style={{ padding: 0, height: 'auto', width: '100%' }}
          tooltip={{
            title: !!getMenuPathByCode(MENUS_CODE['rule-engine/Scene'])
              ? text
              : '没有权限，请联系管理员',
          }}
          onClick={() => {
            const url = getMenuPathByCode('rule-engine/Scene/Save');
            history.push(`${url}?id=${record.sceneId}`);
          }}
        >
          <span className="ellipsis">{text}</span>
        </PermissionButton>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'left',
      fixed: 'right',
      width: 150,
      render: (_, record) => [
        record.sceneTriggerType === 'manual' && (
          <PermissionButton
            key="trigger"
            type="link"
            style={{ padding: 0 }}
            isPermission={permission.tigger}
            tooltip={{
              title: record.state?.value === 'disabled' ? '未启用，不能手动触发' : '',
            }}
            disabled={record.state?.value === 'disabled'}
            popConfirm={{
              disabled: record.state?.value === 'disabled',
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
          isPermission={permission.update}
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
          isPermission={permission.action}
          key="action"
          style={{ padding: 0 }}
          popConfirm={{
            title: `${
              record.state?.value !== 'disabled'
                ? '禁用告警不会影响关联的场景状态，确定要禁用吗'
                : '确认启用'
            }?`,
            onConfirm: async () => {
              if (record.state?.value === 'disabled') {
                await service._enable(record.id);
              } else {
                await service._disable(record.id);
              }
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
                record.state?.value !== 'disabled' ? 'disabled' : 'enabled'
              }`,
              defaultMessage: record.state?.value !== 'disabled' ? '禁用' : '启用',
            }),
          }}
          type="link"
        >
          {record.state?.value === 'disabled' ? <PlayCircleOutlined /> : <CloseCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          type="link"
          isPermission={permission.delete}
          key="delete"
          disabled={record.state?.value !== 'disabled'}
          style={{ padding: 0 }}
          popConfirm={{
            disabled: record.state?.value !== 'disabled',
            title: '确认删除?',
            onConfirm: () => service.remove(record.id),
          }}
          tooltip={{
            title: record.state?.value === 'disabled' ? '删除' : '已启用，不能删除',
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const [param, setParam] = useState({});

  useEffect(() => {
    service.queryDefaultLevel().then((resp) => {
      if (resp.status === 200) {
        Store.set('default-level', resp.result?.levels || []);
      }
    });
  }, []);

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
        scroll={{ x: 1366 }}
        params={param}
        columns={columns}
        request={(params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        gridColumn={3}
        cardRender={(record) => (
          <AlarmConfig
            {...record}
            actions={[
              record.sceneTriggerType === 'manual' ? (
                <PermissionButton
                  key="trigger"
                  type="link"
                  tooltip={{
                    title: record.state?.value === 'disabled' ? '未启用，不能手动触发' : '',
                  }}
                  disabled={record.state?.value === 'disabled'}
                  isPermission={permission.tigger}
                  popConfirm={{
                    title: '确认手动触发?',
                    disabled: record.state?.value === 'disabled',
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
              ) : null,
              <PermissionButton
                isPermission={permission.update}
                key="edit"
                type="link"
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
              >
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                isPermission={permission.action}
                style={{ padding: 0 }}
                popConfirm={{
                  title: `${
                    record.state?.value !== 'disabled'
                      ? '禁用告警不会影响关联的场景状态，确定要禁用吗'
                      : '确认启用'
                  }?`,
                  onConfirm: async () => {
                    if (record.state?.value === 'disabled') {
                      await service._enable(record.id);
                    } else {
                      await service._disable(record.id);
                    }
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
                      record.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                    }`,
                    defaultMessage: record.state?.value !== 'disabled' ? '禁用' : '启用',
                  }),
                }}
                key="action"
                type="link"
              >
                {record.state?.value !== 'disabled' ? (
                  <CloseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )}
                {record.state?.value !== 'disabled' ? '禁用' : '启用'}
              </PermissionButton>,
              <PermissionButton
                type="link"
                tooltip={{
                  title: record.state?.value === 'disabled' ? '删除' : '已启用，不能删除',
                }}
                disabled={record.state?.value !== 'disabled'}
                popConfirm={{
                  disabled: record.state?.value !== 'disabled',
                  title: '确认删除?',
                  onConfirm: async () => {
                    await service.remove(record.id);
                    actionRef.current?.reset?.();
                  },
                }}
                isPermission={permission.delete}
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
              isPermission={permission.add}
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
      <Save
        data={current}
        visible={visible}
        close={() => {
          setVisible(false);
          actionRef.current?.reset?.();
        }}
      />
    </PageContainer>
  );
};
export default Configuration;

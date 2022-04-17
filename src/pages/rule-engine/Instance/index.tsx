import { PageContainer } from '@ant-design/pro-layout';
import Service from '@/pages/rule-engine/Instance/serivce';
import type { InstanceItem } from '@/pages/rule-engine/Instance/typings';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { BadgeStatus, PermissionButton, ProTableCard } from '@/components';
import RuleInstanceCard from '@/components/ProTableCard/CardItems/ruleInstance';
import Save from '@/pages/rule-engine/Instance/Save';
import SystemConst from '@/utils/const';
import { StatusColorEnum } from '@/components/BadgeStatus';

export const service = new Service('rule-engine/instance');

const Instance = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<InstanceItem>>({});
  const [searchParams, setSearchParams] = useState<any>({});
  const { permission } = PermissionButton.usePermission('rule-engine/Instance');

  const tools = (record: InstanceItem) => [
    <PermissionButton
      isPermission={permission.update}
      key="warning"
      onClick={() => {
        setCurrent(record);
        setVisible(true);
      }}
      type={'link'}
      style={{ padding: 0 }}
      tooltip={{
        title: intl.formatMessage({
          id: 'pages.data.option.edit',
          defaultMessage: '编辑',
        }),
      }}
    >
      <EditOutlined />
      编辑
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      key={'state'}
      style={{ padding: 0 }}
      popConfirm={{
        title: `确认${record.state.value !== 'disable' ? '禁用' : '启用'}`,
        onConfirm: async () => {
          if (record.state.value !== 'disable') {
            await service.stopRule(record.id);
          } else {
            await service.startRule(record.id);
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
      isPermission={permission.action}
      tooltip={{
        title: record.state.value !== 'disable' ? '禁用' : '启用',
      }}
    >
      {record.state.value !== 'disable' ? (
        <span>
          <StopOutlined />
          禁用
        </span>
      ) : (
        <span>
          <CheckCircleOutlined />
          启用
        </span>
      )}
    </PermissionButton>,
    <PermissionButton
      isPermission={permission.delete}
      popConfirm={{
        title: '确认删除',
        onConfirm: async () => {
          if (record.state.value === 'disable') {
            await service.remove(record.id);
            message.success(
              intl.formatMessage({
                id: 'pages.data.option.success',
                defaultMessage: '操作成功!',
              }),
            );
            actionRef.current?.reload();
          } else {
            message.error('未停止不能删除');
          }
        },
      }}
      key="delete"
      type="link"
    >
      <DeleteOutlined />
      删除
    </PermissionButton>,
  ];

  const columns: ProColumns<InstanceItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      ellipsis: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text: any, record: any) => (
        <BadgeStatus
          status={record.state?.value}
          text={record.state?.text}
          statusNames={{
            started: StatusColorEnum.success,
            disable: StatusColorEnum.error,
          }}
        />
      ),
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
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="warning"
          onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <Button
          type="link"
          style={{ padding: 0 }}
          key={'view'}
          onClick={() => {
            window.open(`/${SystemConst.API_BASE}/rule-editor/index.html#flow/${record.id}`);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.detail',
              defaultMessage: '查看',
            })}
          >
            <EyeOutlined />
          </Tooltip>
        </Button>,
        <PermissionButton
          type={'link'}
          key={'state'}
          style={{ padding: 0 }}
          popConfirm={{
            title: `确认${record.state.value !== 'disable' ? '禁用' : '启用'}`,
            onConfirm: async () => {
              if (record.state.value !== 'disable') {
                await service.stopRule(record.id);
              } else {
                await service.startRule(record.id);
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
          isPermission={permission.action}
          tooltip={{
            title: record.state.value !== 'disable' ? '禁用' : '启用',
          }}
        >
          {record.state.value !== 'disable' ? <StopOutlined /> : <CheckCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          popConfirm={{
            title: '确认删除',
            onConfirm: async () => {
              if (record.state.value === 'disable') {
                await service.remove(record.id);
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              } else {
                message.error('未停止不能删除');
              }
            },
          }}
          key="button"
          type="link"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<InstanceItem>
        field={columns}
        target="device-instance"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<InstanceItem>
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
        pagination={{ pageSize: 10 }}
        headerTitle={[
          <PermissionButton
            isPermission={permission.add}
            key="add"
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            icon={<PlusOutlined />}
            type="primary"
            tooltip={{
              title: intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              }),
            }}
          >
            新增
          </PermissionButton>,
        ]}
        cardRender={(record) => (
          <RuleInstanceCard
            {...record}
            actions={tools(record)}
            detail={
              <div
                style={{ padding: 8, fontSize: 24 }}
                onClick={() => {
                  window.open(`/${SystemConst.API_BASE}/rule-editor/index.html#flow/${record.id}`);
                }}
              >
                <EyeOutlined />
              </div>
            }
          />
        )}
      />
      {visible && (
        <Save
          data={current}
          close={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Instance;

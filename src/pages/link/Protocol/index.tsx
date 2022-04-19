import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { Badge, message } from 'antd';
import { useRef, useState } from 'react';
import {
  PlayCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Service from '@/pages/link/Protocol/service';
import { useIntl } from 'umi';
import SearchComponent from '@/components/SearchComponent';
import { PermissionButton, ProTableCard } from '@/components';
import ProcotolCard from '@/components/ProTableCard/CardItems/protocol';
import Save from './save';

export const service = new Service('protocol');

const Protocol = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<ProtocolItem | undefined>();
  const [searchParams, setSearchParams] = useState<any>({});
  const { permission } = PermissionButton.usePermission('link/Protocol');
  const intl = useIntl();

  const modifyState = async (id: string, type: 'deploy' | 'un-deploy') => {
    const resp = await service.modifyState(id, type);
    if (resp.status === 200) {
      message.success('操作成功!');
    } else {
      message.error(resp?.message || '操作失败');
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<ProtocolItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
      ellipsis: true,
      defaultSortOrder: 'ascend',
    },
    {
      dataIndex: 'name',
      ellipsis: true,
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      title: '类型',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        jar: {
          text: 'jar',
          status: 'jar',
        },
        local: {
          text: 'local',
          status: 'local',
        },
      },
    },
    {
      dataIndex: 'state',
      title: '状态',
      renderText: (text) => (
        <Badge color={text !== 1 ? 'red' : 'green'} text={text !== 1 ? '未发布' : '已发布'} />
      ),
    },
    {
      dataIndex: 'description',
      ellipsis: true,
      title: '说明',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
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
        <PermissionButton
          isPermission={permission.action}
          key="action"
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: record.state === 1 ? '撤销' : '发布',
          }}
          popConfirm={{
            title: `确认${record.state === 1 ? '撤销' : '发布'}`,
            onConfirm: () => {
              if (record.state === 1) {
                modifyState(record.id, 'un-deploy');
              } else {
                modifyState(record.id, 'deploy');
              }
            },
          }}
        >
          {record.state === 1 ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          tooltip={{
            title: record.state !== 1 ? '删除' : '请先禁用该协议，再删除',
          }}
          style={{ padding: 0 }}
          disabled={record.state === 1}
          popConfirm={{
            title: '确认删除',
            disabled: record.state === 1,
            onConfirm: async () => {
              const resp: any = await service.remove(record.id);
              if (resp.status === 200) {
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              } else {
                message.error(resp?.message || '操作失败');
              }
            },
          }}
          key="delete"
          type="link"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<ProtocolItem>
        field={columns}
        target="Protocol"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<ProtocolItem>
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
            onClick={() => {
              setVisible(true);
              setCurrent(undefined);
            }}
            style={{ marginRight: 12 }}
            isPermission={permission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
        cardRender={(record) => (
          <ProcotolCard
            {...record}
            actions={[
              <PermissionButton
                isPermission={permission.update}
                key="edit"
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
                isPermission={permission.action}
                key="action"
                type={'link'}
                style={{ padding: 0 }}
                tooltip={{
                  title: record.state === 1 ? '撤销' : '发布',
                }}
                popConfirm={{
                  title: `确认${record.state === 1 ? '撤销' : '发布'}`,
                  onConfirm: () => {
                    if (record.state === 1) {
                      modifyState(record.id, 'un-deploy');
                    } else {
                      modifyState(record.id, 'deploy');
                    }
                  },
                }}
              >
                {record.state === 1 ? <StopOutlined /> : <PlayCircleOutlined />}
                {record.state === 1 ? '撤销' : '发布'}
              </PermissionButton>,
              <PermissionButton
                isPermission={permission.delete}
                tooltip={{
                  title: record.state !== 1 ? '删除' : '请先禁用该协议，再删除',
                }}
                disabled={record.state === 1}
                popConfirm={{
                  title: '确认删除',
                  disabled: record.state === 1,
                  onConfirm: async () => {
                    const resp: any = await service.remove(record.id);
                    if (resp.status === 200) {
                      message.success(
                        intl.formatMessage({
                          id: 'pages.data.option.success',
                          defaultMessage: '操作成功!',
                        }),
                      );
                      actionRef.current?.reload();
                    } else {
                      message.error(resp?.message || '操作失败');
                    }
                  },
                }}
                key="delete"
                type="link"
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
      {visible && (
        <Save
          data={current}
          close={() => {
            setVisible(false);
          }}
          reload={() => {
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default Protocol;

import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import { history } from 'umi';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton, ProTableCard } from '@/components';
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import AliyunCard from '@/components/ProTableCard/CardItems/aliyun';
import Service from './service';
import { Badge } from 'antd';
import { onlyMessage } from '@/utils/util';

export const service = new Service('device/aliyun/bridge');

const AliCloud = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useState<any>({});

  const { permission } = PermissionButton.usePermission('Northbound/AliCloud');

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
        onClick={() => {
          const url = `${getMenuPathByParams(MENUS_CODE['Northbound/AliCloud/Detail'], record.id)}`;
          history.push(url);
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
        key={'action'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.action}
        popConfirm={{
          title: intl.formatMessage({
            id: `pages.data.option.${
              record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
            }.tips`,
            defaultMessage: '确认禁用？',
          }),
          onConfirm: async () => {
            const resp =
              record?.state?.value !== 'disabled'
                ? await service._disable(record.id)
                : await service._enable(record.id);
            if (resp.status === 200) {
              onlyMessage('操作成功！');
              actionRef.current?.reload?.();
            } else {
              onlyMessage('操作失败！', 'error');
            }
          },
        }}
        tooltip={{
          title: intl.formatMessage({
            id: `pages.data.option.${record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'}`,
            defaultMessage: '启用',
          }),
        }}
      >
        {record?.state?.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
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
          onConfirm: async () => {
            if (record?.state?.value === 'disabled') {
              await service.remove(record.id);
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            } else {
              onlyMessage(intl.formatMessage({ id: 'pages.device.instance.deleteTip' }), 'error');
            }
          },
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

  const columns: ProColumns<AliCloudType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '网桥产品',
      dataIndex: 'bridgeProductName',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text: any, record: any) => (
        <span>
          <Badge
            status={record?.state?.value === 'disabled' ? 'error' : 'success'}
            text={record?.state?.text}
          />
        </span>
      ),
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '停用',
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
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
      fixed: 'right',
      render: (text, record) => Tools(record, 'table'),
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<AliCloudType>
        field={columns}
        target="aliyun"
        onSearch={(data) => {
          actionRef.current?.reload?.();
          setSearchParams(data);
        }}
      />
      <div style={{ backgroundColor: 'white', width: '100%', height: 60, padding: 20 }}>
        <div
          style={{
            padding: 10,
            width: '100%',
            color: 'rgba(0, 0, 0, 0.55)',
            backgroundColor: '#f6f6f6',
          }}
        >
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          将平台产品与设备数据通过API的方式同步到阿里云物联网平台
        </div>
      </div>
      <ProTableCard<AliCloudType>
        rowKey="id"
        search={false}
        scroll={{ x: 1366 }}
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
        pagination={{ pageSize: 10 }}
        headerTitle={[
          <PermissionButton
            onClick={() => {
              const url = `${getMenuPathByParams(MENUS_CODE['Northbound/AliCloud/Detail'])}`;
              history.push(url);
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
          <AliyunCard
            {...record}
            actions={[
              <PermissionButton
                type={'link'}
                onClick={() => {
                  const url = `${getMenuPathByParams(
                    MENUS_CODE['Northbound/AliCloud/Detail'],
                    record.id,
                  )}`;
                  history.push(url);
                }}
                key={'edit'}
                isPermission={permission.update}
              >
                <EditOutlined />
                {intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                })}
              </PermissionButton>,
              <PermissionButton
                key={'action'}
                type={'link'}
                style={{ padding: 0 }}
                isPermission={permission.action}
                popConfirm={{
                  title: intl.formatMessage({
                    id: `pages.data.option.${
                      record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                    }.tips`,
                    defaultMessage: '确认禁用？',
                  }),
                  onConfirm: async () => {
                    const resp =
                      record?.state?.value !== 'disabled'
                        ? await service._disable(record.id)
                        : await service._enable(record.id);
                    if (resp.status === 200) {
                      onlyMessage('操作成功！');
                      actionRef.current?.reload?.();
                    } else {
                      onlyMessage('操作失败！', 'error');
                    }
                  },
                }}
              >
                {record?.state?.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
                {intl.formatMessage({
                  id: `pages.data.option.${
                    record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                  }`,
                  defaultMessage: record?.state?.value !== 'disabled' ? '禁用' : '启用',
                })}
              </PermissionButton>,
              <PermissionButton
                key="delete"
                isPermission={permission.delete}
                type={'link'}
                style={{ padding: 0 }}
                tooltip={
                  record?.state?.value !== 'disabled'
                    ? { title: intl.formatMessage({ id: 'pages.device.instance.deleteTip' }) }
                    : undefined
                }
                disabled={record?.state?.value !== 'disabled'}
                popConfirm={{
                  title: intl.formatMessage({
                    id: 'pages.data.option.remove.tips',
                  }),
                  disabled: record?.state?.value !== 'disabled',
                  onConfirm: async () => {
                    if (record?.state?.value === 'disabled') {
                      await service.remove(record.id);
                      onlyMessage(
                        intl.formatMessage({
                          id: 'pages.data.option.success',
                          defaultMessage: '操作成功!',
                        }),
                      );
                      actionRef.current?.reload();
                    } else {
                      onlyMessage(
                        intl.formatMessage({ id: 'pages.device.instance.deleteTip' }),
                        'error',
                      );
                    }
                  },
                }}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
    </PageContainer>
  );
};

export default AliCloud;

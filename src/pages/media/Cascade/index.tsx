import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { CascadeItem } from '@/pages/media/Cascade/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { PermissionButton, ProTableCard } from '@/components';
import CascadeCard from '@/components/ProTableCard/CardItems/cascade';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';
import Service from './service';
import Publish from './Publish';
import { lastValueFrom } from 'rxjs';
import { onlyMessage } from '@/utils/util';

export const service = new Service('media/gb28181-cascade');

const Cascade = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const history = useHistory<Record<string, string>>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<CascadeItem>>();
  const { permission } = PermissionButton.usePermission('media/Cascade');

  const tools = (record: CascadeItem) => [
    <PermissionButton
      isPermission={permission.update}
      key="edit"
      onClick={() => {
        const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Save`]);
        history.push(url + `?id=${record.id}`);
      }}
      type={'link'}
      style={{ padding: 0 }}
    >
      <EditOutlined />
      编辑
    </PermissionButton>,
    <PermissionButton
      isPermission={permission.channel}
      key={'channel'}
      onClick={() => {
        const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Channel`]);
        history.push(url + `?id=${record.id}`);
      }}
      type={'link'}
      style={{ padding: 0 }}
    >
      <LinkOutlined />
      选择通道
    </PermissionButton>,
    <PermissionButton
      isPermission={permission.push}
      key={'share'}
      onClick={() => {
        setCurrent(record);
        setVisible(true);
      }}
      type={'link'}
      style={{ padding: 0 }}
      disabled={record.status.value === 'disabled'}
      tooltip={{
        title: record.status.value === 'disabled' ? '禁用状态下不可推送' : '',
      }}
    >
      <ShareAltOutlined />
      推送
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      key={'action'}
      style={{ padding: 0 }}
      popConfirm={{
        title: `确认${record.status.value !== 'disabled' ? '禁用' : '启用'}`,
        onConfirm: async () => {
          let resp: any = undefined;
          if (record.status.value === 'disabled') {
            resp = await service.enabled(record.id);
          } else {
            resp = await service.disabled(record.id);
          }
          if (resp?.status === 200) {
            onlyMessage('操作成功！');
            actionRef.current?.reset?.();
          }
        },
      }}
      isPermission={permission.action}
    >
      {record.status.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
      {record.status.value !== 'disabled' ? '禁用' : '启用'}
    </PermissionButton>,
    <PermissionButton
      isPermission={permission.delete}
      disabled={record.status.value !== 'disabled'}
      tooltip={{
        title: record.status.value !== 'disabled' ? '请先禁用，再删除' : '',
      }}
      popConfirm={{
        title: '确认删除',
        disabled: record.status.value !== 'disabled',
        onConfirm: async () => {
          const resp: any = await service.remove(record.id);
          if (resp.status === 200) {
            onlyMessage('操作成功！');
            actionRef.current?.reset?.();
          }
        },
      }}
      key="delete"
      type="link"
    >
      <DeleteOutlined />
    </PermissionButton>,
  ];

  const columns: ProColumns<CascadeItem>[] = [
    {
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'sipConfigs[0].sipId',
      title: '上级SIP ID',
      hideInSearch: true,
      render: (text: any, record: any) => record.sipConfigs[0].sipId,
    },
    {
      dataIndex: 'sipConfigs[0].publicHost',
      title: '上级SIP 地址',
      ellipsis: true,
      hideInSearch: true,
      render: (text: any, record: any) => record.sipConfigs[0].publicHost,
    },
    {
      dataIndex: 'count',
      title: '通道数量',
      hideInSearch: true,
    },
    {
      dataIndex: 'status',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (text: any, record: any) => (
        <Badge
          status={record.status?.value === 'disabled' ? 'error' : 'success'}
          text={record.status?.text}
        />
      ),
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
    },
    {
      dataIndex: 'onlineStatus',
      title: '级联状态',
      render: (text: any, record: any) => (
        <Badge
          status={record.onlineStatus?.value === 'offline' ? 'error' : 'success'}
          text={record.onlineStatus?.text}
        />
      ),
      valueType: 'select',
      valueEnum: {
        online: {
          text: '在线',
          status: 'online',
        },
        offline: {
          text: '离线',
          status: 'offline',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      ellipsis: true,
      fixed: 'right',
      valueType: 'option',
      align: 'left',
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Save`]);
            history.push(url + `?id=${record.id}`);
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
          isPermission={permission.channel}
          key={'channel'}
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Channel`]);
            history.push(url + `?id=${record.id}`);
          }}
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: '选择通道',
          }}
        >
          <LinkOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.push}
          key={'share'}
          onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}
          type={'link'}
          style={{ padding: 0 }}
          disabled={record.status.value === 'disabled'}
          tooltip={{
            title: record.status.value === 'disabled' ? '禁用状态下不可推送' : '推送',
          }}
        >
          <ShareAltOutlined />
        </PermissionButton>,
        <PermissionButton
          type={'link'}
          key={'action'}
          style={{ padding: 0 }}
          popConfirm={{
            title: `确认${record.status.value !== 'disabled' ? '禁用' : '启用'}`,
            onConfirm: async () => {
              let resp: any = undefined;
              if (record.status.value === 'disabled') {
                resp = await service.enabled(record.id);
              } else {
                resp = await service.disabled(record.id);
              }
              if (resp?.status === 200) {
                onlyMessage('操作成功！');
                actionRef.current?.reset?.();
              } else {
                onlyMessage('操作失败！', 'error');
              }
            },
          }}
          isPermission={permission.action}
          tooltip={{
            title: record.status.value !== 'disabled' ? '禁用' : '启用',
          }}
        >
          {record.status.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          disabled={record.status.value !== 'disabled'}
          tooltip={{
            title: record.status.value !== 'disabled' ? '请先禁用，再删除' : '删除',
          }}
          popConfirm={{
            title: '确认删除',
            disabled: record.status.value !== 'disabled',
            onConfirm: async () => {
              const resp: any = await service.remove(record.id);
              if (resp.status === 200) {
                onlyMessage('操作成功！');
                actionRef.current?.reset?.();
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
      <SearchComponent<CascadeItem>
        field={columns}
        target="media-cascade"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<CascadeItem>
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        scroll={{ x: 1366 }}
        columnEmptyText={''}
        options={{ fullScreen: true }}
        request={async (params = {}) => {
          return await lastValueFrom(
            service.queryZipCount({
              ...params,
              sorts: [
                {
                  name: 'createTime',
                  order: 'desc',
                },
              ],
            }),
          );
        }}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        headerTitle={[
          <PermissionButton
            isPermission={permission.add}
            key="add"
            onClick={() => {
              const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Save`]);
              history.push(url);
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
        gridColumn={2}
        cardRender={(record) => <CascadeCard {...record} actions={tools(record)} />}
      />
      {visible && (
        <Publish
          data={current}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};
export default Cascade;

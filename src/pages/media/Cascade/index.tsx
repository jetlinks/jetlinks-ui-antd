import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { CascadeItem } from '@/pages/media/Cascade/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { ProTableCard } from '@/components';
import CascadeCard from '@/components/ProTableCard/CardItems/cascade';
import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';
import Service from './service';
import Publish from './Publish';
import { lastValueFrom } from 'rxjs';

export const service = new Service('media/gb28181-cascade');

const Cascade = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const history = useHistory<Record<string, string>>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<CascadeItem>>();

  const tools = (record: CascadeItem) => [
    <Button
      type={'link'}
      style={{ padding: 0 }}
      disabled={getButtonPermission('media/Cascade', ['update', 'view'])}
      onClick={() => {
        const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Save`]);
        history.push(url + `?id=${record.id}`);
      }}
    >
      <Tooltip
        title={intl.formatMessage({
          id: 'pages.data.option.edit',
          defaultMessage: '编辑',
        })}
        key={'edit'}
      >
        <EditOutlined />
      </Tooltip>
    </Button>,
    <Button
      type={'link'}
      style={{ padding: 0 }}
      onClick={() => {
        const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Channel`]);
        history.push(url + `?id=${record.id}`);
      }}
    >
      <Tooltip title={'选择通道'} key={'channel'}>
        <LinkOutlined />
      </Tooltip>
    </Button>,
    <Button type={'link'}>
      <Popconfirm
        key={'share'}
        title="确认共享！"
        onConfirm={() => {
          setCurrent(record);
          setVisible(true);
        }}
      >
        <Tooltip title={'共享'}>
          <ShareAltOutlined />
        </Tooltip>
      </Popconfirm>
    </Button>,
    <Button
      type={'link'}
      style={{ padding: 0 }}
      disabled={getButtonPermission('media/Cascade', ['action'])}
    >
      <Popconfirm
        key={'able'}
        title={record.status.value === 'disabled' ? '确认启用' : '确认禁用'}
        onConfirm={async () => {
          let resp: any = undefined;
          if (record.status.value === 'disabled') {
            resp = await service.enabled(record.id);
          } else {
            resp = await service.disabled(record.id);
          }
          if (resp?.status === 200) {
            message.success('操作成功！');
            actionRef.current?.reset?.();
          }
        }}
      >
        <Tooltip title={record.status.value === 'disabled' ? '启用' : '禁用'}>
          {record.status.value === 'disabled' ? <CheckCircleOutlined /> : <StopOutlined />}
        </Tooltip>
      </Popconfirm>
    </Button>,
    <Button
      type={'link'}
      style={{ padding: 0 }}
      disabled={getButtonPermission('media/Cascade', ['delete'])}
    >
      <Popconfirm
        title={'确认删除'}
        key={'delete'}
        onConfirm={async () => {
          const resp: any = await service.remove(record.id);
          if (resp.status === 200) {
            message.success('操作成功！');
            actionRef.current?.reset?.();
          }
        }}
      >
        <Tooltip
          title={intl.formatMessage({
            id: 'pages.data.option.remove',
            defaultMessage: '删除',
          })}
        >
          <DeleteOutlined />
        </Tooltip>
      </Popconfirm>
    </Button>,
  ];

  const columns: ProColumns<CascadeItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'sipConfigs[0].sipId',
      title: '上级SIP ID',
      render: (text: any, record: any) => record.sipConfigs[0].sipId,
    },
    {
      dataIndex: 'sipConfigs[0].publicHost',
      title: '上级SIP 地址',
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
          text: '已停止',
          status: 'disabled',
        },
        enabled: {
          text: '已启动',
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
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={getButtonPermission('media/Cascade', ['view', 'update'])}
          key={'edit'}
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Save`]);
            history.push(url + `?id=${record.id}`);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </Button>,
        <Button
          type="link"
          style={{ padding: 0 }}
          key={'channel'}
          onClick={() => {
            const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Channel`]);
            history.push(url + `?id=${record.id}`);
          }}
        >
          <Tooltip title={'选择通道'}>
            <LinkOutlined />
          </Tooltip>
        </Button>,
        <Button type="link" style={{ padding: 0 }}>
          <Popconfirm
            key={'share'}
            onConfirm={() => {
              setVisible(true);
              setCurrent(record);
            }}
            title={'确认共享'}
          >
            <Tooltip title={'共享'}>
              <ShareAltOutlined />
            </Tooltip>
          </Popconfirm>
        </Button>,
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={getButtonPermission('media/Cascade', ['action'])}
        >
          <Popconfirm
            key={'able'}
            title={record.status.value === 'disabled' ? '确认启用' : '确认禁用'}
            onConfirm={async () => {
              let resp: any = undefined;
              if (record.status.value === 'disabled') {
                resp = await service.enabled(record.id);
              } else {
                resp = await service.disabled(record.id);
              }
              if (resp?.status === 200) {
                message.success('操作成功！');
                actionRef.current?.reset?.();
              }
            }}
          >
            <Tooltip title={record.status.value === 'disabled' ? '启用' : '禁用'}>
              {record.status.value === 'disabled' ? <CheckCircleOutlined /> : <StopOutlined />}
            </Tooltip>
          </Popconfirm>
        </Button>,
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={getButtonPermission('media/Cascade', ['delete'])}
        >
          <Popconfirm
            title={'确认删除'}
            key={'delete'}
            onConfirm={async () => {
              const resp: any = await service.remove(record.id);
              if (resp.status === 200) {
                message.success('操作成功！');
                actionRef.current?.reset?.();
              }
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </Button>,
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
          <Button
            onClick={() => {
              const url = getMenuPathByCode(MENUS_CODE[`media/Cascade/Save`]);
              history.push(url);
            }}
            disabled={getButtonPermission('media/Cascade', ['add'])}
            style={{ marginRight: 12 }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
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

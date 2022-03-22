import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { NetworkItem } from '@/pages/link/Type/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { history } from 'umi';
import Service from '@/pages/link/Type/service';

export const service = new Service('network/config');
const statusMap = new Map();
statusMap.set('enabled', 'success');
statusMap.set('disabled', 'error');

const Network = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<NetworkItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      align: 'center',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      align: 'center',
      title: intl.formatMessage({
        id: 'pages.link.type',
        defaultMessage: '类型',
      }),
    },
    {
      dataIndex: 'shareCluster',
      title: '集群',
      align: 'center',
      renderText: (text) => (text ? '共享配置' : '独立配置'),
    },
    {
      dataIndex: 'detail',
      title: '详情',
      align: 'center',
      render: (text, record: any) => {
        if (record.shareCluster) {
          return (
            <div>
              公网: {record?.configuration?.host}:{record?.configuration?.port}
            </div>
          );
        } else {
          return (record?.cluster || []).slice(0, 3).map((i: any) => (
            <div key={i?.serverId}>
              公网: {i?.configuration?.host}:{i?.configuration?.port}
            </div>
          ));
        }
      },
    },
    {
      dataIndex: 'description',
      title: '说明',
      align: 'center',
    },
    {
      dataIndex: 'state',
      align: 'center',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
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
        <a key="edit" onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="debug">
          <Popconfirm
            title={intl.formatMessage({
              id: `pages.data.option.${
                record.state.value === 'enabled' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: record.state.value === 'enabled' ? '禁用' : '启用',
            })}
            onConfirm={async () => {
              let resp = undefined;
              if (record.state.value !== 'enabled') {
                resp = await service._start(record.id);
              } else {
                resp = await service._shutdown(record.id);
              }
              if (resp.status === 200) {
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: `pages.data.option.${
                  record.state.value === 'enabled' ? 'disabled' : 'enabled'
                }`,
                defaultMessage: record.state.value === 'enabled' ? '禁用' : '启用',
              })}
            >
              {record.state.value === 'enabled' ? <StopOutlined /> : <CheckCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,
        <a key="remove">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.remove.tips',
              defaultMessage: '确认删除？',
            })}
            onConfirm={async () => {
              await service.remove(record.id);
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
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
        </a>,
      ],
    },
  ];

  const [param, setParam] = useState({});

  /**
   * 跳转详情页
   * @param id
   */
  const pageJump = (id?: string) => {
    // 跳转详情
    history.push(`${getMenuPathByParams(MENUS_CODE['link/Type/Save'], id)}`);
  };

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
        onReset={() => {
          actionRef.current?.reset?.();
          setParam({});
        }}
      />
      <ProTable<NetworkItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        headerTitle={'网络组件'}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        toolBarRender={() => [
          <Button
            onClick={() => {
              pageJump();
            }}
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
      />
    </PageContainer>
  );
};

export default Network;

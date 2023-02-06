import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import {
  DeleteOutlined,
  DownSquareOutlined,
  EditOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PermissionButton, ProTableCard } from '@/components';
import { useRef, useState } from 'react';
import { onlyMessage } from '@/utils/util';
import Save from './Save';
import Issue from './Issue';
import Service from './service';
import ResourceCard from '@/components/ProTableCard/CardItems/edge/Resource';
import moment from 'moment';

export const service = new Service('entity/template');

export default () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [current, setCurrent] = useState<Partial<ResourceItem>>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [issueVisible, setIssueVisible] = useState<boolean>(false);
  const { permission } = PermissionButton.usePermission('edge/Resource');

  const tools = (record: ResourceItem, type: 'card' | 'list') => [
    <PermissionButton
      type={'link'}
      isPermission={permission.update}
      onClick={() => {
        setCurrent(record);
        setVisible(true);
      }}
      tooltip={{
        title: type === 'list' ? '编辑' : '',
      }}
      style={{ padding: 0 }}
      key={'edit'}
    >
      <EditOutlined />
      {type === 'list' ? '' : '编辑'}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      disabled={record.state.value === 'disabled'}
      onClick={() => {
        setCurrent(record);
        setIssueVisible(true);
      }}
      tooltip={{
        title:
          type !== 'list'
            ? `${record.state.value === 'disabled' ? '请先启用，再下发' : undefined}`
            : '下发',
      }}
      style={{ padding: 0 }}
      isPermission={permission.setting}
      key={'reset'}
    >
      <DownSquareOutlined />
      {type === 'list' ? '' : '下发'}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      key={'state'}
      style={{ padding: 0 }}
      popConfirm={{
        title: intl.formatMessage({
          id: `pages.data.option.${
            record.state.value !== 'disabled' ? 'disabled' : 'enabled'
          }.tips`,
          defaultMessage: '确认禁用？',
        }),
        onConfirm: () => {
          if (record.state?.value !== 'disabled') {
            service._stop([record.id]).then((resp: any) => {
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            });
          } else {
            service._start([record.id]).then((resp: any) => {
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            });
          }
        },
      }}
      isPermission={permission.action}
      tooltip={{
        title: type === 'list' ? (record.state.value !== 'disabled' ? '禁用' : '启用') : '',
      }}
    >
      {record.state.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
      {record.state.value !== 'disabled'
        ? type === 'list'
          ? ''
          : '禁用'
        : type === 'list'
        ? ''
        : '启用'}
    </PermissionButton>,
    <PermissionButton
      type={'link'}
      key={'delete'}
      style={{ padding: 0 }}
      isPermission={permission.delete}
      tooltip={record.state.value !== 'disabled' ? { title: '请先禁用，再删除。' } : undefined}
      disabled={record.state.value !== 'disabled'}
      popConfirm={{
        title: intl.formatMessage({
          id: 'pages.data.option.remove.tips',
        }),
        disabled: record.state.value !== 'disabled',
        onConfirm: async () => {
          if (record.state.value === 'disabled') {
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
    >
      <DeleteOutlined />
    </PermissionButton>,
  ];
  const columns: ProColumns<ResourceItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '通信协议',
      dataIndex: 'category',
      width: 150,
      ellipsis: true,
    },
    {
      title: '所属边缘网关',
      width: 150,
      dataIndex: 'sourceId',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      valueType: 'dateTime',
      render: (_: any, row) => {
        return row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '90px',
      valueType: 'select',
      renderText: (text) =>
        text ? (
          <Badge status={text.value === 'enabled' ? 'success' : 'error'} text={text?.text || ''} />
        ) : (
          ''
        ),
      valueEnum: {
        enabled: {
          text: '正常',
          status: 'enabled',
        },
        disabled: {
          text: '异常',
          status: 'disabled',
        },
      },
      filterMultiple: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (text, record) => tools(record, 'list'),
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<ResourceItem>
        field={columns}
        target="edge-resource"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<ResourceItem>
        columns={columns}
        scroll={{ x: 1366 }}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        columnEmptyText={''}
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
        cardRender={(record) => <ResourceCard {...record} actions={tools(record, 'card')} />}
      />
      {visible && (
        <Save
          data={current}
          cancel={() => {
            setVisible(false);
          }}
          reload={() => {
            actionRef.current?.reload();
            setVisible(false);
          }}
        />
      )}
      {issueVisible && (
        <Issue
          data={current}
          cancel={() => {
            setIssueVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

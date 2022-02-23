import Service from '@/pages/system/User/serivce';
import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Button, Card, message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import Save from './Save';
import { observer } from '@formily/react';

export const service = new Service('user');

const User = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [model, setMode] = useState<'add' | 'edit' | 'query'>('query');
  const [current, setCurrent] = useState<Partial<UserItem>>({});
  const edit = async (record: UserItem) => {
    setMode('edit');
    setCurrent(record);
  };

  const columns: ProColumns<UserItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '姓名',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      align: 'center',
      // tip: intl.formatMessage({
      //   id: 'pages.system.name.tips',
      //   defaultMessage: '姓名过长会自动收缩',
      // }),
      // sorter: true,
      // defaultSortOrder: 'ascend',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      dataIndex: 'username',
      copyable: true,
      ellipsis: true,
      align: 'center',
      // tip: intl.formatMessage({
      //   id: 'pages.system.userName.tips',
      //   defaultMessage: '用户名过长会自动收缩',
      // }),
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      search: {
        transform: (value) => ({ username$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      // filters: true,
      align: 'center',
      // onFilter: true,
      valueType: 'select',
      valueEnum: {
        all: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.all',
            defaultMessage: '全部',
          }),
          status: 'Default',
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.normal',
            defaultMessage: '正常',
          }),
          status: 1,
        },
        0: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.disable',
            defaultMessage: '禁用',
          }),
          status: 0,
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      sorter: true,
      hideInTable: true,
      defaultSortOrder: 'descend',
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
        <a key="editable" onClick={() => edit(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="changeState">
          <Popconfirm
            title={intl.formatMessage({
              id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}.tips`,
              defaultMessage: `确认${record.status ? '禁用' : '启用'}?`,
            })}
            onConfirm={async () => {
              await service.update({
                id: record.id,
                status: record.status ? 0 : 1,
              });
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
                id: `pages.data.option.${record.status ? 'disabled' : 'enabled'}`,
                defaultMessage: record.status ? '禁用' : '启用',
              })}
            >
              {record.status ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,
        <a key="delete">
          <Popconfirm
            onConfirm={async () => {
              await service.remove(record.id);
              actionRef.current?.reload();
            }}
            title="确认删除?"
          >
            <Tooltip title="删除">
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const [param, setParam] = useState({});
  return (
    <PageContainer>
      <Card style={{ marginBottom: '20px' }}>
        <SearchComponent
          field={columns}
          onSearch={(data) => setParam({ terms: data })}
          target="user"
        />
      </Card>
      <ProTable<UserItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        toolBarRender={() => [
          <Button
            onClick={() => {
              setMode('add');
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
      <Save
        model={model}
        close={() => {
          setMode('query');
          actionRef.current?.reload();
        }}
        data={current}
      />
    </PageContainer>
  );
});
export default User;

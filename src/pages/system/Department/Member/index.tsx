// 部门-用户管理
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@jetlinks/pro-table';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useParams } from 'umi';
import { observer } from '@formily/react';
import MemberModel from '@/pages/system/Department/Member/model';
import type { MemberItem } from '@/pages/system/Department/typings';
import Service from '@/pages/system/Department/Member/service';
import { PlusOutlined, DisconnectOutlined } from '@ant-design/icons';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';

export const service = new Service('tenant');

const Member = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const param = useParams<{ id: string }>();
  const [searchParam, setSearchParam] = useState({});

  const handleUnBind = () => {
    service.handleUser(param.id, MemberModel.unBindUsers, 'unbind').subscribe({
      next: () => message.success('操作成功'),
      error: () => message.error('操作失败'),
      complete: () => {
        MemberModel.unBindUsers = [];
        actionRef.current?.reload();
      },
    });
  };

  const singleUnBind = (key: string) => {
    MemberModel.unBindUsers = [key];
    handleUnBind();
  };

  const columns: ProColumns<MemberItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '姓名',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'username',
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
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
      filters: true,
      onFilter: true,
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
      render: (_, data) => (
        <Badge
          status={data.status === 1 ? 'success' : 'error'}
          text={
            data.status === 1
              ? intl.formatMessage({
                  id: 'pages.searchTable.titleStatus.normal',
                  defaultMessage: '正常',
                })
              : intl.formatMessage({
                  id: 'pages.searchTable.titleStatus.disable',
                  defaultMessage: '禁用',
                })
          }
        />
      ),
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
        <Popconfirm
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否解除绑定',
          })}
          key="unBindUser"
          onConfirm={() => {
            singleUnBind(record.id);
          }}
        >
          <a href="#">
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    MemberModel.bind = false;
  };

  return (
    <PageContainer>
      <Bind
        visible={MemberModel.bind}
        onCancel={closeModal}
        reload={() => actionRef.current?.reload()}
      />
      <SearchComponent<MemberItem>
        pattern={'simple'}
        field={columns}
        defaultParam={[{ column: 'id$in-dimension$org', value: param.id, termType: 'eq' }]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        target="department-user"
      />
      <ProTable<MemberItem>
        actionRef={actionRef}
        columns={columns}
        search={false}
        rowKey="id"
        request={(params) => service.queryUser(params)}
        rowSelection={{
          selectedRowKeys: MemberModel.unBindUsers,
          onChange: (selectedRowKeys, selectedRows) => {
            MemberModel.unBindUsers = selectedRows.map((item) => item.id);
          },
        }}
        params={searchParam}
        toolBarRender={() => [
          <Button
            onClick={() => {
              MemberModel.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
          >
            {intl.formatMessage({
              id: 'pages.system.role.option.bindUser',
              defaultMessage: '绑定用户',
            })}
          </Button>,
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.system.role.option.unBinds',
              defaultMessage: '是否批量解除绑定',
            })}
            key="unBind"
            onConfirm={handleUnBind}
          >
            <Button icon={<DisconnectOutlined />} key="bind">
              {intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              })}
            </Button>
          </Popconfirm>,
        ]}
      />
    </PageContainer>
  );
});

export default Member;

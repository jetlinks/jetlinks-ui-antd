// 部门-用户管理
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@jetlinks/pro-table';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useRef } from 'react';
import { useParams } from 'umi';
import { observer } from '@formily/react';
import MemberModel from '@/pages/system/Department/Member/model';
import type { MemberItem } from '@/pages/system/Department/typings';
import Service from '@/pages/system/Department/Member/service';
import { PlusOutlined, DisconnectOutlined } from '@ant-design/icons';
import Bind from './bind';

export const service = new Service('tenant');

const Member = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const param = useParams<{ id: string }>();

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
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
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
      title: intl.formatMessage({
        id: 'pages.system.tenant.memberManagement.administrators',
        defaultMessage: '管理员',
      }),
      dataIndex: 'adminMember',
      renderText: (text) => (text ? '是' : '否'),
      search: false,
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
      <ProTable<MemberItem>
        actionRef={actionRef}
        columns={columns}
        // schema={schema}
        rowKey="id"
        request={(params) => service.queryUser(params)}
        rowSelection={{
          selectedRowKeys: MemberModel.unBindUsers,
          onChange: (selectedRowKeys, selectedRows) => {
            MemberModel.unBindUsers = selectedRows.map((item) => item.id);
          },
        }}
        defaultParams={{
          'id$in-dimension$org': param.id,
        }}
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
              id: 'pages.system.role.option.unBindUser',
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

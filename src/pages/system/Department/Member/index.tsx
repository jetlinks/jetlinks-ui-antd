// 部门-用户管理
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge, Button, Popconfirm, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import MemberModel from '@/pages/system/Department/Member/model';
import type { MemberItem } from '@/pages/system/Department/typings';
import Service from '@/pages/system/Department/Member/service';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';
import Models from '@/pages/system/Department/Assets/productCategory/model';
import { onlyMessage } from '@/utils/util';

export const service = new Service('tenant');

const Member = observer((props: { parentId: string }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [searchParam, setSearchParam] = useState({});

  const handleUnBind = () => {
    if (MemberModel.unBindUsers.length) {
      service.handleUser(props.parentId, MemberModel.unBindUsers, 'unbind').subscribe({
        next: () => onlyMessage('操作成功'),
        error: () => onlyMessage('操作失败', 'error'),
        complete: () => {
          MemberModel.unBindUsers = [];
          actionRef.current?.reload();
        },
      });
    } else {
      onlyMessage('请勾选需要解绑的数据', 'warning');
    }
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
          <Button type={'link'} style={{ padding: 0 }}>
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    MemberModel.bind = false;
  };

  useEffect(() => {
    setSearchParam({
      terms: [{ column: 'id$in-dimension$org', value: props.parentId }],
    });
    actionRef.current?.reset?.();
    //  初始化所有状态
    Models.bindKeys = [];
    Models.unBindKeys = [];
  }, [props.parentId]);

  return (
    <>
      {MemberModel.bind && (
        <Bind
          visible={MemberModel.bind}
          onCancel={closeModal}
          reload={() => actionRef.current?.reload()}
          parentId={props.parentId}
        />
      )}
      <SearchComponent<MemberItem>
        // pattern={'simple'}
        field={columns}
        defaultParam={[{ column: 'id$in-dimension$org', value: props.parentId }]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParam({});
        // }}
        target="department-user"
      />
      <ProTable<MemberItem>
        actionRef={actionRef}
        columns={columns}
        search={false}
        rowKey="id"
        request={(params) => {
          if (!props.parentId) {
            return {
              code: 200,
              result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
              },
              status: 200,
            };
          }
          return service.queryUser(params);
        }}
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
            disabled={!props.parentId}
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
            <Button icon={<DisconnectOutlined />}>
              {intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              })}
            </Button>
          </Popconfirm>,
        ]}
      />
    </>
  );
});

export default Member;

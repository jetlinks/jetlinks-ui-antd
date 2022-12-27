// 部门-用户管理
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge } from 'antd';
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
import PermissionButton from '@/components/PermissionButton';
import '../index.less';

export const service = new Service('tenant');

const Member = observer((props: { parentId: string }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('system/Department');
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
      width: 120,
      fixed: 'left',
    },
    {
      dataIndex: 'username',
      ellipsis: true,
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      // search: {
      //   transform: (value) => ({ username$LIKE: value }),
      // },
      width: 120,
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
        // all: {
        //   text: intl.formatMessage({
        //     id: 'pages.searchTable.titleStatus.all',
        //     defaultMessage: '全部',
        //   }),
        //   status: 'Default',
        // },
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
      width: 80,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 60,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          key="unbind"
          type={'link'}
          popConfirm={{
            title: intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否解除绑定',
            }),
            onConfirm: () => {
              singleUnBind(record.id);
            },
          }}
          isPermission={permission.bind}
        >
          <DisconnectOutlined />
        </PermissionButton>,
        // <Popconfirm
        //   title={intl.formatMessage({
        //     id: 'pages.system.role.option.unBindUser',
        //     defaultMessage: '是否解除绑定',
        //   })}
        //   key="unBindUser"
        //   onConfirm={() => {
        //     singleUnBind(record.id);
        //   }}
        // >
        //   <Button type={'link'} style={{ padding: 0 }}>
        //     <Tooltip
        //       title={intl.formatMessage({
        //         id: 'pages.system.role.option.unBindUser',
        //         defaultMessage: '解绑',
        //       })}
        //     >
        //       <DisconnectOutlined />
        //     </Tooltip>
        //   </Button>
        // </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    MemberModel.bind = false;
  };

  const unSelect = () => {
    // Models.bindKeys = [];
    MemberModel.unBindUsers = [];
  };

  const getSelectedRowsKey = (selectedRows) => {
    return selectedRows.map((item) => item?.id).filter((item2) => !!item2 !== false);
  };

  useEffect(() => {
    setSearchParam({
      terms: [{ column: 'id$in-dimension$org', value: props.parentId }],
    });
    actionRef.current?.reset?.();
    //  初始化所有状态
    Models.bindKeys = [];
    Models.unBindKeys = [];
    MemberModel.unBindUsers = [];
  }, [props.parentId]);

  return (
    <div className="content">
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
          unSelect();
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
        columnEmptyText={''}
        request={(params) => {
          params.sorts = [{ name: 'createTime', order: 'desc' }];
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
        tableAlertRender={({ selectedRowKeys }) => <div>已选择 {selectedRowKeys.length} 项</div>}
        tableAlertOptionRender={() => {
          return (
            <a
              onClick={() => {
                unSelect();
              }}
            >
              取消选择
            </a>
          );
        }}
        rowSelection={{
          selectedRowKeys: MemberModel.unBindUsers,
          // onChange: (selectedRowKeys, selectedRows) => {
          //   MemberModel.unBindUsers = selectedRows.map((item) => item.id);
          // },
          onSelect: (record, selected, selectedRows) => {
            if (selected) {
              MemberModel.unBindUsers = [
                ...new Set([...MemberModel.unBindUsers, ...getSelectedRowsKey(selectedRows)]),
              ];
            } else {
              MemberModel.unBindUsers = MemberModel.unBindUsers.filter(
                (item) => item !== record.id,
              );
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              MemberModel.unBindUsers = [
                ...new Set([...MemberModel.unBindUsers, ...getSelectedRowsKey(selectedRows)]),
              ];
            } else {
              const unChangeRowsKeys = getSelectedRowsKey(changeRows);
              MemberModel.unBindUsers = MemberModel.unBindUsers
                .concat(unChangeRowsKeys)
                .filter((item) => !unChangeRowsKeys.includes(item));
            }
          },
        }}
        params={searchParam}
        headerTitle={[
          <PermissionButton
            onClick={() => {
              MemberModel.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
            style={{ marginRight: 12 }}
            disabled={!props.parentId}
            isPermission={permission['bind-user']}
          >
            {intl.formatMessage({
              id: 'pages.system.role.option.bindUser',
              defaultMessage: '绑定用户',
            })}
          </PermissionButton>,
          <PermissionButton
            icon={<DisconnectOutlined />}
            key="unBind"
            popConfirm={{
              title: intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '是否批量解除绑定',
              }),
              onConfirm: handleUnBind,
            }}
            tooltip={{
              title: intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              }),
            }}
            isPermission={permission.bind}
          >
            {intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '批量解绑',
            })}
          </PermissionButton>,
          // <Popconfirm
          //   title={intl.formatMessage({
          //     id: 'pages.system.role.option.unBinds',
          //     defaultMessage: '是否批量解除绑定',
          //   })}
          //   key="unBind"
          //   onConfirm={handleUnBind}
          // >
          //   <Button icon={<DisconnectOutlined />}>
          //     {intl.formatMessage({
          //       id: 'pages.system.role.option.unBindUser',
          //       defaultMessage: '批量解绑',
          //     })}
          //   </Button>
          // </Popconfirm>,
        ]}
      />
    </div>
  );
});

export default Member;

import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { useIntl, useHistory } from 'umi';
import { BadgeStatus, PermissionButton, AIcon } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { StatusColorEnum } from '@/components/BadgeStatus';
import SaveModal from './save';
import PasswordModal from './password';
import Service from './service';
import { message } from 'antd';
import { getMenuPathByCode } from '@/utils/menu';

export const service = new Service('api-client');

export default () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const history = useHistory();
  const [param, setParam] = useState({});
  const [saveType, setSaveType] = useState<'save' | 'edit'>('save');
  const [saveVisible, setSaveVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [editData, setEditData] = useState<any | undefined>(undefined);

  const { permission } = PermissionButton.usePermission('system/Platforms');

  const deleteById = async (id: string) => {
    const resp: any = await service.remove(id);
    if (resp.status === 200) {
      message.success('操作成功');
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      dataIndex: 'username',
      title: '用户名',
    },
    // {
    //   dataIndex: 'roleIdList',
    //   title: '角色',
    //   renderText: (record => {
    //     console.log(record);
    //     return ''
    //   })
    // },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      width: 160,
      valueType: 'select',
      renderText: (record) =>
        record ? (
          <BadgeStatus
            status={record.value}
            text={record.text}
            statusNames={{
              enabled: StatusColorEnum.processing,
              disabled: StatusColorEnum.error,
            }}
          />
        ) : (
          ''
        ),
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
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_, record: any) => [
        <PermissionButton
          key={'update'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          onClick={() => {
            setSaveType('edit');
            setSaveVisible(true);
            setEditData(record);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'empowerment'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.empowerment}
          tooltip={{
            title: '赋权',
          }}
          onClick={() => {
            const url = getMenuPathByCode('system/Platforms/Api');
            history.push(`${url}?code=${record.id}`);
          }}
        >
          <AIcon type={'icon-fuquan'} />
        </PermissionButton>,
        <PermissionButton
          key={'api'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={true}
          tooltip={{
            title: '查看API',
          }}
          onClick={() => {
            const url = getMenuPathByCode('system/Platforms/View');
            history.push(`${url}?code=${record.id}`);
          }}
        >
          <AIcon type={'icon-chakanAPI'} />
        </PermissionButton>,
        <PermissionButton
          key={'password'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: '重置密码',
          }}
          onClick={() => {
            setEditData({ id: record.userId });
            setPasswordVisible(true);
          }}
        >
          <AIcon type={'icon-zhongzhimima'} />
        </PermissionButton>,
        <PermissionButton
          key={'state'}
          type={'link'}
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${
                record.state.value !== 'disabled' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: () => {
              if (record.state.value !== 'disabled') {
                service.undeploy(record.id).then((resp: any) => {
                  if (resp.status === 200) {
                    message.success(
                      intl.formatMessage({
                        id: 'pages.data.option.success',
                        defaultMessage: '操作成功!',
                      }),
                    );
                    actionRef.current?.reload();
                  }
                });
              } else {
                service.deploy(record.id).then((resp: any) => {
                  if (resp.status === 200) {
                    message.success(
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
            title: intl.formatMessage({
              id: `pages.data.option.${record.state.value !== 'disabled' ? 'disabled' : 'enabled'}`,
              defaultMessage: record.state.value !== 'disabled' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          key={'delete'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.delete}
          disabled={record.state.value === 'enabled'}
          popConfirm={{
            title: '确认删除？',
            disabled: record.state.value === 'enabled',
            onConfirm: () => {
              deleteById(record.id);
            },
          }}
          tooltip={{
            title:
              record.state.value === 'enabled' ? <span>请先禁用,再删除</span> : <span>删除</span>,
          }}
          onClick={() => {}}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={async (data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        actionRef={actionRef}
        request={(params: any) =>
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
        headerTitle={[
          <PermissionButton
            key="button"
            type="primary"
            isPermission={permission.add}
            onClick={() => {
              setSaveType('save');
              setSaveVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
          <div
            style={{
              paddingLeft: 24,
              background: '#fff',
              fontSize: 14,
            }}
          >
            <span style={{ marginRight: 8, fontSize: 16 }}>
              <ExclamationCircleOutlined />
            </span>
            第三方平台用户是一个身份实体，代表您的组织中需要访问物联网平台资源的用户或应用程序。
          </div>,
        ]}
      />
      <SaveModal
        visible={saveVisible}
        data={editData}
        type={saveType}
        onCancel={() => {
          setSaveVisible(false);
          setEditData(undefined);
        }}
        onReload={() => {
          actionRef.current?.reload();
        }}
      />
      <PasswordModal
        visible={passwordVisible}
        onCancel={() => {
          setPasswordVisible(false);
        }}
        data={editData}
      />
    </PageContainer>
  );
};

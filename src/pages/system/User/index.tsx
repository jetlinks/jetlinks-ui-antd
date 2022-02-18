import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import {
  EditOutlined,
  KeyOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Tooltip, Popconfirm, message, Drawer } from 'antd';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import BaseCrud from '@/components/BaseCrud';
import { CurdModel } from '@/components/BaseCrud/model';
import BaseService from '@/utils/BaseService';
import { observer } from '@formily/react';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import Authorization from '@/components/Authorization';
import autzModel from '@/components/Authorization/autz';
// import SearchComponent from '@/components/SearchComponent';

export const service = new BaseService<UserItem>('user');
const User = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [model1, setModel] = useState(CurdModel.model);

  useEffect(() => {
    const modelSubscription = Store.subscribe(SystemConst.BASE_CURD_MODEL, setModel);
    return () => modelSubscription.unsubscribe();
  }, [CurdModel.model]);

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
      tip: intl.formatMessage({
        id: 'pages.system.name.tips',
        defaultMessage: '姓名过长会自动收缩',
      }),
      sorter: true,
      defaultSortOrder: 'ascend',
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
      tip: intl.formatMessage({
        id: 'pages.system.userName.tips',
        defaultMessage: '用户名过长会自动收缩',
      }),
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
      filters: true,
      align: 'center',
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
        <a
          key="editable"
          onClick={() => {
            CurdModel.update(record);
            CurdModel.model = 'edit';
            setModel('edit');
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
        </a>,
        <a
          key="auth"
          onClick={() => {
            autzModel.autzTarget.id = record.id;
            autzModel.autzTarget.name = record.name;
            autzModel.visible = true;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.authorize',
              defaultMessage: '授权',
            })}
          >
            <KeyOutlined />
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
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      username: {
        title: intl.formatMessage({
          id: 'pages.system.username',
          defaultMessage: '用户名',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          disabled: model1 === 'edit',
        },
        'x-decorator-props': {},
        name: 'username',
        required: true,
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.system.name',
          defaultMessage: '姓名',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
      },
      password: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.password',
          defaultMessage: '密码',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        'x-component-props': {
          checkStrength: true,
        },
        // 'x-hidden': model === 'edit',
        'x-reactions': [
          {
            dependencies: ['.confirmPassword'],
            fulfill: {
              state: {
                errors:
                  '{{$deps[0] && $self.value && $self.value !==$deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'password',
        required: false,
      },
      confirmPassword: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.system.confirmPassword',
          defaultMessage: '确认密码？',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Password',
        // 'x-hidden': model === 'edit',
        'x-component-props': {
          checkStrength: true,
        },
        'x-reactions': [
          {
            dependencies: ['.password'],
            fulfill: {
              state: {
                errors:
                  '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
              },
            },
          },
        ],
        'x-decorator-props': {},
        name: 'confirmPassword',
        required: false,
      },
    },
  };

  intl.formatMessage({
    id: 'pages.system.user',
    defaultMessage: '默认值',
  });
  return (
    <PageContainer>
      <BaseCrud<UserItem>
        actionRef={actionRef}
        columns={columns}
        search={false}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.user',
          defaultMessage: '用户管理',
        })}
        moduleName="user"
        schema={schema}
      />
      <Drawer
        title={intl.formatMessage({
          id: 'pages.data.option.authorize',
          defaultMessage: '授权',
        })}
        width="50vw"
        visible={autzModel.visible}
        onClose={() => {
          autzModel.visible = false;
        }}
      >
        <Authorization
          close={() => {
            autzModel.visible = false;
          }}
          target={autzModel.autzTarget}
        />
      </Drawer>
    </PageContainer>
  );
});

export default User;

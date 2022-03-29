import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { message, Popconfirm, Tooltip } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import BaseCrud from '@/components/BaseCrud';
import Service from './service';
import { useIntl } from '@@/plugin-locale/localeExports';
import { observer } from '@formily/react';
import { Link, useLocation } from 'umi';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { CurdModel } from '@/components/BaseCrud/model';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';

export const service = new Service('role');

const Role: React.FC = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<RoleItem>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: intl.formatMessage({
        id: 'pages.system.role.id',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
      // copyable: true,
      ellipsis: true,
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      // copyable: true,
      ellipsis: true,
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.describe',
        defaultMessage: '描述',
      }),
      ellipsis: true,
      dataIndex: 'description',
      filters: true,
      onFilter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
      render: (text, record) => [
        <Link to={`${getMenuPathByParams(MENUS_CODE['system/Role/Detail'], record.id)}`} key="link">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
            key={'edit'}
          >
            <EditOutlined />
          </Tooltip>
        </Link>,
        <a key="delete">
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

  const schema = {
    type: 'object',
    properties: {
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '角色名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {},
        'x-decorator-props': {},
        name: 'name',
        required: true,
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入名称',
          },
        ],
      },
      description: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '描述',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          checkStrength: true,
        },
        'x-decorator-props': {},
        name: 'password',
        required: false,
        'x-validator': [
          {
            max: 200,
            message: '最多可输入200个字符',
          },
        ],
      },
    },
  };

  const location = useLocation();

  useEffect(() => {
    if ((location as any).query?.save === 'true') {
      CurdModel.add();
    }
    const subscription = Store.subscribe(SystemConst.BASE_UPDATE_DATA, (data) => {
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(data);
        setTimeout(() => window.close(), 300);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return (
    <PageContainer>
      <BaseCrud<RoleItem>
        actionRef={actionRef}
        moduleName="role"
        columns={columns}
        service={service}
        search={false}
        title={intl.formatMessage({
          id: 'pages.system.role',
          defaultMessage: '角色列表',
        })}
        schema={schema}
      />
    </PageContainer>
  );
});
export default Role;

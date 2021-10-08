import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import {
  EditOutlined,
  KeyOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Menu, Tooltip, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import BaseCrud from '@/components/BaseCrud';
import { CurdModel } from '@/components/BaseCrud/model';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { FormTab } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import Service from '@/pages/system/Permission/service';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { map } from 'rxjs/operators';
import { toArray } from 'rxjs';

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);

export const service = new Service('permission');

const defaultAction = [
  { value: 'query', label: '查询' },
  { value: 'save', label: '保存' },
  { value: 'delete', label: '删除' },
  { value: 'import', label: '导入' },
  { value: 'export', label: '导出' },
];

const PermissionModel = model<{
  permissionList: { label: string; value: string }[];
}>({
  permissionList: [],
});
const Permission: React.FC = observer(() => {
  useEffect(() => {
    service
      .getPermission()
      .pipe(
        map((item) => ({ label: item.name, value: item.id })),
        toArray(),
      )
      .subscribe((data) => {
        PermissionModel.permissionList = data;
      });
  }, []);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<PermissionItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.permission.id',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      align: 'center',
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
        transform: (value) => ({ id$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      align: 'center',
      tip: intl.formatMessage({
        id: 'pages.system.permission.name.tip',
        defaultMessage: '名称过长会自动收缩',
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
        transform: (value) => ({ name$LIKE: value }),
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
            console.log(record);
            CurdModel.update(record);
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
        <a key="authorized" onClick={() => console.log('授权')}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.authorize',
              defaultMessage: '授权',
            })}
          >
            <KeyOutlined />
          </Tooltip>
        </a>,
        <a key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disabled.tips',
              defaultMessage: '确认禁用？',
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

  const formTab = FormTab.createFormTab!();

  const schema: ISchema = {
    type: 'object',
    properties: {
      collapse: {
        type: 'void',
        'x-component': 'FormTab',
        'x-component-props': {
          formTab: '{{formTab}}',
        },
        properties: {
          baseTab: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addInformation',
                defaultMessage: '基础信息',
              }),
            },
            properties: {
              id: {
                title: intl.formatMessage({
                  id: 'pages.system.permission.id',
                  defaultMessage: '标识(ID)',
                }),
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                name: 'id',
                required: true,
              },
              name: {
                title: intl.formatMessage({
                  id: 'pages.table.name',
                  defaultMessage: '名称',
                }),
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                name: 'name',
                required: true,
              },
              'properties.type': {
                type: 'string',
                title: intl.formatMessage({
                  id: 'pages.searchTable.titleStatus',
                  defaultMessage: '分类',
                }),
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                name: 'properties.type',
                required: false,
              },
            },
          },
          actionsTab: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addConfiguration',
                defaultMessage: '操作配置',
              }),
            },
            properties: {
              actions: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 80, title: '-', align: 'center' },
                      properties: {
                        index: {
                          type: 'void',
                          'x-component': 'ArrayTable.Index',
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: intl.formatMessage({
                          id: 'pages.system.permission.addConfigurationType',
                          defaultMessage: '操作类型',
                        }),
                      },
                      properties: {
                        action: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: intl.formatMessage({
                          id: 'pages.table.name',
                          defaultMessage: '名称',
                        }),
                      },
                      properties: {
                        name: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: intl.formatMessage({
                          id: 'pages.table.describe',
                          defaultMessage: '描述',
                        }),
                      },
                      properties: {
                        describe: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: intl.formatMessage({
                          id: 'pages.data.option',
                          defaultMessage: '操作',
                        }),
                        dataIndex: 'operations',
                        width: 200,
                        fixed: 'right',
                      },
                      properties: {
                        item: {
                          type: 'void',
                          'x-component': 'FormItem',
                          properties: {
                            remove: {
                              type: 'void',
                              'x-component': 'ArrayTable.Remove',
                            },
                            moveDown: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveDown',
                            },
                            moveUp: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveUp',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    title: intl.formatMessage({
                      id: 'pages.system.permission.add',
                      defaultMessage: '添加条目',
                    }),
                  },
                },
              },
            },
          },
          relationTab: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addPermissionOperation',
                defaultMessage: '关联权限',
              }),
            },
            properties: {
              parents: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {},
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 80, title: '-', align: 'center' },
                      properties: {
                        index: {
                          type: 'void',
                          'x-component': 'ArrayTable.Index',
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: intl.formatMessage({
                          id: 'pages.system.permission.addPermissionPreOperation',
                          defaultMessage: '前置操作',
                        }),
                      },
                      properties: {
                        preActions: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Select',
                          enum: defaultAction,
                          'x-component-props': {
                            mode: 'multiple',
                            style: { minWidth: 100 },
                          },
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: intl.formatMessage({
                          id: 'pages.system.permission.addPermission',
                          defaultMessage: '关联权限',
                        }),
                      },
                      properties: {
                        permission: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Select',
                          enum: PermissionModel.permissionList,
                          'x-component-props': {
                            style: { minWidth: 200, maxWidth: 300 },
                          },
                        },
                      },
                    },
                    column4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: intl.formatMessage({
                          id: 'pages.system.permission.addPermissionOperation',
                          defaultMessage: '关联操作',
                        }),
                      },
                      properties: {
                        actions: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Select',
                          'x-component-props': {
                            mode: 'multiple',
                            style: { minWidth: 100 },
                          },
                          enum: defaultAction,
                        },
                      },
                    },
                    column5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: intl.formatMessage({
                          id: 'pages.data.option',
                          defaultMessage: '操作',
                        }),
                        dataIndex: 'operations',
                        width: 200,
                        fixed: 'right',
                      },
                      properties: {
                        item: {
                          type: 'void',
                          'x-component': 'FormItem',
                          properties: {
                            remove: {
                              type: 'void',
                              'x-component': 'ArrayTable.Remove',
                            },
                            moveDown: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveDown',
                            },
                            moveUp: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveUp',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    title: intl.formatMessage({
                      id: 'pages.system.permission.add',
                      defaultMessage: '添加条目',
                    }),
                  },
                },
              },
            },
          },
          optionalFieldsTab: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addDataView',
                defaultMessage: '数据视图',
              }),
            },
            properties: {
              optionalFields: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                items: {
                  type: 'object',
                  properties: {
                    column1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 80, title: '-', align: 'center' },
                      properties: {
                        index: {
                          type: 'void',
                          'x-component': 'ArrayTable.Index',
                        },
                      },
                    },
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: '字段',
                      },
                      properties: {
                        name: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        width: 200,
                        title: '描述',
                      },
                      properties: {
                        describe: {
                          type: 'string',
                          'x-decorator': 'Editable',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: intl.formatMessage({
                          id: 'pages.data.option',
                          defaultMessage: '操作',
                        }),
                        dataIndex: 'operations',
                        width: 200,
                        fixed: 'right',
                      },
                      properties: {
                        item: {
                          type: 'void',
                          'x-component': 'FormItem',
                          properties: {
                            remove: {
                              type: 'void',
                              'x-component': 'ArrayTable.Remove',
                            },
                            moveDown: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveDown',
                            },
                            moveUp: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveUp',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    title: intl.formatMessage({
                      id: 'pages.system.permission.add',
                      defaultMessage: '添加条目',
                    }),
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud<PermissionItem>
        actionRef={actionRef}
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.system.permission',
          defaultMessage: '',
        })}
        schemaConfig={{
          scope: { formTab },
        }}
        modelConfig={{
          width: 1000,
        }}
        menu={menu}
        schema={schema}
      />
    </PageContainer>
  );
});

export default Permission;

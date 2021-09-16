import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
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
import BaseService from '@/utils/BaseService';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { FormTab } from '@formily/antd';

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);

export const service = new BaseService<PermissionItem>('permission');
const Permission: React.FC = () => {
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
        transform: (value) => ({ name$LIKE: value }),
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
        <a key="editable" onClick={() => CurdModel.update(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a onClick={() => console.log('授权')}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.authorize',
              defaultMessage: '授权',
            })}
          >
            <KeyOutlined />
          </Tooltip>
        </a>,
        <a href={record.id} target="_blank" rel="noopener noreferrer" key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disable.tips',
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
                id: `pages.data.option.${record.status ? 'disable' : 'enable'}`,
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

  const schema = {
    type: 'object',
    properties: {
      collapse: {
        type: 'void',
        'x-component': 'FormTab',
        'x-component-props': {
          formTab: '{{formTab}}',
        },
        properties: {
          tab1: {
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
                'x-component-props': {
                  checkStrength: true,
                },
                name: 'properties.type',
                required: false,
              },
            },
          },
          tab2: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addConfiguration',
                defaultMessage: '操作配置',
              }),
            },
            properties: {
              array: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {},
                items: {
                  type: 'object',
                  properties: {
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 80, title: 'Index', align: 'center' },
                      properties: {
                        index: {
                          type: 'void',
                          'x-component': 'ArrayTable.Index',
                        },
                      },
                    },
                    column3: {
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
                        a1: {
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
                          id: 'pages.table.name',
                          defaultMessage: '名称',
                        }),
                      },
                      properties: {
                        a2: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column5: {
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
                        a3: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column6: {
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
          tab3: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addPermissionOperation',
                defaultMessage: '关联权限',
              }),
            },
            properties: {
              array1: {
                type: 'array',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {},
                items: {
                  type: 'object',
                  properties: {
                    column2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': { width: 80, title: 'Index', align: 'center' },
                      properties: {
                        index: {
                          type: 'void',
                          'x-component': 'ArrayTable.Index',
                        },
                      },
                    },
                    column3: {
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
                        a1: {
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
                          id: 'pages.system.permission.addPermission',
                          defaultMessage: '关联权限',
                        }),
                      },
                      properties: {
                        a2: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column5: {
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
                        a3: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                        },
                      },
                    },
                    column6: {
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
          tab4: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: intl.formatMessage({
                id: 'pages.system.permission.addDataView',
                defaultMessage: '数据视图',
              }),
            },
          },
        },
      },
    },
    _designableId: 'zd740kqp5hf',
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
          width: 800,
        }}
        menu={menu}
        schema={schema}
      />
    </PageContainer>
  );
};

export default Permission;

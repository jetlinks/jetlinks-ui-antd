import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Badge, Button, Menu, message, Popconfirm, Tooltip, Upload } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import BaseCrud from '@/components/BaseCrud';
import { CurdModel } from '@/components/BaseCrud/model';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { FormTab } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import Service from '@/pages/system/Permission/service';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { downloadObject } from '@/utils/util';
import { onFormSubmitStart } from '@formily/core';

export const service = new Service('permission');

const defaultAction = [
  { action: 'query', name: '查询', describe: '查询' },
  { action: 'save', name: '保存', describe: '保存' },
  { action: 'delete', name: '删除', describe: '删除' },
];

const PermissionModel = model<{
  assetsTypesList: { label: string; value: string }[];
}>({
  assetsTypesList: [],
});
const Permission: React.FC = observer(() => {
  useEffect(() => {
    service.getAssetTypes().subscribe((resp) => {
      if (resp.status === 200) {
        PermissionModel.assetsTypesList = resp.result.map((item: { name: string; id: string }) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }
    });
  }, []);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const menu = (
    <Menu>
      <Menu.Item key="import">
        <Upload
          action={`/${SystemConst.API_BASE}/file/static`}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          showUploadList={false}
          accept=".json"
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result: any) => {
              try {
                const data = JSON.parse(result.target.result);
                service.batchAdd(data).subscribe((resp) => {
                  if (resp.status === 200) {
                    message.success('导入成功');
                    actionRef.current?.reload();
                  }
                });
              } catch (error) {
                message.error('导入失败，请重试！');
              }
            };
          }}
        >
          <Button>导入</Button>
        </Upload>
      </Menu.Item>
      <Menu.Item key="export">
        <Popconfirm
          title={'确认导出？'}
          onConfirm={() => {
            service.getPermission().subscribe((resp) => {
              if (resp.status === 200) {
                downloadObject(resp.result, '权限数据');
                message.success('导出成功');
              } else {
                message.error('导出错误');
              }
            });
          }}
        >
          <Button>导出</Button>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const columns: ProColumns<PermissionItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.permission.id',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
      // copyable: true,
      ellipsis: true,
      // sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      // copyable: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      // filters: true,
      valueType: 'select',
      valueEnum: {
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
      render: (text, record) => (
        <Badge status={record.status === 1 ? 'success' : 'error'} text={text} />
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
        <a
          key="editable"
          onClick={() => {
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
        <a key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disabled.tips',
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              await service.update({
                ...record,
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
        <Tooltip
          key="delete"
          title={
            record.status === 0
              ? intl.formatMessage({
                  id: 'pages.data.option.remove',
                  defaultMessage: '删除',
                })
              : '请先禁用该权限，再删除。'
          }
        >
          <Button type="link" style={{ padding: 0 }} disabled={record.status === 1}>
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
              <DeleteOutlined />
            </Popconfirm>
          </Button>
        </Tooltip>,
      ],
    },
  ];

  const formTab = FormTab.createFormTab!();

  const schema: ISchema = {
    type: 'object',
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
        'x-decorator-props': {
          tooltip: <div>标识ID需与代码中的标识ID一致</div>,
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入标识(ID)',
          },
        ],
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
      // status: {
      //   title: '状态',
      //   'x-decorator': 'FormItem',
      //   'x-component': 'Switch',
      //   required: true,
      //   default: 1,
      //   enum: [
      //     { label: '1', value: 1 },
      //     { label: '0', value: 0 },
      //   ],
      // },
      // 'properties.assetTypes': {
      //   type: 'string',
      //   title: '关联资产',
      //   'x-decorator': 'FormItem',
      //   'x-component': 'Select',
      //   name: 'properties.assetTypes',
      //   required: false,
      //   enum: PermissionModel.assetsTypesList,
      //   'x-decorator-props': {
      //     tooltip: <div>关联资产为角色权限中的权限分配提供数据支持</div>,
      //   },
      //   'x-component-props': {
      //     showSearch: true,
      //     mode: 'multiple',
      //   },
      // },
      actions: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        default: defaultAction,
        title: '操作类型',
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
  };
  return (
    <PageContainer>
      <BaseCrud<PermissionItem>
        moduleName="permission"
        actionRef={actionRef}
        columns={columns}
        service={service}
        defaultParams={{ sorts: [{ name: 'id', order: 'desc' }] }}
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
        search={false}
        menu={menu}
        formEffect={() => {
          onFormSubmitStart((form) => {
            form.values.actions = form.values.actions?.filter(
              (item: any) => Object.keys(item).length > 0,
            );
          });
        }}
        schema={schema}
      />
    </PageContainer>
  );
});

export default Permission;

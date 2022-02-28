import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import {
  EditOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { Menu, Tooltip, Popconfirm, message, Button, Upload } from 'antd';
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
import moment from 'moment';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';

export const service = new Service('permission');

const defaultAction = [
  { action: 'query', name: '查询', describe: '查询' },
  { action: 'save', name: '保存', describe: '保存' },
  { action: 'delete', name: '删除', describe: '删除' },
];

const downloadObject = (record: any, fileName: string) => {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = `${fileName}-${
    record.name || moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
  }.json`;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  const blob = new Blob([JSON.stringify(record)]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

const PermissionModel = model<{
  assetsTypesList: { label: string; value: string }[];
}>({
  assetsTypesList: [],
});
const Permission: React.FC = observer(() => {
  useEffect(() => {
    service.getAssetTypes().subscribe((resp) => {
      if (resp.status === 200) {
        const list = resp.result.map((item: { name: string; id: string }) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        PermissionModel.assetsTypesList = list;
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
      copyable: true,
      ellipsis: true,
      align: 'center',
      // sorter: true,
      defaultSortOrder: 'ascend',
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      // filters: true,
      align: 'center',
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
              <MinusOutlined />
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
      status: {
        title: '状态',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        required: true,
        default: 1,
        enum: [
          { label: '1', value: 1 },
          { label: '0', value: 0 },
        ],
      },
      'properties.assetTypes': {
        type: 'string',
        title: '关联资产',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        name: 'properties.assetTypes',
        required: false,
        enum: PermissionModel.assetsTypesList,
        'x-component-props': {
          showSearch: true,
          mode: 'multiple',
        },
      },
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
        schema={schema}
      />
    </PageContainer>
  );
});

export default Permission;

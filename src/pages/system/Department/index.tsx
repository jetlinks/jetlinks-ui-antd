// 部门管理
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@jetlinks/pro-table';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useRef } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import Service from '@/pages/system/Department/service';
import type { ISchema } from '@formily/json-schema';
import type { DepartmentItem } from '@/pages/system/Department/typings';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Link } from 'umi';
import Save from './save';

export const service = new Service('organization');

type ModelType = {
  visible: boolean;
  current: Partial<DepartmentItem>;
  parentId: string | undefined;
};
export const State = model<ModelType>({
  visible: false,
  current: {},
  parentId: undefined,
});

export default observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  /**
   * 根据部门ID删除数据
   * @param id
   */
  const deleteItem = async (id: string) => {
    const response: any = await service.remove(id);
    if (response.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功!',
        }),
      );
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<DepartmentItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instanceDetail.detail.sort',
        defaultMessage: '排序',
      }),
      dataIndex: 'sortIndex',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 240,
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            State.current = record;
            State.visible = true;
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
          key="editable"
          onClick={() => {
            State.current = {
              parentId: record.id,
            };
            State.visible = true;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '新增子部门',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <Link key="assets" to={`/system/department/${record.id}/assets`}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '资产分配',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </Link>,
        <Link key="user" to={`/system/department/${record.id}/user`}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '用户',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </Link>,
        <Popconfirm
          key="unBindUser"
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否批量解除绑定',
          })}
          onConfirm={() => {
            deleteItem(record.id);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.delete',
              defaultMessage: '删除',
            })}
          >
            <a key="delete">
              <EditOutlined />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      sortIndex: {
        type: 'string',
        title: '排序',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  };

  return (
    <PageContainer>
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          delete params.pageIndex;
          const response = await service.queryOrgThree({ paging: false, ...params });
          return {
            code: response.message,
            result: {
              data: response.result as CategoryItem[],
              pageIndex: 0,
              pageSize: 0,
              total: 0,
            },
            status: response.status,
          };
        }}
        rowKey="id"
        pagination={false}
        toolBarRender={() => [
          <Button
            onClick={() => (State.visible = true)}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
        ]}
        headerTitle={intl.formatMessage({
          id: 'pages.system.department',
          defaultMessage: '部门列表',
        })}
        defaultParams={{ typeId: 'org' }}
      />
      <Save<DepartmentItem>
        service={service}
        onCancel={(type) => {
          if (type) {
            actionRef.current?.reload();
          }
          State.current = {};
          State.visible = false;
        }}
        data={State.current}
        visible={State.visible}
        schema={schema}
      />
    </PageContainer>
  );
});

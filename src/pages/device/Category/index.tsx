import { PageContainer } from '@ant-design/pro-layout';
import Service from '@/pages/device/Category/service';
import type { ProColumns } from '@jetlinks/pro-table';
import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useRef } from 'react';
import type { ActionType } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import ProTable from '@jetlinks/pro-table';
import Save from '@/pages/device/Category/Save';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { Response } from '@/utils/typings';

export const service = new Service('device/category');

export const state = model<{
  visible: boolean;
  current: Partial<CategoryItem>;
  parentId: string | undefined;
}>({
  visible: false,
  current: {},
  parentId: undefined,
});
const Category = observer(() => {
  const actionRef = useRef<ActionType>();

  const intl = useIntl();

  const columns: ProColumns<CategoryItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.device.category.id',
        defaultMessage: '分类ID',
      }),
      align: 'left',
      width: 400,
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.category.key',
        defaultMessage: '标识',
      }),
      align: 'left',
      dataIndex: 'key',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.category.name',
        defaultMessage: '分类名称',
      }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'description',
      width: 300,
      align: 'center',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      render: (text, record) => [
        <a
          onClick={() => {
            state.visible = true;
            state.current = record;
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
          onClick={() => {
            state.visible = true;
            state.parentId = record.id;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.device.category.addClass',
              defaultMessage: '添加子分类',
            })}
          >
            <PlusOutlined />
          </Tooltip>
        </a>,
        <Popconfirm
          onConfirm={async () => {
            const resp = (await service.remove(record.id)) as Response<any>;
            if (resp.status === 200) {
              message.success('操作成功');
            } else {
              message.error('操作失败');
            }
            actionRef.current?.reload();
          }}
          title={'确认删除吗？'}
        >
          <a>
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <MinusOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        request={async (params) => {
          delete params.pageIndex;
          const response = await service.queryTree({ paging: false, ...params });
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
        columns={columns}
        headerTitle={intl.formatMessage({
          id: 'pages.device.category',
          defaultMessage: '产品分类',
        })}
        toolBarRender={() => [
          <Button
            onClick={() => (state.visible = true)}
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
        pagination={false}
        actionRef={actionRef}
      />
      <Save
        data={state.current}
        visible={state.visible}
        close={() => {
          state.visible = false;
          state.current = {};
          state.parentId = undefined;
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
});

export default Category;

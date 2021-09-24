import { PageContainer } from '@ant-design/pro-layout';
import Service from '@/pages/device/Category/service';
import type { ProColumns } from '@jetlinks/pro-table';
import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useRef } from 'react';
import type { ActionType } from '@jetlinks/pro-table';
import BaseCrud from '@/components/BaseCrud';
import type { ISchema } from '@formily/json-schema';
import { useIntl } from '@@/plugin-locale/localeExports';

const service = new Service('device/category');
const Category = () => {
  const actionRef = useRef<ActionType>();

  const intl = useIntl();
  const columns: ProColumns<CategoryItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.device.category.id',
        defaultMessage: '分类ID',
      }),
      align: 'left',
      width: 200,
      dataIndex: 'id',
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
            console.log(record);
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
        <a onClick={() => {}}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.device.category.addClass',
              defaultMessage: '添加子分类',
            })}
          >
            <PlusOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: 'ID',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
        name: 'id',
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
        name: 'name',
      },
      key: {
        title: intl.formatMessage({
          id: 'pages.device.category.key',
          defaultMessage: '标识',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
        name: 'name',
      },
      description: {
        type: 'string',
        title: intl.formatMessage({
          id: 'pages.table.describe',
          defaultMessage: '描述信息',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 3,
        },
        name: 'description',
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud
        request={async () => {
          const response = await service.queryTree();
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
        search={false}
        pagination={false}
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.device.category',
          defaultMessage: '产品分类',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default Category;

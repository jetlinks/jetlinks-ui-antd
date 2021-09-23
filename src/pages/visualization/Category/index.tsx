import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { CategoryItem } from '@/pages/visualization/Category/typings';
import { Tooltip } from 'antd';
import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';

export const service = new BaseService<CategoryItem>('visualization/catalog');
const Category = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<CategoryItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.table.describe',
        defaultMessage: '描述',
      }),
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
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.visualization.option.addClass',
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

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.visualization.category',
          defaultMessage: '分类管理',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Category;

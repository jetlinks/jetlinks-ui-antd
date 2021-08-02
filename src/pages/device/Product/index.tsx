import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { Badge, Button, Card, message, Space, Tag, Tooltip, Typography } from 'antd';
import type { ProductItem } from '@/pages/device/Product/typings';
import {
  CloseCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  GoldOutlined,
  MinusOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { lastValueFrom } from 'rxjs';
import Service from '@/pages/device/Product/service';
import { observer } from '@formily/react';
import { Link } from '@umijs/preset-dumi/lib/theme';
import { model } from '@formily/reactive';
import encodeQuery from '@/utils/encodeQuery';

export const service = new Service('device-product');
export const statusMap = {
  1: <Badge status="processing" text="已发布" />,
  0: <Badge status="error" text="未发布" />,
};
export const productModel = model<{
  current: ProductItem | undefined;
}>({
  current: undefined,
});
const Product = observer(() => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <ProList<ProductItem>
          toolBarRender={() => {
            return [
              <Button key="3" type="primary">
                新建
              </Button>,
            ];
          }}
          search={{
            filterType: 'light',
          }}
          rowKey={'id'}
          headerTitle="产品列表"
          request={async (params = {}) => {
            return await lastValueFrom(
              service.list(encodeQuery({ ...params, sorts: { id: 'ascend' } })),
            );
          }}
          pagination={{
            pageSize: 5,
          }}
          // showActions="hover"
          metas={{
            id: {
              dataIndex: 'id',
              title: 'ID',
            },
            title: {
              dataIndex: 'name',
              title: '名称',
            },
            avatar: {
              dataIndex: 'id',
              search: false,
            },
            description: {
              dataIndex: 'classifiedName',
              search: false,
            },
            subTitle: {
              dataIndex: 'state',
              render: (_, row) => <Space size={0}>{statusMap[row.state]}</Space>,
              search: false,
            },
            content: {
              search: false,
              render: (_, row) => (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 200,
                    }}
                  >
                    <div>ID</div>
                    <Typography.Paragraph copyable={{ text: row.id }}>
                      {' '}
                      {row.id}
                    </Typography.Paragraph>
                  </div>
                  <div
                    style={{
                      width: 200,
                    }}
                  >
                    <div>设备数量</div>
                    <Badge
                      showZero={true}
                      className="site-badge-count-109"
                      count={row.count}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </div>
                  <div
                    style={{
                      width: 200,
                    }}
                  >
                    <div>设备分类</div>
                    <Tag icon={<GoldOutlined />} color="#55acee">
                      {' '}
                      {row.deviceType.text}
                    </Tag>
                  </div>
                </div>
              ),
            },
            actions: {
              render: (_, record) => [
                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.data.option.detail',
                    defaultMessage: '查看',
                  })}
                  key={'detail'}
                >
                  <Link
                    onClick={() => {
                      productModel.current = record;
                    }}
                    to={`/device/product/detail/${record.id}`}
                    key="link"
                  >
                    <EyeOutlined />
                  </Link>
                </Tooltip>,
                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.data.option.edit',
                    defaultMessage: '编辑',
                  })}
                  key={'edit'}
                >
                  <a key="warning">
                    <EditOutlined />
                  </a>
                </Tooltip>,

                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.data.option.download',
                    defaultMessage: '下载',
                  })}
                  key={'download'}
                >
                  <a key="download">
                    <DownloadOutlined
                      onClick={() => {
                        message.success('下载');
                      }}
                    />
                  </a>
                </Tooltip>,
                <Tooltip
                  title={intl.formatMessage({
                    id: `pages.data.option.${record.state ? 'disable' : 'enable'}`,
                    defaultMessage: record.state ? '禁用' : '启用',
                  })}
                  key={'state'}
                >
                  <a key="state">
                    {record.state ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
                  </a>
                </Tooltip>,
                <Tooltip
                  title={intl.formatMessage({
                    id: 'pages.data.option.remove',
                    defaultMessage: '删除',
                  })}
                  key={'remove'}
                >
                  <a key="delete">
                    <MinusOutlined />
                  </a>
                </Tooltip>,
              ],
              search: false,
            },
            state: {
              // 自己扩展的字段，主要用于筛选，不在列表中显示
              title: '状态',
              valueType: 'select',
              valueEnum: {
                all: { text: '全部', status: 'Default' },
                1: {
                  text: '已发布',
                  status: 'Error',
                },
                0: {
                  text: '未发布',
                  status: 'Success',
                },
              },
            },
          }}
        />
      </Card>
    </PageContainer>
  );
});
export default Product;

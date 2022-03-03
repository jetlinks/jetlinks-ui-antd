import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Button, message, Space, Tooltip } from 'antd';
import type { ProductItem } from '@/pages/device/Product/typings';
import {
  CloseCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MinusOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Service from '@/pages/device/Product/service';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Link } from 'umi';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import ProTable from '@jetlinks/pro-table';
import { lastValueFrom } from 'rxjs';
import encodeQuery from '@/utils/encodeQuery';
import Save from '@/pages/device/Product/Save';
import Edit from '@/pages/device/components/Metadata/Base/Edit';
// import Operator from '@/pages/device/components/Operator';
// import Debug from '@/pages/device/components/Debug';

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
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<ProductItem>();
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const status = {
    1: (
      <Badge
        status="processing"
        text={intl.formatMessage({
          id: 'pages.system.tenant.assetInformation.published',
          defaultMessage: '已发布',
        })}
      />
    ),
    0: (
      <Badge
        status="error"
        text={intl.formatMessage({
          id: 'pages.system.tenant.assetInformation.unpublished',
          defaultMessage: '未发布',
        })}
      />
    ),
  };
  const columns: ProColumns<ProductItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      render: (_, row) => <Space size={0}>{status[row.state]}</Space>,
    },
    {
      title: '设备数量',
      dataIndex: 'count',
    },
    {
      title: '设备分类',
      dataIndex: 'classifiedName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
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
          <a
            key="warning"
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
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
              onClick={async () => {
                await message.success(
                  `${intl.formatMessage({
                    id: 'pages.data.option.download',
                    defaultMessage: '下载',
                  })}`,
                );
              }}
            />
          </a>
        </Tooltip>,
        <Tooltip
          title={intl.formatMessage({
            id: `pages.data.option.${record.state ? 'disabled' : 'enabled'}`,
            defaultMessage: record.state ? '禁用' : '启用',
          })}
          key={'state'}
        >
          <a key="state">{record.state ? <CloseCircleOutlined /> : <PlayCircleOutlined />}</a>
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
    },
  ];

  return (
    <PageContainer>
      <ProTable<ProductItem>
        columns={columns}
        actionRef={actionRef}
        options={{ fullScreen: true }}
        request={async (params = {}) => {
          return await lastValueFrom(
            service.queryZipCount(encodeQuery({ ...params, sorts: { id: 'ascend' } })),
          );
        }}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button
            onClick={() => setVisible(true)}
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
      />
      <Save
        data={current}
        close={() => {
          setVisible(false);
          actionRef.current?.reload();
        }}
        visible={visible}
      />
      <Edit type={'product'} />
      {/*<Operator />*/}
      {/*<Debug />*/}
    </PageContainer>
  );
});
export default Product;

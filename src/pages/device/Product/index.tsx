import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Button, message, Popconfirm, Space, Tooltip } from 'antd';
import type { ProductItem } from '@/pages/device/Product/typings';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Service from '@/pages/device/Product/service';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Link, useHistory } from 'umi';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import Save from '@/pages/device/Product/Save';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { ProTableCard } from '@/components';
import ProductCard from '@/components/ProTableCard/CardItems/product';

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
  const [queryParam, setQueryParam] = useState({});
  const history = useHistory<Record<string, string>>();

  useEffect(() => {
    if (history) {
      const state = history.location.state;
      if (state) {
        setQueryParam({
          terms: history.location.state,
        });
      }
    }
  }, [history]);

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

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setQueryParam({
      terms: data,
    });
  };

  const changeDeploy = (id: string, state: 'deploy' | 'undeploy') => {
    service.changeDeploy(id, state).subscribe((res) => {
      if (res) {
        actionRef?.current?.reload();
      }
    });
  };

  const tools = (record: ProductItem) => [
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
        to={`${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], record.id)}`}
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
      <Button
        key="warning"
        onClick={() => {
          setCurrent(record);
          setVisible(true);
        }}
        type={'link'}
      >
        <EditOutlined />
      </Button>
    </Tooltip>,
    <Tooltip
      title={intl.formatMessage({
        id: 'pages.data.option.download',
        defaultMessage: '下载',
      })}
      key={'download'}
    >
      <Button type={'link'}>
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
      </Button>
    </Tooltip>,
    <Popconfirm
      key={'state'}
      title={intl.formatMessage({
        id: `pages.data.option.${record.state ? 'disabled' : 'enabled'}.tips`,
        defaultMessage: '是否启用?',
      })}
      onConfirm={() => {
        changeDeploy(record.id, record.state ? 'undeploy' : 'deploy');
      }}
    >
      <Tooltip
        title={intl.formatMessage({
          id: `pages.data.option.${record.state ? 'disabled' : 'enabled'}`,
          defaultMessage: record.state ? '禁用' : '启用',
        })}
      >
        <Button type={'link'}>{record.state ? <StopOutlined /> : <PlayCircleOutlined />}</Button>
      </Tooltip>
    </Popconfirm>,
    <Popconfirm
      key="unBindUser"
      title={intl.formatMessage({
        id: record.state === 1 ? 'pages.device.productDetail.deleteTip' : 'page.table.isDelete',
        defaultMessage: '是否删除?',
      })}
      onConfirm={async () => {
        if (record.state === 0) {
          await deleteItem(record.id);
        } else {
          message.error('已发布的产品不能进行删除操作');
        }
      }}
    >
      <Tooltip
        title={intl.formatMessage({
          id: 'pages.data.option.remove',
          defaultMessage: '删除',
        })}
        key={'remove'}
      >
        <a key="delete">
          <DeleteOutlined />
        </a>
      </Tooltip>
    </Popconfirm>,
  ];

  const columns: ProColumns<ProductItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      render: (_, row) => <>{row.deviceType ? row.deviceType.text : undefined}</>,
    },
    {
      title: '状态',
      render: (_, row) => <Space size={0}>{status[row.state]}</Space>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_, record) => tools(record),
    },
  ];

  return (
    <PageContainer>
      <SearchComponent field={columns} onSearch={searchFn} />
      <ProTableCard<ProductItem>
        columns={columns}
        actionRef={actionRef}
        options={{ fullScreen: true }}
        // request={async (params = {}) => {
        //   return await lastValueFrom(
        //     service.queryZipCount(encodeQuery({ ...params, sorts: { id: 'ascend' } })),
        //   );
        // }}
        params={queryParam}
        request={(params = {}) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        headerTitle={[
          <Button
            onClick={() => {
              setCurrent(undefined);
              setVisible(true);
            }}
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
        cardRender={(record) => <ProductCard {...record} actions={tools(record)} />}
      />
      <Save
        model={!current ? 'add' : 'edit'}
        data={current}
        close={() => {
          setVisible(false);
        }}
        reload={() => {
          actionRef.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
});
export default Product;

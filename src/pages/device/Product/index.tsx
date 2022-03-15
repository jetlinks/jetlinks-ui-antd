import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Button, message, Popconfirm, Space, Tooltip } from 'antd';
import type { ProductItem } from '@/pages/device/Product/typings';
import {
  StopOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Service from '@/pages/device/Product/service';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Link } from 'umi';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import ProTable from '@jetlinks/pro-table';
import encodeQuery from '@/utils/encodeQuery';
import Save from '@/pages/device/Product/Save';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';

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
      dataIndex: 'classifiedName',
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
        <Popconfirm
          key={'state'}
          title={intl.formatMessage({
            id: `pages.data.option.${record.state ? 'disabled' : 'enabled'}.tips`,
            defaultMessage: '是否删除该菜单',
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
            <a key="state">{record.state ? <StopOutlined /> : <PlayCircleOutlined />}</a>
          </Tooltip>
        </Popconfirm>,
        <Popconfirm
          key="unBindUser"
          title={intl.formatMessage({
            id: 'page.system.menu.table.delete',
            defaultMessage: '是否删除该菜单',
          })}
          onConfirm={() => {
            deleteItem(record.id);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove.tips',
              defaultMessage: '删除',
            })}
            key={'remove'}
          >
            <a key="delete">
              <DeleteOutlined />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent field={columns} onSearch={searchFn} />
      <ProTable<ProductItem>
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
          service.query(encodeQuery({ ...params, sorts: { createTime: 'ascend' } }))
        }
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
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

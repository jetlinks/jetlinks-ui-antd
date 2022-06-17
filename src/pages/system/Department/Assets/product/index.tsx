// 资产分配-产品分类
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import type { ProductItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Service from '@/pages/system/Department/Assets/service';
import Models from './model';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';
import {
  ExtraProductCard,
  handlePermissionsMap,
} from '@/components/ProTableCard/CardItems/product';
import { ProTableCard } from '@/components';
import { onlyMessage } from '@/utils/util';

export const service = new Service<ProductItem>('assets');

export default observer((props: { parentId: string }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [searchParam, setSearchParam] = useState({});

  /**
   * 解除资产绑定
   */
  const handleUnBind = () => {
    if (Models.unBindKeys.length) {
      service
        .unBind('product', [
          {
            targetType: 'org',
            targetId: props.parentId,
            assetType: 'product',
            assetIdList: Models.unBindKeys,
          },
        ])
        .subscribe({
          next: () => onlyMessage('操作成功'),
          error: () => onlyMessage('操作失败', 'error'),
          complete: () => {
            Models.unBindKeys = [];
            actionRef.current?.reload();
          },
        });
    } else {
      onlyMessage('请勾选需要解绑的数据', 'warning');
    }
  };

  const singleUnBind = (key: string) => {
    Models.unBindKeys = [key];
    handleUnBind();
  };

  const columns: ProColumns<ProductItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: '资产权限',
      dataIndex: 'grantedPermissions',
      hideInSearch: true,
      render: (_, row) => {
        return handlePermissionsMap(row.grantedPermissions);
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'describe',
      hideInSearch: true,
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
        <Popconfirm
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否解除绑定',
          })}
          key="unBind"
          onConfirm={() => {
            singleUnBind(record.id);
          }}
        >
          <Button type={'link'} style={{ padding: 0 }}>
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    Models.bind = false;
    Models.bindKeys = [];
  };

  useEffect(() => {
    setSearchParam({
      terms: [
        {
          column: 'id',
          termType: 'dim-assets',
          value: {
            assetType: 'product',
            targets: [
              {
                type: 'org',
                id: props.parentId,
              },
            ],
          },
        },
      ],
    });
    actionRef.current?.reload();
    //  初始化所有状态
    Models.bindKeys = [];
    Models.unBindKeys = [];
  }, [props.parentId]);

  const getData = (params: any, parentId: string) => {
    return new Promise((resolve) => {
      service.queryProductList2(params, parentId).subscribe((data) => {
        resolve(data);
      });
    });
  };

  return (
    <>
      {Models.bind && (
        <Bind
          visible={Models.bind}
          onCancel={closeModal}
          reload={() => actionRef.current?.reload()}
          parentId={props.parentId}
        />
      )}
      <SearchComponent<ProductItem>
        field={columns}
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets',
            value: {
              assetType: 'product',
              targets: [
                {
                  type: 'org',
                  id: props.parentId,
                },
              ],
            },
          },
        ]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParam({});
        // }}
        target="department-assets-product"
      />
      <ProTableCard<ProductItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        gridColumn={2}
        params={searchParam}
        request={async (params) => {
          if (!props.parentId) {
            return {
              code: 200,
              result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
              },
              status: 200,
            };
          }
          const resp: any = await getData(params, props.parentId);
          return {
            code: resp.status,
            result: resp.result,
            status: resp.status,
          };
        }}
        rowSelection={{
          selectedRowKeys: Models.unBindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows);
            Models.unBindKeys = selectedRows.map((item) => item.id);
          },
        }}
        cardRender={(record) => (
          <ExtraProductCard
            {...record}
            onUnBind={() => {
              singleUnBind(record.id);
            }}
          />
        )}
        toolBarRender={() => [
          <Button
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
            disabled={!props.parentId}
          >
            {intl.formatMessage({
              id: 'pages.data.option.assets',
              defaultMessage: '资产分配',
            })}
          </Button>,
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否批量解除绑定',
            })}
            key="unBind"
            onConfirm={handleUnBind}
          >
            <Button icon={<DisconnectOutlined />}>
              {intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              })}
            </Button>
          </Popconfirm>,
        ]}
      />
    </>
  );
});

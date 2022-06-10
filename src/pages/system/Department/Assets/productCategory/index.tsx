// 资产分配-产品分类
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, message, Popconfirm, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import type { ProductCategoryItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Models from '@/pages/system/Department/Assets/productCategory/model';
import Service from '@/pages/system/Department/Assets/service';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';
import { difference } from 'lodash';

export const service = new Service<ProductCategoryItem>('assets');

export const getTableKeys = (rows: ProductCategoryItem[]): string[] => {
  let keys: string[] = [];
  rows.forEach((item) => {
    keys.push(item.id);
    if (item.children && item.children.length) {
      const childrenKeys = getTableKeys(item.children);
      keys = [...keys, ...childrenKeys];
    }
  });

  return keys;
};

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
        .unBind('deviceCategory', [
          {
            targetType: 'org',
            targetId: props.parentId,
            assetType: 'deviceCategory',
            assetIdList: Models.unBindKeys,
          },
        ])
        .subscribe({
          next: () => message.success('操作成功'),
          error: () => message.error('操作失败'),
          complete: () => {
            Models.unBindKeys = [];
            actionRef.current?.reload();
          },
        });
    } else {
      message.warning('请勾选需要解绑的数据');
    }
  };

  const singleUnBind = (key: string) => {
    Models.unBindKeys = [key];
    handleUnBind();
  };

  const columns: ProColumns<ProductCategoryItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220,
    },
    {
      dataIndex: 'key',
      title: intl.formatMessage({
        id: 'pages.device.category.key',
        defaultMessage: '标识',
      }),
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
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
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
            assetType: 'deviceCategory',
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
    actionRef.current?.reset?.();
    //  初始化所有状态
    Models.bindKeys = [];
    Models.unBindKeys = [];
    console.log(props.parentId);
  }, [props.parentId]);

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
      <SearchComponent<ProductCategoryItem>
        field={columns}
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets',
            value: {
              assetType: 'deviceCategory',
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
        target="department-assets-category"
      />
      <ProTable<ProductCategoryItem>
        actionRef={actionRef}
        columns={columns}
        params={searchParam}
        search={false}
        rowKey="id"
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
          const response = await service.queryProductCategoryList(params);
          return {
            code: response.message,
            result: {
              data: response.result,
              pageIndex: 0,
              pageSize: 0,
              total: 0,
            },
            status: response.status,
          };
        }}
        postData={(data) => {
          console.log(data);
          return data;
        }}
        rowSelection={{
          selectedRowKeys: Models.unBindKeys,
          onSelect: (record, selected, selectedRows) => {
            const keys = getTableKeys(selected ? selectedRows : [record]);
            console.log(record, selected, selectedRows);
            if (selected) {
              const _map = new Map();
              keys.forEach((k) => {
                _map.set(k, k);
              });
              Models.unBindKeys = [..._map.values()];
            } else {
              // 去除重复的key
              Models.unBindKeys = difference(Models.unBindKeys, keys);
            }
          },
          onSelectAll: (selected, selectedRows) => {
            if (selected) {
              Models.unBindKeys = selectedRows.map((item) => item.id);
            } else {
              Models.unBindKeys = [];
            }
          },
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button
                type={'link'}
                onClick={() => {
                  Models.unBindKeys = [];
                }}
              >
                取消选择
              </Button>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            disabled={!props.parentId}
            key="bind"
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

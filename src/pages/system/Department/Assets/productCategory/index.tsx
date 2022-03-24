// 资产分配-产品分类
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useParams } from 'umi';
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

export default observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const param = useParams<{ id: string }>();
  const [searchParam, setSearchParam] = useState({});

  /**
   * 解除资产绑定
   */
  const handleUnBind = () => {
    service
      .unBind('deviceCategory', [
        {
          targetType: 'org',
          targetId: param.id,
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
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.device.category.name',
        defaultMessage: '分类名称',
      }),
      search: false,
    },
    {
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      search: false,
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
          <a href="#">
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    Models.bind = false;
    Models.bindKeys = [];
  };

  return (
    <>
      <Bind
        visible={Models.bind}
        onCancel={closeModal}
        reload={() => actionRef.current?.reload()}
      />
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
                  id: param.id,
                },
              ],
            },
          },
        ]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        onReset={() => {
          // 重置分页及搜索参数
          actionRef.current?.reset?.();
          setSearchParam({});
        }}
        target="department-assets-category"
      />
      <ProTable<ProductCategoryItem>
        actionRef={actionRef}
        columns={columns}
        params={searchParam}
        search={false}
        rowKey="id"
        request={async (params) => {
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
            if (selected) {
              Models.unBindKeys = keys;
            } else {
              // 去除重复的key
              Models.unBindKeys = difference(Models.unBindKeys, keys);
            }
          },
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
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
            <Button icon={<DisconnectOutlined />} key="bind">
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

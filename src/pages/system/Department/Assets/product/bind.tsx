// 资产-产品分类-绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { service } from './index';
import { Badge, Checkbox, message, Modal, Space, Switch } from 'antd';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProductItem } from '@/pages/system/Department/typings';
import SearchComponent from '@/components/SearchComponent';
import { ExtraProductCard } from '@/components/ProTableCard/CardItems/product';
import { ProTableCard } from '@/components';
import { AssetsModel } from '@/pages/system/Department/Assets';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Store } from 'jetlinks-store';
import { onlyMessage } from '@/utils/util';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
  parentId: string;
  assetsType: string[];
}

const status = {
  1: <Badge status="success" text={'正常'} />,
  0: <Badge status="error" text={'禁用'} />,
};

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkAssets, setCheckAssets] = useState<string[]>(['read']);
  const [isAll, setIsAll] = useState<boolean>(false);
  const bindChecks = useRef(new Map());

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
      // search: {
      //   transform: (value) => ({ name$LIKE: value }),
      // },
    },
    {
      dataIndex: 'describe',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (_, row) => <Space size={0}>{status[row.state]}</Space>,
      valueType: 'select',
      width: '90px',
      valueEnum: {
        // 2: {
        //   text: intl.formatMessage({
        //     id: 'pages.searchTable.titleStatus.all',
        //     defaultMessage: '全部',
        //   }),
        //   status: 2,
        // },
        0: {
          text: intl.formatMessage({
            id: 'pages.device.product.status.disabled',
            defaultMessage: '禁用',
          }),
          status: 0,
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.device.product.status.enabled',
            defaultMessage: '正常',
          }),
          status: 1,
        },
      },
    },
  ];

  const handleBind = () => {
    if (Models.bindKeys.length) {
      setLoading(true);
      const _data: any[] = [];
      bindChecks.current.forEach((value, key) => {
        _data.push({
          targetType: 'org',
          targetId: props.parentId,
          assetType: 'product',
          assetIdList: [key],
          permission: value,
        });
      });
      service.bind('product', _data).subscribe({
        next: () => onlyMessage('操作成功'),
        error: () => onlyMessage('操作失败', 'error'),
        complete: () => {
          setLoading(false);
          props.reload();
          props.onCancel();
        },
      });
    } else {
      message.warn('请先勾选数据');
      // props.onCancel();
    }
  };

  const unSelect = () => {
    Models.bindKeys = [];
    AssetsModel.params = {};
  };

  const getSelectedRowsKey = (selectedRows: any) => {
    return selectedRows.map((item: any) => item?.id).filter((item2: any) => !!item2 !== false);
  };

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  return (
    <>
      <Modal
        visible={props.visible}
        onOk={handleBind}
        onCancel={props.onCancel}
        width={'75vw'}
        title="绑定"
        confirmLoading={loading}
      >
        <div className={'assets-bind-tip'}>
          <ExclamationCircleOutlined style={{ paddingRight: 8 }} />
          只能分配有“共享”权限的资产数据
        </div>
        <div className={'assets-bind-switch'}>
          <span>批量配置</span>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(e) => {
              setIsAll(e);
              Store.set('assets-product', {
                isAll: e,
                assets: checkAssets,
                bindKeys: Models.bindKeys,
              });
            }}
          />
        </div>
        <div>
          <Checkbox.Group
            options={props.assetsType}
            value={checkAssets}
            onChange={(e: any) => {
              Store.set('assets-product', {
                isAll: isAll,
                assets: e,
                bindKeys: Models.bindKeys,
              });
              bindChecks.current.forEach((_, key) => {
                bindChecks.current.set(key, e);
              });
              setCheckAssets(e);
            }}
          />
        </div>
        {/*<PermissionModal*/}
        {/*  type="product"*/}
        {/*  parentId={props.parentId}*/}
        {/*  bindKeys={Models.bindKeys}*/}
        {/*  ref={saveRef}*/}
        {/*  onCancel={(type) => {*/}
        {/*    if (type) {*/}
        {/*      props.reload();*/}
        {/*      props.onCancel();*/}
        {/*    }*/}
        {/*  }}*/}
        {/*/>*/}
        <SearchComponent
          field={columns}
          model={'simple'}
          enableSave={false}
          defaultParam={[
            {
              column: 'id',
              termType: 'dim-assets$not',
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
            unSelect();
            setSearchParam(data);
          }}
          // onReset={() => {
          //   // 重置分页及搜索参数
          //   actionRef.current?.reset?.();
          //   setSearchParam({});
          // }}
          target="department-assets-product"
        />
        <div
          style={{
            height: 'calc(100vh - 440px)',
            overflowY: 'auto',
          }}
        >
          <ProTableCard<ProductItem>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            search={false}
            gridColumn={2}
            columnEmptyText={''}
            tableAlertRender={({ selectedRowKeys }) => (
              <div>已选择 {selectedRowKeys.length} 项</div>
            )}
            tableAlertOptionRender={() => {
              return (
                <a
                  onClick={() => {
                    unSelect();
                  }}
                >
                  取消选择
                </a>
              );
            }}
            rowSelection={{
              selectedRowKeys: Models.bindKeys,
              // onChange: (selectedRowKeys, selectedRows) => {
              //   Models.bindKeys = selectedRows.map((item) => item.id);
              //   AssetsModel.params = {
              //     productId: selectedRows.map((item) => item.id),
              //   };
              // },
              onSelect: (record, selected, selectedRows) => {
                if (selected) {
                  Models.bindKeys = [
                    ...new Set([...Models.bindKeys, ...getSelectedRowsKey(selectedRows)]),
                  ];
                  bindChecks.current.set(record.id, checkAssets);
                } else {
                  Models.bindKeys = Models.bindKeys.filter((item) => item !== record.id);
                  bindChecks.current.delete(record.id);
                }
                Store.set('assets-product', {
                  isAll: isAll,
                  assets: checkAssets,
                  bindKeys: Models.bindKeys,
                });
                AssetsModel.params = {
                  productId: Models.bindKeys,
                };
              },
              onSelectAll: (selected, selectedRows, changeRows) => {
                if (selected) {
                  Models.bindKeys = [
                    ...new Set([...Models.bindKeys, ...getSelectedRowsKey(selectedRows)]),
                  ];
                } else {
                  const unChangeRowsKeys = getSelectedRowsKey(changeRows);
                  Models.bindKeys = Models.bindKeys
                    .concat(unChangeRowsKeys)
                    .filter((item) => !unChangeRowsKeys.includes(item));
                }
                AssetsModel.params = {
                  productId: Models.bindKeys,
                };
              },
            }}
            request={async (params) => {
              const resp: any = await service.queryProductList({
                ...params,
                sorts: [{ name: 'createTime', order: 'desc' }],
              });
              let newData = [];
              if (resp.status === 200) {
                newData = [...resp.result.data];
                const assetsResp = await service.getBindingAssets(
                  'product',
                  resp.result.data.map((item: any) => item.id),
                );
                if (assetsResp.status === 200) {
                  newData = newData?.reduce((x: any, y: any) => {
                    const id = assetsResp.result.find((item: any) => item.assetId === y.id);
                    if (id) {
                      Object.assign(id, y);
                    } else {
                      x.push(y);
                    }
                    return x;
                  }, assetsResp.result);
                }
              }

              return {
                code: resp.message,
                result: {
                  data: newData as ProductItem[],
                  pageIndex: 0,
                  pageSize: 0,
                  total: 0,
                },
                status: resp.status,
              };
            }}
            params={searchParam}
            cardRender={(record) => {
              return (
                <ExtraProductCard
                  showBindBtn={false}
                  showTool={false}
                  {...record}
                  assetsOptions={props.assetsType}
                  allAssets={checkAssets}
                  cardType={'bind'}
                  onAssetsChange={(e) => {
                    if (bindChecks.current.has(record.id)) {
                      bindChecks.current.set(record.id, e);
                    }
                  }}
                />
              );
            }}
            height={'none'}
          />
        </div>
      </Modal>
    </>
  );
});
export default Bind;

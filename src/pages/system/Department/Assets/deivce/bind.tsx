// 资产-产品分类-绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { DeviceBadge, service } from './index';
import { Checkbox, message, Modal, Switch } from 'antd';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { DeviceItem } from '@/pages/system/Department/typings';
import SearchComponent from '@/components/SearchComponent';
import { ExtraDeviceCard } from '@/components/ProTableCard/CardItems/device';
import { ProTableCard } from '@/components';
import { AssetsModel } from '@/pages/system/Department/Assets';
import encodeQuery from '@/utils/encodeQuery';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Store } from 'jetlinks-store';
import { onlyMessage } from '@/utils/util';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
  parentId: string;
  assetsType?: string[];
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkAssets, setCheckAssets] = useState<string[]>(['read']);
  const [isAll, setIsAll] = useState<boolean>(true);
  const bindChecks = useRef(new Map());

  const columns: ProColumns<DeviceItem>[] = [
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      dataIndex: 'productId$product-info',
      valueType: 'select',
      filterMultiple: true,
      request: async () => {
        const res = await service.getProductList(encodeQuery({ sorts: { createTime: 'desc' } }));
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
      render: (_, row) => {
        return row.productName;
      },
      search: {
        transform: (value) => `id is ${value}`,
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'online',
        },
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offline',
        },
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          status: 'notActive',
        },
      },
      search: false,
      render: (_, row) => <DeviceBadge type={row.state.value} text={row.state.text} />,
    },
  ];

  const handleBind = () => {
    AssetsModel.params = {};
    if (Models.bindKeys.length) {
      setLoading(true);
      const _data: any[] = [];
      bindChecks.current.forEach((value, key) => {
        _data.push({
          targetType: 'org',
          targetId: props.parentId,
          assetType: 'device',
          assetIdList: [key],
          permission: value,
        });
      });
      service.bind('device', _data).subscribe({
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
    Store.set('assets-device', {
      delete: true,
      id: 'rest',
    });
  };

  const getSelectedRowsKey = (selectedRows: any) => {
    return selectedRows.map((item: any) => item?.id).filter((item2: any) => !!item2 !== false);
  };

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  const getParams = (params: any) => {
    const _params: any = [
      {
        column: 'id',
        termType: 'dim-assets$not',
        value: {
          assetType: 'device',
          targets: [
            {
              type: 'org',
              id: props.parentId,
            },
          ],
        },
      },
    ];
    if (Object.keys(params).length && params.productId) {
      _params.push({
        type: 'and',
        column: 'productId$product-info',
        value: params.productId[0],
      });
    }
    return _params;
  };

  return (
    <Modal
      visible={props.visible}
      onOk={handleBind}
      onCancel={props.onCancel}
      confirmLoading={loading}
      width={'75vw'}
      title="绑定"
    >
      {/*<PermissionModal*/}
      {/*  type="device"*/}
      {/*  bindKeys={Models.bindKeys}*/}
      {/*  parentId={props.parentId}*/}
      {/*  ref={saveRef}*/}
      {/*  onCancel={(type) => {*/}
      {/*    if (type) {*/}
      {/*      props.reload();*/}
      {/*      props.onCancel();*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
      <div className={'assets-bind-tip'}>
        <ExclamationCircleOutlined style={{ paddingRight: 8 }} />
        只能分配有“共享”权限的资产数据
      </div>
      <div className={'assets-bind-switch'}>
        <span>批量配置</span>
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          defaultChecked={true}
          onChange={(e) => {
            setIsAll(e);
            Store.set('assets-device', {
              isAll: e,
              assets: checkAssets,
              bindKeys: Models.bindKeys,
            });
          }}
        />
      </div>
      {isAll && (
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
      )}
      <SearchComponent<DeviceItem>
        field={columns}
        enableSave={false}
        model={'simple'}
        defaultParam={getParams(
          AssetsModel.bindModal
            ? AssetsModel.params
            : [
                {
                  column: 'id',
                  termType: 'dim-assets$not',
                  value: {
                    assetType: 'device',
                    targets: [
                      {
                        type: 'org',
                        id: props.parentId,
                      },
                    ],
                  },
                },
              ],
        )}
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
        target="department-assets-device"
      />
      <div
        style={{
          height: 'calc(100vh - 440px)',
          overflowY: 'auto',
        }}
      >
        <ProTableCard<DeviceItem>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          search={false}
          gridColumn={2}
          columnEmptyText={''}
          cardRender={(record) => (
            <ExtraDeviceCard
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
          )}
          tableAlertRender={({ selectedRowKeys }) => <div>已选择 {selectedRowKeys.length} 项</div>}
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
            // },
            onSelect: (record: any, selected, selectedRows) => {
              if (selected) {
                const isShare = record.permissionInfoList.find((item: any) => item.id === 'share');
                if (isShare && isShare.length !== 0) {
                  Models.bindKeys = [
                    ...new Set([...Models.bindKeys, ...getSelectedRowsKey(selectedRows)]),
                  ];
                  bindChecks.current.set(record.id, checkAssets);
                } else {
                  onlyMessage('该资产不支持共享', 'warning');
                }
              } else {
                Models.bindKeys = Models.bindKeys.filter((item) => item !== record.id);
                bindChecks.current.set(record.id, ['read']);
                Store.set('assets-device', {
                  isAll: false,
                  id: record.id,
                  delete: true,
                });
                bindChecks.current.delete(record.id);
              }
              Store.set('assets-device', {
                isAll: isAll,
                assets: checkAssets,
                bindKeys: Models.bindKeys,
              });
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              if (selected) {
                const arr = selectedRows.filter(
                  (item: any) => !!item?.permissionInfoList.find((it: any) => it.id === 'share'),
                );
                arr.forEach((e: any) => {
                  const list = e?.permissionInfoList
                    .map((it: any) => it.id)
                    .filter?.((item: any) => checkAssets.includes(item));
                  bindChecks.current.set(e.id, list);
                });
                Models.bindKeys = [...new Set([...Models.bindKeys, ...getSelectedRowsKey(arr)])];
                console.log('onSelectAll', arr);
              } else {
                const unChangeRowsKeys = getSelectedRowsKey(changeRows);
                unChangeRowsKeys.forEach((item: any) => bindChecks.current.delete(item.id));
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
            const resp: any = await service.queryDeviceList({
              ...params,
              sorts: [{ name: 'createTime', order: 'desc' }],
            });
            let newData = [];
            if (resp.status === 200) {
              newData = [...resp.result.data];
              const assetsResp = await service.getBindingAssets(
                'device',
                resp.result.data.map((item: any) => item.id),
              );
              if (assetsResp.status === 200) {
                newData = newData.map((item: any) => {
                  const assetsItem = assetsResp.result.find(
                    (aItem: any) => (aItem.assetId = item.id),
                  );
                  console.log(assetsItem);
                  return {
                    ...item,
                    ...assetsItem,
                  };
                });
              }
            }

            return {
              code: resp.message,
              result: {
                data: newData as DeviceItem[],
                pageIndex: resp.result.pageIndex,
                pageSize: resp.result.pageIndex,
                total: resp.result.total,
              },
              status: resp.status,
            };
          }}
          params={searchParam}
          height={'none'}
        />
      </div>
    </Modal>
  );
});
export default Bind;

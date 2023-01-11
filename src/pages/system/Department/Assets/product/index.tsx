// 资产分配-产品分类
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge, Button, Dropdown, Menu, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import type { ProductItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Service from '@/pages/system/Department/Assets/service';
import Models from './model';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';
import {
  ExtraProductCard,
  handlePermissionsMap,
} from '@/components/ProTableCard/CardItems/product';
import { ProTableCard, PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';
import { ASSETS_TABS_ENUM, AssetsModel } from '@/pages/system/Department/Assets';
import UpdateModal from '../updateModal';
import '../index.less';

export const service = new Service<ProductItem>('assets');

const status = {
  1: <Badge status="success" text={'正常'} />,
  0: <Badge status="error" text={'禁用'} />,
};

export default observer((props: { parentId: string }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('system/Department');
  const [searchParam, setSearchParam] = useState({});
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateId, setUpdateId] = useState<string | string[]>('');
  const [permissions, setPermissions] = useState<string[]>(['read']);
  const [assetsType, setAssetsType] = useState([]);

  // 资产类型的权限定义
  const getAssetsType = () => {
    service.getAssetsType('product').then((res) => {
      if (res.status === 200) {
        setAssetsType(
          res.result.map((item: any) => ({
            label: item.name,
            value: item.id,
            disabled: item.id === 'read',
          })),
        );
      } else {
        setAssetsType([]);
      }
    });
  };

  useEffect(() => {
    if (AssetsModel.tabsIndex === ASSETS_TABS_ENUM.Product && actionRef.current) {
      getAssetsType();
      actionRef.current.reload();
    }
  }, [AssetsModel.tabsIndex]);

  /**
   * 解除资产绑定
   */
  const handleUnBind = () => {
    if (Models.unBindKeys.length) {
      service
        .unBind('product', [
          {
            targetType: 'org',
            targetId: AssetsModel.parentId,
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
      width: 180,
      fixed: 'left',
      ellipsis: true,
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
      width: 180,
      ellipsis: true,
    },
    {
      title: '资产权限',
      dataIndex: 'grantedPermissions',
      hideInSearch: true,
      render: (_, row) => {
        return handlePermissionsMap(row.grantedPermissions, assetsType);
      },
      width: 80,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'describe',
      hideInSearch: true,
      ellipsis: true,
      width: 200,
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
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          key="update"
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: '编辑',
          }}
          onClick={(e) => {
            e?.stopPropagation();
            setUpdateId(record.id);
            setPermissions(record.grantedPermissions!);
            setUpdateVisible(true);
          }}
          // isPermission={permission.edit}
          isPermission={permission.assert}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key="unbind"
          type={'link'}
          popConfirm={{
            title: intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否解除绑定',
            }),
            onConfirm: () => {
              singleUnBind(record.id);
            },
          }}
          isPermission={permission.bind}
        >
          <DisconnectOutlined />
        </PermissionButton>,
        // <Popconfirm
        //   title={intl.formatMessage({
        //     id: 'pages.system.role.option.unBindUser',
        //     defaultMessage: '是否解除绑定',
        //   })}
        //   key="unBind"
        //   onConfirm={() => {
        //     singleUnBind(record.id);
        //   }}
        // >
        //   <Button type={'link'} style={{ padding: 0 }}>
        //     <Tooltip
        //       title={intl.formatMessage({
        //         id: 'pages.system.role.option.unBindUser',
        //         defaultMessage: '解绑',
        //       })}
        //     >
        //       <DisconnectOutlined />
        //     </Tooltip>
        //   </Button>
        // </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    Models.bind = false;
    Models.bindKeys = [];
  };

  const unSelect = () => {
    Models.bindKeys = [];
    Models.unBindKeys = [];
  };
  const getSelectedRowsKey = (selectedRows: any) => {
    return selectedRows.map((item: any) => item?.id).filter((item2: any) => !!item2 !== false);
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

  const menu = (
    <Menu>
      <Menu.Item key={'1'}>
        <PermissionButton
          icon={<DisconnectOutlined />}
          key="unBind"
          popConfirm={{
            title: intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否批量解除绑定',
            }),
            onConfirm: handleUnBind,
          }}
          isPermission={permission.bind}
        >
          {intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '批量解绑',
          })}
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key={'2'}>
        <PermissionButton
          icon={<EditOutlined />}
          key="update"
          isPermission={permission.assert}
          onClick={() => {
            if (Models.unBindKeys.length) {
              setUpdateId([...Models.unBindKeys]);
              setUpdateVisible(true);
            } else {
              onlyMessage('请勾选需要解绑的数据', 'warning');
            }
          }}
        >
          批量编辑
        </PermissionButton>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="content">
      {Models.bind && (
        <Bind
          visible={Models.bind}
          onCancel={closeModal}
          assetsType={assetsType}
          reload={() => {
            setDeviceVisible(true);
            actionRef.current?.reload();
          }}
          parentId={props.parentId}
        />
      )}
      {deviceVisible && (
        <Modal
          visible={deviceVisible}
          width={600}
          onCancel={() => {
            setDeviceVisible(false);
          }}
          onOk={() => {
            setDeviceVisible(false);
            AssetsModel.tabsIndex = ASSETS_TABS_ENUM.Device;
            AssetsModel.bindModal = true;
          }}
          title={'绑定'}
        >
          是否继续分配产品下的具体设备
        </Modal>
      )}
      {updateVisible && (
        <UpdateModal
          permissions={permissions}
          visible={updateVisible}
          assetsType={assetsType}
          id={updateId}
          type="product"
          targetId={props.parentId}
          onCancel={() => {
            setUpdateVisible(false);
          }}
          onReload={() => {
            actionRef.current?.reload();
          }}
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
      <ProTableCard<ProductItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        gridColumn={2}
        params={searchParam}
        columnEmptyText={''}
        height={'none'}
        request={async (params) => {
          params.sorts = [{ name: 'createTime', order: 'desc' }];
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
        scroll={{ x: 1366 }}
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
          selectedRowKeys: Models.unBindKeys,
          // onChange: (selectedRowKeys, selectedRows) => {
          //   Models.unBindKeys = selectedRows.map((item) => item.id);
          // },
          onSelect: (record, selected, selectedRows) => {
            if (selected) {
              Models.unBindKeys = [
                ...new Set([...Models.unBindKeys, ...getSelectedRowsKey(selectedRows)]),
              ];
            } else {
              Models.unBindKeys = Models.unBindKeys.filter((item) => item !== record.id);
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              Models.unBindKeys = [
                ...new Set([...Models.unBindKeys, ...getSelectedRowsKey(selectedRows)]),
              ];
            } else {
              const unChangeRowsKeys = getSelectedRowsKey(changeRows);
              Models.unBindKeys = Models.unBindKeys
                .concat(unChangeRowsKeys)
                .filter((item) => !unChangeRowsKeys.includes(item));
            }
          },
        }}
        cardRender={(record) => (
          <ExtraProductCard
            {...record}
            assetsOptions={assetsType}
            actions={[
              <PermissionButton
                key="update"
                onClick={(e) => {
                  e?.stopPropagation();
                  setUpdateId(record.id);
                  setPermissions(record.grantedPermissions!);
                  setUpdateVisible(true);
                }}
                // isPermission={permission.edit}
                isPermission={permission.assert}
              >
                <EditOutlined />
              </PermissionButton>,
              <PermissionButton
                key="unbind"
                popConfirm={{
                  title: intl.formatMessage({
                    id: 'pages.system.role.option.unBindUser',
                    defaultMessage: '是否解除绑定',
                  }),
                  onConfirm: (e) => {
                    e?.stopPropagation();
                    singleUnBind(record.id);
                  },
                  onCancel: (e) => {
                    e?.stopPropagation();
                  },
                }}
                onClick={(e) => {
                  e?.stopPropagation();
                }}
                isPermission={permission.bind}
              >
                <DisconnectOutlined />
              </PermissionButton>,
            ]}
          />
        )}
        headerTitle={[
          <PermissionButton
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
            style={{ marginRight: 12 }}
            disabled={!props.parentId}
            isPermission={permission.assert}
          >
            {intl.formatMessage({
              id: 'pages.data.option.assets',
              defaultMessage: '资产分配',
            })}
          </PermissionButton>,
          <Dropdown overlay={menu} placement="bottom">
            <Button>批量操作</Button>
          </Dropdown>,
          // <Popconfirm
          //   title={intl.formatMessage({
          //     id: 'pages.system.role.option.unBindUser',
          //     defaultMessage: '是否批量解除绑定',
          //   })}
          //   key="unBind"
          //   onConfirm={handleUnBind}
          // >
          //   <Button icon={<DisconnectOutlined />}>
          //     {intl.formatMessage({
          //       id: 'pages.system.role.option.unBindUser',
          //       defaultMessage: '批量解绑',
          //     })}
          //   </Button>
          // </Popconfirm>,
        ]}
      />
    </div>
  );
});

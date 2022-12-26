// 资产-产品分类-绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { DeviceBadge, service } from './index';
import { message, Modal } from 'antd';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { DeviceItem } from '@/pages/system/Department/typings';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';
import SearchComponent from '@/components/SearchComponent';
import { ExtraDeviceCard } from '@/components/ProTableCard/CardItems/device';
import { ProTableCard } from '@/components';
import { AssetsModel } from '@/pages/system/Department/Assets';
import encodeQuery from '@/utils/encodeQuery';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
  parentId: string;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const saveRef = useRef<{ saveData: Function }>();

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
      saveRef.current?.saveData();
    } else {
      message.warn('请先勾选数据');
      // props.onCancel();
    }
  };

  const unSelect = () => {
    Models.bindKeys = [];
    AssetsModel.params = {};
  };

  const getSelectedRowsKey = (selectedRows) => {
    return selectedRows.map((item) => item?.id).filter((item2) => !!item2 !== false);
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
      width={'75vw'}
      title="绑定"
    >
      <PermissionModal
        type="device"
        bindKeys={Models.bindKeys}
        parentId={props.parentId}
        ref={saveRef}
        onCancel={(type) => {
          if (type) {
            props.reload();
            props.onCancel();
          }
        }}
      />
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
            <ExtraDeviceCard showBindBtn={false} showTool={false} {...record} cardType={'bind'} />
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
            onSelect: (record, selected, selectedRows) => {
              if (selected) {
                Models.bindKeys = [
                  ...new Set([...Models.bindKeys, ...getSelectedRowsKey(selectedRows)]),
                ];
              } else {
                Models.bindKeys = Models.bindKeys.filter((item) => item !== record.id);
              }
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
            },
          }}
          request={(params) =>
            service.queryDeviceList({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
          }
          params={searchParam}
          height={'none'}
        />
      </div>
    </Modal>
  );
});
export default Bind;

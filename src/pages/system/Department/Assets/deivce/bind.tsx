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
      dataIndex: 'configuration',
      valueType: 'select',
      filterMultiple: true,
      request: async () => {
        const res = await service.getProductList();
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
      render: (_, row) => {
        return row.productName;
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
        onLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'onLine',
        },
        offLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offLine',
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

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  const getParams = (params: any) => {
    console.log(params);
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
    if (Object.keys(params).length) {
      _params.push({
        type: 'and',
        column: 'productId$product-info',
        value: 'id is ' + params.productId[0],
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
          cardRender={(record) => (
            <ExtraDeviceCard showBindBtn={false} showTool={false} {...record} cardType={'bind'} />
          )}
          rowSelection={{
            selectedRowKeys: Models.bindKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              Models.bindKeys = selectedRows.map((item) => item.id);
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

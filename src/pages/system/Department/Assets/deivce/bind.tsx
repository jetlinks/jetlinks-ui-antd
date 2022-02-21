// 资产-产品分类-绑定
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { DeviceBadge, service } from './index';
import { Modal } from 'antd';
import { useParams } from 'umi';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { DeviceItem } from '@/pages/system/Department/typings';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const [perVisible, setPerVisible] = useState(false);

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
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      dataIndex: 'configuration',
      render: (_, row) => {
        return row.productName;
      },
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      render: (_, row) => <DeviceBadge type={row.state.value} text={row.state.text} />,
      search: false,
    },
  ];

  const handleBind = () => {
    if (Models.bindKeys.length) {
      setPerVisible(true);
    } else {
      props.onCancel();
    }
  };

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      onOk={handleBind}
      onCancel={props.onCancel}
      width={990}
      title="绑定"
    >
      <PermissionModal
        visible={perVisible}
        type="device"
        bindKeys={Models.bindKeys}
        onCancel={(type) => {
          setPerVisible(false);
          if (type) {
            props.reload();
            props.onCancel();
          }
        }}
      />
      <ProTable<DeviceItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{
          selectedRowKeys: Models.bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            Models.bindKeys = selectedRows.map((item) => item.id);
          },
        }}
        request={(params) => service.queryDeviceList(params)}
        params={{
          terms: [
            {
              column: 'id',
              termType: 'dim-assets$not',
              value: {
                assetType: 'device',
                targets: [
                  {
                    type: 'org',
                    id: param.id,
                  },
                ],
              },
            },
          ],
        }}
      />
    </Modal>
  );
});
export default Bind;

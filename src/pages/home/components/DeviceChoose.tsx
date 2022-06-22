import { message, Modal } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance';
import SearchComponent from '@/components/SearchComponent';
import type { DeviceItem } from '@/pages/media/Home/typings';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import useHistory from '@/hooks/route/useHistory';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';

interface DeviceModalProps {
  visible: boolean;
  url?: string;
  onCancel: () => void;
}

export default (props: DeviceModalProps) => {
  const intl = useIntl();
  const history = useHistory();

  const actionRef = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const [deviceItem, setDeviceItem] = useState<any>({});

  useEffect(() => {
    if (!props.visible) {
      setDeviceItem({});
      setSearchParam({});
    }
  }, [props.visible]);

  const cancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const columns: ProColumns<DeviceItem>[] = [
    {
      dataIndex: 'id',
      title: '设备ID',
      width: 220,
      ellipsis: true,
    },
    {
      dataIndex: 'name',
      title: '设备名称',
      ellipsis: true,
    },
    {
      dataIndex: 'productName',
      title: '产品名称',
      ellipsis: true,
    },
    {
      dataIndex: 'modifyTime',
      title: '注册时间',
      valueType: 'dateTime',
      width: 200,
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (_, record) => (
        <BadgeStatus
          status={record.state.value}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
            notActive: StatusColorEnum.processing,
          }}
          text={record.state.text}
        />
      ),
      valueType: 'select',
      valueEnum: {
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'online',
        },
      },
      filterMultiple: false,
    },
  ];

  return (
    <Modal
      title={'选择设备'}
      onCancel={cancel}
      onOk={() => {
        if (deviceItem?.id) {
          history.push(
            `${getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], deviceItem.id)}`,
            {
              tab: 'diagnose',
            },
          );
        } else {
          message.warning('请选择设备');
        }
      }}
      destroyOnClose={true}
      maskClosable={false}
      visible={props.visible}
      width={1000}
    >
      <SearchComponent<DeviceItem>
        field={columns}
        enableSave={false}
        model="simple"
        onSearch={async (data) => {
          setSearchParam(data);
        }}
        target="choose-device"
      />
      <ProTable<DeviceItem>
        actionRef={actionRef}
        columns={columns}
        rowKey={'id'}
        search={false}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowSelection={{
          type: 'radio',
          selectedRowKeys: deviceItem.id ? [deviceItem.id] : undefined,
          onSelect: (record) => {
            setDeviceItem(record);
          },
        }}
        tableAlertOptionRender={() => false}
        params={searchParam}
      />
    </Modal>
  );
};

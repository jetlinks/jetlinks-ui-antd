import { message, Modal } from 'antd';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { service } from './index';
import SearchComponent from '@/components/SearchComponent';
import { DeviceItem } from '@/pages/media/Home/typings';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import useHistory from '@/hooks/route/useHistory';

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

  const jumpChannel = useCallback(() => {
    if (deviceItem && deviceItem.id) {
      history.push(`${props.url}?id=${deviceItem.id}&type=${deviceItem.provider}`);
    } else {
      message.warning('请选择设备');
    }
  }, [props.url, deviceItem]);

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
      dataIndex: 'channelNumber',
      title: intl.formatMessage({
        id: 'pages.media.device.channelNumber',
        defaultMessage: '通道数量',
      }),
      valueType: 'digit',
      hideInSearch: true,
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
      onOk={jumpChannel}
      destroyOnClose={true}
      maskClosable={false}
      visible={props.visible}
      width={800}
    >
      <SearchComponent<DeviceItem>
        field={columns}
        enableSave={false}
        onSearch={async (data) => {
          setSearchParam(data);
        }}
        target="media-home-device"
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
        tableAlertRender={false}
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

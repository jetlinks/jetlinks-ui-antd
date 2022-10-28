import { Badge, message, Modal } from 'antd';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { statusMap } from '@/pages/device/Instance';
import { service } from './index';
import { useCallback, useRef, useState } from 'react';
import ProTable from '@jetlinks/pro-table';
import type { ActionType } from '@jetlinks/pro-table';

type BindDeviceType = {
  cardId: string;
  onCancel: () => void;
  onOk: () => void;
};

const BindDevice = (props: BindDeviceType) => {
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKey, setBindKey] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      valueType: 'dateTime',
      render: (_: any, row) => {
        return row.registryTime ? moment(row.registryTime).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '90px',
      valueType: 'select',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueEnum: {
        notActive: {
          text: '禁用',
          status: 'notActive',
        },
        offline: {
          text: '离线',
          status: 'offline',
        },
        online: {
          text: '在线',
          status: 'online',
        },
      },
      filterMultiple: false,
    },
  ];

  const submit = useCallback(async () => {
    setLoading(true);
    const resp = await service.bind(props.cardId, bindKey[0]);
    setLoading(false);
    if (resp.status === 200) {
      message.success('操作成功');
      props?.onOk();
    }
  }, [bindKey]);

  return (
    <Modal
      title={'选择设备'}
      width={1000}
      visible={true}
      confirmLoading={loading}
      onCancel={props.onCancel}
      onOk={submit}
    >
      <SearchComponent<DeviceInstance>
        field={columns}
        target="iot-card-bind-device"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTable
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        request={(params) =>
          service.queryUnbounded({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [bindKey],
          onSelect: (record) => {
            setBindKey(record.id);
          },
        }}
      />
    </Modal>
  );
};

export default BindDevice;

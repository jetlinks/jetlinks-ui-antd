import { Modal } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge } from 'antd';
import { useRef, useState } from 'react';
import { service } from '@/pages/link/Channel/Opcua';
import moment from 'moment';
import { onlyMessage } from '@/utils/util';

interface Props {
  id: string;
  close: () => void;
}

const BindDevice = (props: Props) => {
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [keys, setKeys] = useState<any>([]);
  const [bindDevice, setBindDevice] = useState<any>([]);

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('禁用', 'processing');
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const columns: ProColumns<any>[] = [
    {
      title: '设备ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '注册时间',
      // dataIndex: 'registryTime',
      render: (_, record) => (
        <>{record.registryTime ? moment(record.registryTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => <Badge text={state?.text} status={statusMap.get(state.value)} />,
      valueType: 'select',
      valueEnum: {
        online: {
          text: '在线',
          status: 'disabled',
        },
        offline: {
          text: '离线',
          status: 'offline',
        },
        notActive: {
          text: '禁用',
          status: 'notActive',
        },
      },
    },
  ];

  const save = () => {
    if (bindDevice && bindDevice.length !== 0) {
      const params = bindDevice.map((item: any) => ({
        opcUaId: props.id,
        deviceId: item.id,
        deviceName: item.name,
        productId: item.productId,
        productName: item.productName,
      }));
      service.bind(params).then((res) => {
        if (res.status === 200) {
          onlyMessage('绑定成功');
          props.close();
        }
      });
    } else {
      onlyMessage('请勾选数据', 'error');
    }
  };

  // useEffect(() => {
  //   console.log(props.id);
  // }, []);

  return (
    <Modal
      title={'绑定设备'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={() => {
        save();
      }}
      width={1300}
      permissionCode={'device/Instance'}
      permission={['edit', 'view']}
    >
      <SearchComponent
        field={columns}
        model={'simple'}
        target="bindDevice"
        defaultParam={[
          { column: 'productId$dev-protocol', value: 'opc-ua' },
          { column: 'id$opc-bind$not', value: props.id, type: 'and' },
        ]}
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable
        actionRef={actionRef}
        params={param}
        columns={columns}
        rowKey="id"
        search={false}
        columnEmptyText={''}
        request={async (params) =>
          service.getDevice({
            ...params,
            sorts: [{ name: 'createTime', order: 'desc' }],
          })
        }
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (selectedRowKeys, selectedRows) => {
            setBindDevice(selectedRows);
            setKeys(selectedRowKeys);
          },
        }}
      />
    </Modal>
  );
};
export default BindDevice;

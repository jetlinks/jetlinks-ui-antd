import { Modal } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, message } from 'antd';
import { useRef, useState } from 'react';
import { service } from '@/pages/link/Channel/Modbus';
import moment from 'moment';

interface Props {
  id: string;
  close: () => void;
}

const BindDevice = (props: Props) => {
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [keys, setKeys] = useState<any>([]);

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const columns: ProColumns<any>[] = [
    {
      title: '设备ID',
      dataIndex: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
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
    },
  ];

  const save = () => {
    service.bind(keys, props.id).then((res) => {
      if (res.status === 200) {
        message.success('绑定成功');
        props.close();
      }
    });
  };

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
      permissionCode={'link/Channel/Modbus'}
      permission={['add', 'edit', 'view']}
    >
      <SearchComponent
        field={columns}
        target="bindDevice"
        defaultParam={[{ column: 'id$modbus-master$not', value: props.id }]}
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
        request={async (params) =>
          service.getDevice({
            ...params,
            sorts: [{ name: 'createTime', order: 'desc' }],
          })
        }
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (selectedRowKeys) => {
            setKeys(selectedRowKeys);
          },
        }}
      />
    </Modal>
  );
};
export default BindDevice;

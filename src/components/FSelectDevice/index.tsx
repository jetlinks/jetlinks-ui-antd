import { Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { connect } from '@formily/react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { useIntl } from '@@/plugin-locale/localeExports';
import Service from '@/pages/device/Instance/service';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export const service = new Service('device/instance');
const FSelectDevice = connect((props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DeviceInstance>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.productName',
        defaultMessage: '产品名称',
      }),
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'description',
      width: '15%',
      ellipsis: true,
    },
  ];

  return (
    <>
      <Input
        size="small"
        value={props.value}
        addonAfter={<EditOutlined onClick={() => setVisible(true)} />}
      />
      {visible && (
        <Modal
          visible
          title="选择设备"
          width="80vw"
          onCancel={() => setVisible(false)}
          onOk={() => {
            setVisible(false);
            props.onChange('test');
          }}
        >
          <ProTable<DeviceInstance>
            rowSelection={{
              type: 'radio',
            }}
            columns={columns}
            actionRef={actionRef}
            request={(params) => service.query(params)}
          />
        </Modal>
      )}
    </>
  );
});

export default FSelectDevice;

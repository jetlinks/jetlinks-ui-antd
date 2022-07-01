import { Badge, Button, Modal } from 'antd';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { service, statusMap } from '@/pages/device/Instance';
import { useIntl } from 'umi';
import moment from 'moment';

interface Props {
  data: Partial<DeviceInstance>;
  onCancel: () => void;
  onOk: (parentId: string) => void;
}

const BindParentDevice = (props: Props) => {
  const intl = useIntl();

  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '设备名称',
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '所属产品',
      ellipsis: true,
      dataIndex: 'productName',
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      ellipsis: true,
      width: '200px',
      render: (text: any) => (!!text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      width: 100,
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueType: 'select',
      valueEnum: {
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          value: 'notActive',
        },
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          value: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          value: 'online',
        },
      },
    },
  ];

  const submitBtn = async () => {
    // const resp = await service.bindDevice(InstanceModel.detail.id!, bindKeys);
    // if (resp.status === 200) {
    //   props.onCancel();
    //   setBindKeys([]);
    //   actionRef.current?.reset?.();
    // }
  };

  return (
    <Modal
      maskClosable={false}
      title="绑定父设备"
      visible
      width={1000}
      onOk={() => {
        submitBtn();
      }}
      onCancel={() => {
        props.onCancel();
        setBindKeys([]);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            props.onCancel();
            setBindKeys([]);
            actionRef.current?.reset?.();
          }}
        >
          取消
        </Button>,
        <Button
          disabled={!(bindKeys.length > 0)}
          key="submit"
          type="primary"
          onClick={() => {
            submitBtn();
          }}
        >
          确认
        </Button>,
      ]}
    >
      <SearchComponent<DeviceInstance>
        field={[...columns]}
        target="parents-device-bind"
        enableSave={false}
        model={'simple'}
        defaultParam={[
          {
            terms: [
              {
                column: 'productId$product-info',
                value: [
                  {
                    column: 'deviceType',
                    termType: 'eq',
                    value: 'gateway',
                  },
                ],
              },
            ],
          },
          {
            terms: [{ column: 'id$not', value: props.data.id!, type: 'and' }],
          },
        ]}
        onSearch={(param) => {
          actionRef.current?.reset?.();
          setSearchParams(param);
        }}
      />
      <ProTable<DeviceInstance>
        search={false}
        columns={columns}
        size="small"
        rowSelection={{
          type: 'radio',
          selectedRowKeys: bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setBindKeys(selectedRows.map((item) => item.id));
          },
        }}
        tableAlertRender={false}
        actionRef={actionRef}
        params={searchParams}
        rowKey="id"
        toolBarRender={false}
        pagination={{
          pageSize: 10,
        }}
        request={(params) => service.query({ ...params })}
      />
    </Modal>
  );
};

export default BindParentDevice;

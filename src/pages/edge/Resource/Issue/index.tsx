import { Badge, Modal } from 'antd';
import { DeviceInstance } from '@/pages/device/Instance/typings';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Key, useRef, useState } from 'react';
import moment from 'moment';
import { service } from '../index';
import SearchComponent from '@/components/SearchComponent';
import { statusMap } from '@/pages/device/Instance';
import styles from '@/pages/link/AccessConfig/Detail/components/Network/index.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import { onlyMessage } from '@/utils/util';
import Result from './Result';
interface Props {
  data: Partial<ResourceItem>;
  cancel: () => void;
}

export default (props: Props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
      ellipsis: true,
      fixed: 'left',
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
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      width: '90px',
      valueType: 'select',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueEnum: {
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '禁用',
          }),
          status: 'notActive',
        },
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

  const [data, setData] = useState<Partial<DeviceInstance>[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <Modal
      open
      title={'下发设备'}
      onOk={async () => {
        if (data.length) {
          setVisible(true);
        } else {
          onlyMessage('请选择设备', 'error');
        }
      }}
      onCancel={() => {
        props.cancel();
      }}
      width={1000}
    >
      <div className={styles.alert}>
        <InfoCircleOutlined style={{ marginRight: 10 }} />
        离线设备无法进行设备模板下发
      </div>
      <SearchComponent<DeviceInstance>
        field={columns}
        enableSave={false}
        model="simple"
        target="edge-resource-issue"
        onSearch={(param) => {
          actionRef.current?.reset?.();
          setSearchParams(param);
        }}
      />
      <ProTable<DeviceInstance>
        tableAlertRender={false}
        rowSelection={{
          type: 'checkbox',
          onSelect: (selectedRow: any, selected: any) => {
            let newSelectKeys = [...data];
            if (selected) {
              newSelectKeys.push({ ...selectedRow });
            } else {
              newSelectKeys = newSelectKeys.filter((item) => item.id !== selectedRow.id);
            }
            setData(newSelectKeys);
          },
          onSelectAll: (selected: boolean, _: any, changeRows: any) => {
            let newSelectKeys = [...data];
            if (selected) {
              changeRows.forEach((item: any) => {
                newSelectKeys.push({ ...item });
              });
            } else {
              newSelectKeys = newSelectKeys.filter((a) => {
                return !changeRows.some((b: any) => b.id === a.id);
              });
            }
            setData(newSelectKeys);
          },
          selectedRowKeys: data?.map((item) => item.id) as Key[],
        }}
        params={searchParams}
        toolBarRender={false}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        search={false}
        columnEmptyText={''}
        columns={columns}
        actionRef={actionRef}
        request={(params) =>
          service.queryDeviceList({
            ...params,
            terms: [
              ...(params?.terms || []),
              {
                terms: [
                  {
                    termType: 'eq',
                    column: 'productId$product-info',
                    value: 'accessProvider is official-edge-gateway',
                  },
                ],
                type: 'and',
              },
            ],
            sorts: [{ name: 'createTime', order: 'desc' }],
          })
        }
      />
      {visible && (
        <Result
          data={props.data}
          list={data}
          close={() => {
            setVisible(false);
            props.cancel();
          }}
        />
      )}
    </Modal>
  );
};
